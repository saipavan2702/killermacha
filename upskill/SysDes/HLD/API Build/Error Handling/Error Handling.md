> [!summary]
> Good error handling makes failures visible, preserves their cause and context, and prevents partial work from being mistaken for success.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/LLD/Clean Code Patterns|Clean Code Patterns]], [[Upskill/SysDes/HLD/API Build/Auth Methods/Authentication Overview|Authentication Methods]], [[Upskill/SysDes/HLD/Event-Driven Architecture|Event-Driven Architecture]], [[Upskill/SysDes/HLD/Message Queues|Message Queues]]

## Topics

- [[Upskill/SysDes/HLD/API Build/Error Handling/TypeScript Error Handling|TypeScript Error Handling]] - Await promises and normalize unknown failures.
- [[Upskill/SysDes/HLD/API Build/Error Handling/Side Effects and Compensation|Side Effects and Compensation]] - Handle partial success across mutations.
- [[Upskill/SysDes/HLD/API Build/Error Handling/Go Error Handling|Go Error Handling]] - Wrap causes, inspect chains, and avoid panic-prone assertions.

## Baseline Rules

1. Fail explicitly instead of returning plausible zero values.
2. Add operation context while preserving the original cause.
3. Log once at the boundary that owns the request or job.
4. Separate retryable failures from permanent failures.
5. Never expose internal stack traces or secrets to clients.
6. Design side-effecting workflows for partial failure.

## API Boundary

Translate internal errors into a stable client contract at the HTTP or RPC boundary. The response should expose a safe code and message while logs retain the cause, correlation ID, and operational context.

```json
{
  "error": {
    "code": "PAYMENT_DECLINED",
    "message": "The payment could not be completed.",
    "request_id": "req_01J..."
  }
}
```

#sysdes #error-handling

---

## References

- [The Error Handling Problem That Followed Me Everywhere](https://www.youtube.com/watch?v=XDTov7xaD7g) - Cross-language error-handling ideas.
