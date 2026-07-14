> [!summary]
> Basic Auth sends a username and password with every request. It is simple, but safe only over HTTPS and best limited to controlled tools.

Map: [[Upskill/SysDes/System Design|System Design]]

## How It Works

The client joins `username:password`, Base64-encodes it, and sends it in the `Authorization` header.

```http
GET /reports HTTP/1.1
Host: internal.example.com
Authorization: Basic YWxpY2U6c2VjcmV0
```

Base64 is encoding, not encryption. Anyone who obtains the header can recover the credentials.

## Quick Client Example

```bash
curl --user "$BASIC_USER:$BASIC_PASSWORD" https://internal.example.com/reports
```

Using an environment variable avoids placing the password directly in shell history, but the process still handles the raw credential.

## Java Client Example

```java
String credentials = System.getenv("BASIC_USER")
    + ":"
    + System.getenv("BASIC_PASSWORD");

String encoded = Base64.getEncoder().encodeToString(
    credentials.getBytes(StandardCharsets.UTF_8)
);

HttpRequest request = HttpRequest.newBuilder(
        URI.create("https://internal.example.com/reports")
    )
    .header("Authorization", "Basic " + encoded)
    .GET()
    .build();
```

Use a credential provider or secret manager in a real application. Do not hard-code the username or password.

## Use It When

- A small internal script or tool needs minimal authentication.
- Both client and server are controlled by the same team.
- TLS, secret storage, rotation, and rate limiting are enforced.

## Avoid It When

- Building a public user login or browser-based application.
- MFA, delegated access, fine-grained scopes, or easy revocation are required.
- The same password would be sent to many independent services.

> [!warning]
> Never accept Basic Auth over plain HTTP. Treat every captured header as a captured password.

Related: [[Authentication Overview]]

#authentication #http

---

## References

- [RFC 7617: The Basic HTTP Authentication Scheme](https://www.rfc-editor.org/rfc/rfc7617.html) - Standard Basic authentication syntax and behavior.
