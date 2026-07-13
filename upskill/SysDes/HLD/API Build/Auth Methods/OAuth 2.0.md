# OAuth 2.0

> [!summary]
> OAuth 2.0 lets a client obtain limited access to a resource without receiving the user's password. It is delegated authorization, not user authentication by itself.

## Roles

- **Resource owner:** the user or entity granting access.
- **Client:** the application requesting access.
- **Authorization server:** authenticates the user and issues tokens.
- **Resource server:** the API that accepts access tokens.

## Authorization Code with PKCE

This is the normal choice for browser, mobile, and server-side user flows.

```http
GET /authorize?
  response_type=code&
  client_id=reports-app&
  redirect_uri=https%3A%2F%2Freports.example.com%2Fcallback&
  scope=reports.read&
  state=RANDOM_CSRF_VALUE&
  code_challenge=BASE64URL_SHA256_VERIFIER&
  code_challenge_method=S256
```

After the redirect, the client exchanges the short-lived code through a back-channel request:

```http
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=CODE&code_verifier=ORIGINAL_VERIFIER&client_id=reports-app
```

PKCE binds the authorization code to the client that started the flow. `state` binds the response to the browser transaction and helps prevent CSRF.

## Go PKCE Helper

```go
package oauthflow

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
)

func NewPKCE() (verifier string, challenge string, err error) {
	random := make([]byte, 32)
	if _, err = rand.Read(random); err != nil {
		return "", "", err
	}

	verifier = base64.RawURLEncoding.EncodeToString(random)
	digest := sha256.Sum256([]byte(verifier))
	challenge = base64.RawURLEncoding.EncodeToString(digest[:])
	return verifier, challenge, nil
}
```

Keep the verifier in the user's short-lived login transaction. Send only the challenge in the authorization request, then send the verifier during the code exchange.

## Common Grants

| Grant | Use |
| --- | --- |
| Authorization Code + PKCE | User-delegated access |
| Client Credentials | Machine-to-machine access without a user |
| Refresh Token | Renew a delegated session |

Avoid the Implicit grant and Resource Owner Password Credentials grant in new systems.

## What OAuth Does Not Provide

An access token tells an API what access was delegated. It does not standardize a user login identity for the client. Use [[OpenID Connect]] when the client needs to authenticate the user.

## Security Checklist

- Register exact redirect URIs.
- Use Authorization Code with PKCE.
- Generate unpredictable `state` and PKCE values per request.
- Give tokens narrow audiences, scopes, and lifetimes.
- Keep client secrets only in confidential server-side clients.
- Validate tokens at every resource server.

Related: [[Authentication Overview]], [[Access and Refresh Tokens]], and [[OpenID Connect]]

#authentication #oauth

---

## References

- [RFC 6749: The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html) - OAuth roles, grants, tokens, and endpoints.
- [RFC 7636: Proof Key for Code Exchange](https://www.rfc-editor.org/rfc/rfc7636.html) - PKCE challenge and verifier flow.
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html) - Current security recommendations and deprecated patterns.
