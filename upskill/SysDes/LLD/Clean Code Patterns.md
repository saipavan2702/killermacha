> [!summary]
> Clean code reduces surprise by making business intent, boundaries, valid states, decisions, failures, and changes easy to see.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/LLD/SOLID Principles|SOLID Principles]], [[Upskill/SysDes/LLD/Design Patterns/Structural|Structural Design Patterns]], [[Upskill/SysDes/HLD/API Build/Error Handling/Error Handling|Error Handling]], [[Upskill/WebDev/Frontend/Frontend Architecture|Frontend Architecture]]

> [!important]
> Complexity does not disappear; it moves. Put it into clear names, boundaries, types, and focused changes instead of the next developer's head.

## 1. Return Early

Handle invalid input and failure cases first. The successful path then stays short and visually obvious.

```java
User user = userRepository.findById(userId)
    .orElseThrow(() -> new NotFoundException("User not found"));

if (!user.canEditProfile()) {
    throw new ForbiddenException("Profile cannot be edited");
}

return saveProfile(user, input);
```

Guard clauses are especially useful for validation, permissions, empty collections, and unsupported states. They are less useful when several branches are equally important business outcomes; model those outcomes explicitly instead of pretending one is only an error.

## 2. Name the Business Meaning

Names should explain why a value exists, not merely its data shape.

```java
// Vague: the reader must reconstruct the rule.
if (result.getStatus().equals("active")) {
    process(result);
}

// Clear: the rule has a business name.
if (subscription.isBillable()) {
    chargeSubscription(subscription);
}
```

Prefer names such as `renewalDeadline`, `eligibleInvoices`, and `chargeSubscription` over `date`, `items`, and `process`. A longer precise name is cheaper than a short ambiguous one.

## 3. Protect External Boundaries

Do not spread vendor response types, database rows, or transport objects through the application. Translate them into an internal model at one boundary.

```java
final class BillingCustomerMapper {
    Customer fromResponse(BillingCustomerResponse response) {
        return new Customer(
            response.getId(),
            response.getUserName(),
            "ACTIVE".equals(response.getStatus())
        );
    }
}
```

If the provider renames `userName` or changes its status values, this mapper is the main place that changes. The rest of the application continues to speak its own domain language. This is the practical value behind the [[Upskill/SysDes/LLD/Design Patterns/Structural|Adapter pattern]].

## 4. Make Invalid States Hard to Represent

Avoid one object with many nullable fields and flags that can contradict one another. Model the valid states explicitly.

```java
sealed interface Payment permits PendingPayment, AuthorizedPayment,
        CapturedPayment, FailedPayment {}

record PendingPayment(String paymentId) implements Payment {}

record AuthorizedPayment(
    String paymentId,
    String authorizationId
) implements Payment {}

record CapturedPayment(
    String paymentId,
    String receiptId
) implements Payment {}

record FailedPayment(
    String paymentId,
    String reason
) implements Payment {}
```

Now a captured payment must have a receipt, while a pending payment cannot accidentally expose one. Types catch impossible combinations before they become runtime branches.

## 5. Separate Decisions from Actions

Business rules are easiest to test when they calculate a decision without performing database writes, network calls, logging, or other side effects.

```java
record RefundDecision(boolean allowed, String reason) {}

RefundDecision decideRefund(Invoice invoice) {
    if (invoice.isOlderThanDays(30)) {
        return new RefundDecision(false, "Refund window expired");
    }
    if (!invoice.isPaid()) {
        return new RefundDecision(false, "Invoice is not paid");
    }
    return new RefundDecision(true, "Eligible");
}

void refund(Invoice invoice) {
    RefundDecision decision = decideRefund(invoice);
    if (!decision.allowed()) {
        throw new ValidationException(decision.reason());
    }
    paymentProvider.refund(invoice.paymentId());
}
```

The decision function can be tested with ordinary values. Only the thin action layer needs integration tests or test doubles.

## 6. Make Errors Useful

An error contract should give software a stable code, give people a clear message, and give operators a request identifier. Clients should never parse human-readable text to decide what to do.

```json
{
  "code": "USER_EMAIL_ALREADY_EXISTS",
  "message": "A user with this email already exists.",
  "requestId": "req_8f91a2"
}
```

Log the operation, relevant identifiers, and preserved cause at the owning boundary. Do not log secrets, tokens, passwords, or unnecessary personal data. See [[Upskill/SysDes/HLD/API Build/Error Handling/Error Handling|Error Handling]] for the wider failure model.

## 7. Optimize the Diff

A locally working feature can still be a difficult change to review and operate. Prefer one self-contained behavior change with its tests.

- Keep refactoring separate from behavior changes when either is substantial.
- Avoid unrelated renaming, formatting, or dependency upgrades.
- Make each intermediate change buildable and safe to deploy.
- Include enough context for a reviewer without requiring knowledge of future work.
- Keep rollback simple by avoiding several unrelated outcomes in one change.

Small does not mean an arbitrary line limit. It means one coherent idea that a reviewer can understand and verify.

## Review Checklist

- Can the happy path be found quickly?
- Do names express business rules?
- Are external formats translated at a boundary?
- Can objects represent contradictory states?
- Can decisions be tested without I/O?
- Are errors useful to clients, people, and operators?
- Does the change contain one coherent purpose?

#clean-code

---

## References

- [Google Engineering Practices: Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html) - Why focused changes are easier to review, merge, test, and roll back.
- [Google Engineering Practices: What to Look for in a Code Review](https://google.github.io/eng-practices/review/reviewer/looking-for.html) - Guidance on code clarity, design, comments, tests, and change scope.
- [Oracle Java: Sealed Classes](https://docs.oracle.com/en/java/javase/17/language/sealed-classes-and-interfaces.html) - Restricting the permitted variants of a Java type.
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html) - A standard machine-readable error representation for HTTP APIs.
