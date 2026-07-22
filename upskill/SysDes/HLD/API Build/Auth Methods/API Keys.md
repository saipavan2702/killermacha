> [!summary]
> An API key usually identifies a calling application or project, not the human using it.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/API Build/Auth Methods/Authentication Overview]], [[Upskill/SysDes/HLD/API Build/Auth Methods/Bearer Tokens]]

## Request Example

```http
GET /v1/usage HTTP/1.1
Host: api.example.com
X-API-Key: key_live_random_secret
```

Prefer a header. Keys in URLs leak more easily through browser history, access logs, analytics, and referrer headers.

## Safe Storage Pattern

Generate a high-entropy secret, show it once, and store only a keyed hash or secure verifier.

```go
func keyMatches(provided string, storedHash []byte, serverSecret []byte) bool {
	mac := hmac.New(sha256.New, serverSecret)
	mac.Write([]byte(provided))
	actual := mac.Sum(nil)
	return hmac.Equal(actual, storedHash)
}
```

The visible prefix can identify the key record; the secret portion proves possession.

## Good Uses

- Server-to-server developer APIs.
- Project-level quotas, billing, and rate limits.
- Low-risk automation where user identity is not needed.

## Limitations

- A key does not normally identify the end user.
- Long-lived keys are easy to forget and difficult to rotate.
- A leaked key grants its holder the same access as the intended client.
- Frontend and mobile binaries cannot safely keep a permanent secret.

## Operational Checklist

- Assign scopes and least privilege.
- Support multiple active keys during rotation.
- Record owner, creation time, last use, and expiry.
- Redact keys from logs and error reports.
- Revoke quickly and alert on unusual use.

#authentication #api

---

## References

- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#api-keys) - Appropriate use and limitations of API keys.
