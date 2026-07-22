> [!summary]
> JWT is a compact format for signed or encrypted claims. It is a token format, not an authentication method or complete login protocol.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/API Build/Auth Methods/Authentication Overview]], [[Upskill/SysDes/HLD/API Build/Auth Methods/Bearer Tokens]], [[Upskill/SysDes/HLD/API Build/Auth Methods/OpenID Connect]]

## Structure

A commonly used signed JWT has three Base64URL-encoded parts:

```text
header.payload.signature
```

```json
{
  "iss": "https://idp.example.com",
  "sub": "user-123",
  "aud": "orders-api",
  "scope": "orders:read",
  "exp": 1782372812
}
```

The payload is readable by anyone holding the token unless separate encryption is used. Never place passwords or secrets in claims.

## Verification Example

```python
claims = jwt.decode(
    token,
    public_key,
    algorithms=["RS256"],
    audience="orders-api",
    issuer="https://idp.example.com",
)
```

Use a maintained library. Decoding without signature and claim validation does not authenticate anything.

## Validate Every Time

- Signature with a trusted key.
- Fixed algorithm allowlist, never one chosen blindly from the token.
- `iss` for the expected issuer.
- `aud` for this exact service.
- `exp` and, when present, `nbf`.
- Token type, scopes, and application-specific claims.

## Strengths

- Services can verify signed claims without a database lookup.
- Standard claims and key rotation work across many platforms.
- Useful for short-lived access and identity tokens.

## Tradeoffs

- Revocation before expiry requires short lifetimes or additional state.
- Claims become stale after issue.
- Large tokens add request overhead.
- Incorrect algorithm, key, issuer, or audience handling causes serious vulnerabilities.

> [!important]
> Prefer asymmetric signing when many services verify tokens. The issuer keeps the private key; services receive only public verification keys.

#authentication #jwt

---

## References

- [RFC 7519: JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519.html) - JWT structure and registered claims.
- [RFC 8725: JWT Best Current Practices](https://www.rfc-editor.org/rfc/rfc8725.html) - Secure implementation and validation guidance.
