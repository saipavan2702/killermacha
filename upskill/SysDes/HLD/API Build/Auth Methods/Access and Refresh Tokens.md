> [!summary]
> Short-lived access tokens limit exposure; longer-lived refresh tokens obtain replacements without making the user log in repeatedly.

Map: [[Upskill/SysDes/System Design|System Design]]

## Different Jobs

| Token | Sent to | Typical role |
| --- | --- | --- |
| Access token | Resource API | Authorize a request for a short period |
| Refresh token | Authorization server only | Obtain a new access token |

A refresh token is not an access token and must never be accepted by a resource API.

## Refresh Request

```http
POST /oauth2/token HTTP/1.1
Host: idp.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=LONG_LIVED_SECRET&client_id=my-client
```

```json
{
  "access_token": "NEW_SHORT_LIVED_TOKEN",
  "refresh_token": "ROTATED_REFRESH_TOKEN",
  "token_type": "Bearer",
  "expires_in": 600
}
```

## Rotation

On each refresh:

1. Invalidate the presented refresh token.
2. Issue a new access token and refresh token.
3. If an invalidated token appears again, treat it as possible theft.
4. Revoke the token family and require a fresh login.

This is refresh token rotation with reuse detection.

## Rotation Sketch

```python
import hashlib
import hmac

def rotate_refresh_token(raw_token: str):
    digest = hmac.new(
        REFRESH_TOKEN_PEPPER,
        raw_token.encode(),
        hashlib.sha256,
    ).digest()

    with database.transaction():
        current = refresh_tokens.find_for_update(digest)
        if current is None or current.revoked:
            if current is not None:
                refresh_tokens.revoke_family(current.family_id)
            raise ReauthenticationRequired()

        refresh_tokens.revoke(current.id)
        access = issue_access_token(current.user_id)
        replacement = issue_refresh_token(
            current.user_id,
            family_id=current.family_id,
        )
        return access, replacement
```

The transaction prevents two concurrent uses from both succeeding. Store a verifier, not the raw refresh token, and revoke the whole family when reuse indicates possible theft.

## Storage

- Browser backend: keep refresh tokens server-side and expose only a protected session cookie.
- Mobile or desktop app: use the operating system's secure credential store.
- Database: store a hash or secure verifier when the design permits.
- Never put refresh tokens in URLs, logs, or source code.

## Revocation Events

Revoke refresh tokens on logout, password reset, account disablement, device removal, suspicious reuse, or administrative action.

Related: [[Authentication Overview]], [[Bearer Tokens]], and [[OAuth 2.0]]

#authentication #oauth

---

## References

- [RFC 6749: OAuth 2.0, Refreshing an Access Token](https://www.rfc-editor.org/rfc/rfc6749.html#section-6) - Refresh token request and response semantics.
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html) - Rotation, sender constraints, and modern OAuth security guidance.
