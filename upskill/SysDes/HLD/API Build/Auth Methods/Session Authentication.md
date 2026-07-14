> [!summary]
> Session authentication stores login state on the server and gives the browser an opaque session identifier in a protected cookie.

Map: [[Upskill/SysDes/System Design|System Design]]

## Flow

1. The user submits credentials over HTTPS.
2. The server verifies them and creates a random session ID.
3. Session data is stored in a database or Redis with an expiry.
4. The browser receives the ID in a cookie.
5. Each request resolves the cookie to server-side session state.

```http
HTTP/1.1 200 OK
Set-Cookie: session_id=RANDOM_VALUE; Path=/; HttpOnly; Secure; SameSite=Lax
```

## Server-Side Sketch

```python
session_id = secrets.token_urlsafe(32)
session_store.set(session_id, {"user_id": user.id}, ttl=1800)

response.set_cookie(
    "session_id",
    session_id,
    httponly=True,
    secure=True,
    samesite="Lax",
    max_age=1800,
)
```

The framework API varies, but the important properties are a random opaque ID, server-side expiry, and protected cookie flags.

## Strengths

- Immediate revocation by deleting the session.
- The browser stores no user claims or long-lived credential.
- Natural fit for server-rendered web apps and browser backends.

## Risks and Controls

- **Session fixation:** rotate the session ID after login and privilege changes.
- **Session theft:** use HTTPS, `Secure`, `HttpOnly`, short expiry, and device-aware monitoring.
- **CSRF:** use `SameSite`, CSRF tokens, and origin checks for state-changing requests.
- **Scaling:** use a shared session store or carefully designed sticky sessions.

Related: [[Authentication Overview]] and [[Single Sign-On]]

#authentication #web-security

---

## References

- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) - Session ID, cookie, rotation, and expiry guidance.
