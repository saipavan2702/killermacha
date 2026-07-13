# Authentication Overview

> [!summary]
> Authentication proves who a caller is. Choose a method from the caller type, client environment, revocation needs, and trust boundary.

## Pick by Use Case

| Need | Start with | Why |
| --- | --- | --- |
| Small internal script | [[Basic Authentication]] | Minimal setup over HTTPS |
| Legacy HTTP challenge-response | [[Digest Authentication]] | Avoids sending the password directly |
| Browser app controlled by one backend | [[Session Authentication]] | Simple revocation and secure cookies |
| Identify an application or project | [[API Keys]] | Simple issuance, quotas, and rotation |
| Call an API with an access token | [[Bearer Tokens]] | Standard HTTP token transport |
| Carry signed claims between services | [[JSON Web Tokens]] | Locally verifiable token format |
| Keep a login alive safely | [[Access and Refresh Tokens]] | Short access lifetime, controlled renewal |
| Let an app access another service | [[OAuth 2.0]] | Delegated authorization |
| Log a user in through an identity provider | [[OpenID Connect]] | Standard identity layer over OAuth 2.0 |
| One company login across many apps | [[Single Sign-On]] | Central identity, MFA, and offboarding |

## Keep the Concepts Separate

- **Authentication:** Who is this caller?
- **Authorization:** What may the caller do?
- **Credential:** What proves the identity, such as a password or private key?
- **Token:** A value issued after authentication or authorization.
- **Protocol:** The rules for exchanging and validating credentials or tokens.

> [!important]
> JWT is a token format, OAuth 2.0 is an authorization framework, OIDC is an authentication protocol, and SSO is a user experience built on shared trust.

## Baseline Rules

1. Use HTTPS everywhere.
2. Prefer established libraries and protocols over custom token formats.
3. Keep secrets out of URLs, logs, source code, and browser storage exposed to JavaScript.
4. Validate issuer, audience, expiry, signature, and intended token type.
5. Support rotation, revocation, timeouts, rate limits, and audit logs.
6. Apply authorization at every protected endpoint after authentication.

## Implementation Deep Dive

- [[Custom JWT and Redis Authentication]] - How a stateful custom token filter differs from standards-based OIDC and Spring Resource Server validation.

#authentication #security

---

## References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) - Authentication design and implementation guidance.
- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) - API authentication, access control, and token guidance.
