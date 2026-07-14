> [!summary]
> Digest Auth uses a server challenge and a computed response so the password is not sent directly, but it is mainly a legacy compatibility method.

Map: [[Upskill/SysDes/System Design|System Design]]

## Flow

1. The client requests a protected resource.
2. The server replies with `401` and a nonce in `WWW-Authenticate`.
3. The client calculates a digest from the credentials, request details, and nonce.
4. The server calculates the expected digest and compares it.

```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Digest realm="reports", nonce="abc123", algorithm=SHA-256, qop="auth"

GET /reports HTTP/1.1
Authorization: Digest username="alice", realm="reports", nonce="abc123", uri="/reports", response="..."
```

## Quick Client Example

```bash
curl --digest --user "$DIGEST_USER:$DIGEST_PASSWORD" https://legacy.example.com/reports
```

## Python Client Example

```python
import os
import requests
from requests.auth import HTTPDigestAuth

response = requests.get(
    "https://legacy.example.com/reports",
    auth=HTTPDigestAuth(
        os.environ["DIGEST_USER"],
        os.environ["DIGEST_PASSWORD"],
    ),
    timeout=10,
)
response.raise_for_status()
```

Let the client library implement the challenge-response calculation. Reimplementing Digest by hand is easy to get wrong.

## What It Improves

- The raw password is not placed in each request.
- A server nonce helps resist simple replay attacks.
- The digest binds authentication to request information.

## Why It Is Rare

- Configuration and interoperability are more complicated than Basic Auth.
- It does not replace TLS.
- Modern applications usually use sessions, API keys, or token protocols.
- Password-derived server data remains sensitive.

> [!note]
> Use Digest only when integrating with a system that already requires it. Do not choose it as the default for a new API.

Related: [[Authentication Overview]]

#authentication #http

---

## References

- [RFC 7616: HTTP Digest Access Authentication](https://www.rfc-editor.org/rfc/rfc7616.html) - Current Digest authentication specification.
- [Requests Authentication](https://requests.readthedocs.io/en/latest/user/authentication/#digest-authentication) - Python Basic and Digest client examples.
