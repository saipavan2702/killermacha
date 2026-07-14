> [!summary]
> A bearer token grants access to whoever possesses it, so confidentiality in transit and storage is the main security boundary.

Map: [[Upskill/SysDes/System Design|System Design]]

## Request Example

```http
GET /v1/profile HTTP/1.1
Host: api.example.com
Authorization: Bearer ACCESS_TOKEN
```

The token may be an opaque random value or a structured value such as a JWT. Bearer describes how the token is used, not its internal format.

## Java Client Example

```java
HttpRequest request = HttpRequest.newBuilder(uri)
    .header("Authorization", "Bearer " + accessToken)
    .GET()
    .build();
```

## Spring Resource Server Example

Let Spring Security obtain the issuer's public keys and perform JWT validation instead of writing a custom token filter.

```java
@Bean
SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/health").permitAll()
            .anyRequest().authenticated()
        )
        .oauth2ResourceServer(oauth2 ->
            oauth2.jwt(Customizer.withDefaults())
        );
    return http.build();
}
```

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://idp.example.com
          audiences: orders-api
```

The issuer configuration supports signature, expiry, and issuer validation. Configure the expected audience as well so a token issued for another API is rejected.

## Validation

For an opaque token, the API commonly calls an introspection service or looks up server-side state. For a JWT, it can validate the signature and claims locally.

Always check:

- The token is active and unexpired.
- The issuer and audience are expected.
- The token type and signature algorithm are allowed.
- Required scopes or roles cover the requested operation.

## Main Risks

- A stolen token can be replayed until expiry or revocation.
- Tokens can leak through logs, URLs, browser storage, crash reports, and proxies.
- A valid token with the wrong audience must not be accepted.

Keep access tokens short-lived and never place them in query parameters unless a protocol leaves no safer option.

Related: [[Authentication Overview]], [[JSON Web Tokens]], and [[Access and Refresh Tokens]]

#authentication #api

---

## References

- [RFC 6750: OAuth 2.0 Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html) - Bearer header syntax, errors, and security requirements.
- [Spring Security JWT Resource Server](https://docs.spring.io/spring-security/reference/servlet/oauth2/resource-server/jwt.html) - Framework-managed JWT discovery and validation.
