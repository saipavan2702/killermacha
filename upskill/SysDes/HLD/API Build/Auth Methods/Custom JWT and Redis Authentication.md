> [!summary]
> A custom JWT and Redis design issues tokens in your own service, checks active-token state on every request, and manually creates Spring Security authentication.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/API Build/Auth Methods/Single Sign-On|Single Sign-On]]

> [!important]
> This is a custom authentication architecture, not an SSO standard. It becomes SSO only when multiple applications deliberately trust the same custom identity service.

## Request Flow

1. The auth service verifies credentials and MFA.
2. It issues a signed JWT containing `jti`, `sub`, roles, `iss`, `aud`, and `exp`.
3. Redis stores the active `jti` or a secure token verifier with the same TTL.
4. The client sends `Authorization: Bearer TOKEN`.
5. A filter verifies the JWT and confirms that its `jti` is active in Redis.
6. The filter creates an `Authentication` and places it in `SecurityContextHolder`.
7. Spring authorization rules and controllers use that request identity.

```text
HTTP request
    -> security filter chain
    -> parse Bearer token
    -> verify signature, issuer, audience, and expiry
    -> check jti in Redis
    -> create Authentication
    -> authorization rules
    -> controller
```

## Dependencies

Let the Spring Boot dependency manager choose compatible versions.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-oauth2-jose</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

`JwtEncoder` signs tokens, `JwtDecoder` verifies them, and `StringRedisTemplate` stores active token IDs.

## Why the Filter Exists

After login, later requests contain only a token. The filter runs before the controller and translates that token into the identity object Spring Security understands.

`OncePerRequestFilter` provides a convenient hook for this work. Calling `chain.doFilter` passes control to the remaining security filters and eventually the controller.

## Step 1: Issue a Token

This service creates a short-lived signed JWT and activates its `jti` in Redis for the same lifetime.

```java
record IssuedToken(String accessToken, Instant expiresAt) {}

@Service
final class TokenService {
    private static final String ISSUER = "https://auth.example.com";
    private static final String AUDIENCE = "orders-api";

    private final JwtEncoder encoder;
    private final ActiveTokenStore activeTokens;
    private final Clock clock;

    TokenService(
            JwtEncoder encoder,
            ActiveTokenStore activeTokens,
            Clock clock) {
        this.encoder = encoder;
        this.activeTokens = activeTokens;
        this.clock = clock;
    }

    IssuedToken issue(Authentication authentication) {
        Instant issuedAt = clock.instant();
        Instant expiresAt = issuedAt.plus(Duration.ofMinutes(15));
        String tokenId = UUID.randomUUID().toString();

        List<String> authorities = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .toList();

        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer(ISSUER)
            .subject(authentication.getName())
            .audience(List.of(AUDIENCE))
            .issuedAt(issuedAt)
            .expiresAt(expiresAt)
            .id(tokenId)
            .claim("authorities", authorities)
            .build();

        JwsHeader header = JwsHeader.with(SignatureAlgorithm.RS256).build();
        String token = encoder.encode(
            JwtEncoderParameters.from(header, claims)
        ).getTokenValue();

        activeTokens.activate(
            tokenId,
            authentication.getName(),
            Duration.between(issuedAt, expiresAt)
        );
        return new IssuedToken(token, expiresAt);
    }
}
```

The `JwtEncoder` must use a private key loaded from a keystore, KMS, or secret manager. Never hard-code a signing key or create a new one on every startup.

## Step 2: Store Active Tokens

Redis stores only the token ID and minimal session data, not the raw bearer token.

```java
@Service
final class ActiveTokenStore {
    private static final String PREFIX = "active-token:";

    private final StringRedisTemplate redis;

    ActiveTokenStore(StringRedisTemplate redis) {
        this.redis = redis;
    }

    void activate(String tokenId, String subject, Duration ttl) {
        redis.opsForValue().set(PREFIX + tokenId, subject, ttl);
    }

    boolean isActive(String tokenId) {
        return tokenId != null
            && Boolean.TRUE.equals(redis.hasKey(PREFIX + tokenId));
    }

    void revoke(String tokenId) {
        if (tokenId != null) {
            redis.delete(PREFIX + tokenId);
        }
    }
}
```

## Step 3: Authenticate Login

The `AuthenticationManager` verifies the submitted credentials. Only then does the application issue a token.

```java
record LoginRequest(String username, String password) {}
record LoginResponse(String accessToken, Instant expiresAt) {}

@RestController
final class LoginController {
    private final AuthenticationManager authenticationManager;
    private final TokenService tokens;

    LoginController(
            AuthenticationManager authenticationManager,
            TokenService tokens) {
        this.authenticationManager = authenticationManager;
        this.tokens = tokens;
    }

    @PostMapping("/login")
    LoginResponse login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken.unauthenticated(
                request.username(),
                request.password()
            )
        );

        IssuedToken issued = tokens.issue(authentication);
        return new LoginResponse(issued.accessToken(), issued.expiresAt());
    }
}
```

This assumes `AuthenticationManager` is backed by a configured `UserDetailsService` or `AuthenticationProvider` and a strong password encoder.

## Step 4: Validate Every Request

This filter is the article's core idea made concrete. Spring's `JwtDecoder` performs cryptographic and claim validation; Redis decides whether the otherwise-valid token is still active.

