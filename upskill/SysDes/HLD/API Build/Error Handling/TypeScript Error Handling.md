> [!summary]
> TypeScript error handling starts by awaiting every meaningful promise and narrowing `unknown` failures into stable application errors at system boundaries.

Map: [[Upskill/SysDes/HLD/API Build/Error Handling/Error Handling|Error Handling]]
Connections: [[Upskill/SysDes/HLD/API Build/Error Handling/Side Effects and Compensation|Side Effects and Compensation]], [[Upskill/WebDev/Frontend/TypeScript|TypeScript]], [[Upskill/ProgramLang/Python/Debugging and Monitoring|Debugging and Monitoring]]

## Await Every Meaningful Promise

An unawaited promise lets the caller report success before the operation finishes and can detach failures from the request that caused them.

```typescript
async function loadProfile(): Promise<UserProfile> {
  return await fetchUserProfile();
}
```

Avoid accidental fire-and-forget work:

```typescript
function loadProfile(): boolean {
  fetchUserProfile(); // failure is detached from this return value
  return true;
}
```

When background work is intentional, make that decision visible and attach an error path.

```typescript
void refreshCache().catch(error => {
  logger.error({ error }, "cache refresh failed");
});
```

## Normalize at Boundaries

Catch values are `unknown`. Convert library-specific errors once, near the boundary where they enter your application.

```typescript
class AppError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly cause?: unknown
  ) {
    super(message);
  }
}

function normalizeError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    return new AppError("Upstream request failed", "UPSTREAM_ERROR", error);
  }

  if (error instanceof SyntaxError) {
    return new AppError("Response was invalid", "INVALID_RESPONSE", error);
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR", error);
  }

  return new AppError(String(error), "UNKNOWN_ERROR", error);
}
```

This keeps catch blocks small and prevents repeated `instanceof` chains throughout the codebase.

```typescript
try {
  return await fetchData();
} catch (error: unknown) {
  throw normalizeError(error);
}
```

#typescript #error-handling

---

## References

- [`no-floating-promises`](https://typescript-eslint.io/rules/no-floating-promises/) - Lint rule for promises without an observed result.
- [The Error Handling Problem That Followed Me Everywhere](https://www.youtube.com/watch?v=XDTov7xaD7g) - Source examples adapted into the note.
