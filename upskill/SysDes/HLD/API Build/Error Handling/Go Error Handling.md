> [!summary]
> Idiomatic Go returns errors as values, wraps them with operation context, and inspects the resulting chain with `errors.Is` or `errors.As`.

Map: [[Upskill/SysDes/HLD/API Build/Error Handling/Error Handling|Error Handling]]

## Avoid Panic-Prone Assertions

Use the comma-ok form when reading typed values from an interface or context.

```go
user, ok := ctx.Value(userKey{}).(*User)
if !ok || user == nil {
    return fmt.Errorf("authenticate request: user missing from context")
}
```

A direct assertion panics when the key is absent or the value has another type:

```go
user := ctx.Value(userKey{}).(*User)
```

Prefer a private typed context key instead of a plain string to avoid collisions.

## Wrap With Context

```go
func saveUser(db *DB, user User) error {
    if err := db.Insert(user); err != nil {
        return fmt.Errorf("save user %q: %w", user.ID, err)
    }
    return nil
}
```

`%w` preserves the cause so callers can inspect it without parsing text.

```go
if errors.Is(err, sql.ErrNoRows) {
    // stable comparison through the chain
}

var validationErr *ValidationError
if errors.As(err, &validationErr) {
    // access typed details
}
```

## Pick One Ownership Rule

A useful service convention is:

1. functions wrap and return errors with operation context
2. boundary handlers translate errors into HTTP or RPC responses
3. the request or job boundary logs the final failure once
4. panics are reserved for impossible startup or invariant failures
5. ignored errors require an explicit explanation

Mixing wrapping, logging, panicking, discarding, and returning zero values at random makes failures hard to trace.

## Related

- [[Upskill/ProgramLang/Golang/Go|Go]]
- [[Upskill/ProgramLang/Golang/Context|Context]]
- [[Upskill/SysDes/HLD/API Build/Error Handling/TypeScript Error Handling|TypeScript Error Handling]]

#golang #error-handling

---

## References

- [Working with Errors in Go 1.13](https://go.dev/blog/go1.13-errors) - Wrapping and chain inspection.
- [`errors` package](https://pkg.go.dev/errors) - Standard error-chain API.
- [The Error Handling Problem That Followed Me Everywhere](https://www.youtube.com/watch?v=XDTov7xaD7g) - Source examples adapted into the note.
