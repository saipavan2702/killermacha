> [!summary]
> OpenID Connect adds a standard identity layer to OAuth 2.0 so a client can verify who authenticated and obtain agreed identity claims.

Map: [[Upskill/SysDes/System Design|System Design]]

## Main Parties

- **End user:** the person authenticating.
- **OpenID Provider:** the identity provider that authenticates the user.
- **Relying Party:** the application trusting the provider.

## What OIDC Adds

The authorization request includes the `openid` scope:

```http
GET /authorize?
  response_type=code&
  client_id=reports-app&
  scope=openid%20profile%20email&
  redirect_uri=https%3A%2F%2Freports.example.com%2Fcallback&
  state=RANDOM_STATE&
  nonce=RANDOM_NONCE&
  code_challenge=PKCE_CHALLENGE&
  code_challenge_method=S256
```

After the code exchange, the client receives an ID token for identity and may also receive an access token for APIs.

| Token | Audience | Purpose |
| --- | --- | --- |
| ID token | Client application | Proves the authentication event and carries identity claims |
| Access token | Resource API | Authorizes API access |

Do not send an ID token to an API as if it were an access token.

## ID Token Claims

```json
{
  "iss": "https://idp.example.com",
  "sub": "stable-user-123",
  "aud": "reports-app",
  "exp": 1782372812,
  "nonce": "RANDOM_NONCE"
}
```

Use `sub` together with `iss` as the stable external identity. Email addresses can change and may not be unique across providers.

## Spring OIDC User Example

```java
record ExternalIdentity(String issuer, String subject, String email) {}

@GetMapping("/me")
ExternalIdentity currentUser(@AuthenticationPrincipal OidcUser user) {
    return new ExternalIdentity(
        user.getIdToken().getIssuer().toString(),
        user.getSubject(),
        user.getEmail()
    );
}
```

Use `(issuer, subject)` as the database identity key. Treat email and profile fields as attributes, not as the primary identity or automatic authorization roles.

## Validate

- Signature against the provider's trusted keys.
- Exact issuer and intended client audience.
- Expiry, issued time, and authorized party where applicable.
- The original `nonce` and `state` transaction values.
- Authorization code and PKCE rules.

OIDC is a common protocol used to build [[Single Sign-On]].

Related: [[Authentication Overview]], [[OAuth 2.0]], and [[JSON Web Tokens]]

#authentication #oidc

---

## References

- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) - ID tokens, claims, flows, and validation.
- [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html) - Provider metadata and key discovery.
- [Spring Security OAuth 2.0 Login](https://docs.spring.io/spring-security/reference/servlet/oauth2/login/index.html) - Framework support for Authorization Code and OIDC login.