```java
@Component
final class RedisBackedJwtFilter extends OncePerRequestFilter {
    private final BearerTokenResolver bearerTokens =
        new DefaultBearerTokenResolver();
    private final JwtDecoder decoder;
    private final ActiveTokenStore activeTokens;

    RedisBackedJwtFilter(
            JwtDecoder decoder,
            ActiveTokenStore activeTokens) {
        this.decoder = decoder;
        this.activeTokens = activeTokens;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws IOException, ServletException {

        try {
            String bearer = bearerTokens.resolve(request);
            if (bearer != null) {
                Jwt jwt = decoder.decode(bearer);

                if (!activeTokens.isActive(jwt.getId())) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }

                List<GrantedAuthority> authorities = Optional.ofNullable(
                        jwt.getClaimAsStringList("authorities")
                    )
                    .orElse(List.of())
                    .stream()
                    .map(SimpleGrantedAuthority::new)
                    .toList();

                Authentication authentication = new JwtAuthenticationToken(
                    jwt,
                    authorities,
                    jwt.getSubject()
                );
                SecurityContextHolder.getContext()
                    .setAuthentication(authentication);
            }
        } catch (JwtException | OAuth2AuthenticationException invalidToken) {
            SecurityContextHolder.clearContext();
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        chain.doFilter(request, response);
    }
}
```

Configure `JwtDecoder` with the public key plus validators for the expected issuer and audience. The decoder must reject invalid signatures, algorithms, expiry, and claims before Redis is checked.

## Step 5: Wire Security

The application is stateless at the HTTP-session layer, while Redis remains the server-side source of active token state.

```java
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            RedisBackedJwtFilter jwtFilter) throws Exception {

        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/health").permitAll()
                .anyRequest().authenticated()
            )
            .exceptionHandling(errors -> errors
                .authenticationEntryPoint(
                    new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)
                )
            )
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
```

CSRF is disabled here because this example authenticates API requests only through an explicit bearer header. Keep CSRF protection when authentication is carried automatically by browser cookies.

## Step 6: Revoke on Logout

Because the filter creates a `JwtAuthenticationToken`, the current JWT is available as the authenticated principal.

```java
@RestController
final class LogoutController {
    private final ActiveTokenStore activeTokens;

    LogoutController(ActiveTokenStore activeTokens) {
        this.activeTokens = activeTokens;
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void logout(@AuthenticationPrincipal Jwt jwt) {
        activeTokens.revoke(jwt.getId());
    }
}
```

```http
POST /login HTTP/1.1
Content-Type: application/json

{"username":"alice","password":"correct-password"}

GET /orders/42 HTTP/1.1
Authorization: Bearer SIGNED_JWT

POST /logout HTTP/1.1
Authorization: Bearer SIGNED_JWT
```

## What the Article Simplifies

The article's small filter checks Redis and then hard-codes `"user"` with an empty authority list. That illustrates the filter chain, but it is not sufficient for production.

A real implementation must:

- Parse only the `Bearer` authorization scheme.
- Verify the JWT signature and fixed algorithm allowlist.
- Validate `iss`, `aud`, `exp`, token type, and other required claims.
- Use the validated `sub` as the principal.
- Map trusted roles or scopes into authorities.
- Return `401` for invalid or inactive tokens.
- Define behavior when Redis is unavailable.

## Redis Model

Prefer storing a token ID or secure verifier instead of the raw bearer token.

```text
Key:   active-token:{jti}
Value: user ID or minimal session metadata
TTL:   token expiry - current time
```

Logout deletes the key. The next request fails the active-token check even when the JWT's signature and expiry remain valid.

## Stateful Tradeoff

| Benefit | Cost |
| --- | --- |
| Immediate revocation | Redis lookup on every protected request |
| Central active-session view | Redis becomes latency-sensitive infrastructure |
| Simple forced logout | Availability policy must be explicit |
| Server-controlled session lifetime | Less benefit from self-contained JWT validation |

If every request must query Redis, an opaque random token may be simpler than a JWT because Redis is already the source of truth.

## Compared with Spring Resource Server

With an external IdP, Spring's `oauth2ResourceServer(...jwt...)` filter validates signed tokens using the provider's public keys and fills the same `SecurityContextHolder`. It replaces the custom parsing and authentication filter. Redis is needed only if the design adds introspection, an allowlist, or a revocation denylist.

See [[Single Sign-On]] for the complete comparison and [[Bearer Tokens]] for framework-managed API validation.


#authentication #jwt

---

## References

- [If an Interviewer Asked You About Single Sign-On, Could You Explain It Clearly?](https://freedium-mirror.cfd/https://medium.com/stackademic/if-an-interviewer-asked-you-about-single-sign-on-sso-could-you-explain-it-clearly-42bd4f7a1040) - Source article for the custom JWT, Redis, and filter approach.
- [Spring Security Authentication Architecture](https://docs.spring.io/spring-security/reference/servlet/authentication/architecture.html) - Authentication, security context, providers, and filter-chain concepts.
- [Spring Security JWT Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html) - Framework-managed JWT verification and authentication.
- [Spring Data Redis `StringRedisTemplate`](https://docs.spring.io/spring-data/data-redis/docs/current/api/org/springframework/data/redis/core/StringRedisTemplate.html) - String-based Redis operations used by the active-token store.
- [Spring Security `NimbusJwtEncoder`](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/oauth2/jwt/NimbusJwtEncoder.html) - Framework JWT signing implementation.
- [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html) - Secure JWT validation guidance.
