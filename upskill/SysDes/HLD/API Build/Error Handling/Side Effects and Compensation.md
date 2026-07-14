> [!summary]
> Concurrent mutations can partially succeed; safe workflows either use one transaction or define explicit compensation for every completed step.

Map: [[Upskill/SysDes/HLD/API Build/Error Handling/Error Handling|Error Handling]]

## Why `Promise.all` Can Be Dangerous

`Promise.all` rejects when one promise rejects, but it does not cancel the other operations. If those operations mutate independent systems, some may finish after the caller has already observed failure.

```typescript
await Promise.all([
  chargeCard(),
  reserveInventory()
]);
```

Possible result: inventory is reserved even though charging the card failed.

## Prefer an Atomic Transaction When Possible

When all changes share one transactional database, commit or roll them back together.

```sql
BEGIN;
UPDATE inventory SET reserved = reserved + 1 WHERE sku = 'A1';
INSERT INTO orders(id, status) VALUES ('o-123', 'created');
COMMIT;
```

## Compensate Across Systems

When one transaction cannot cover every service, record which steps completed and undo them in reverse order when a later step fails.

```typescript
const charge = await chargeCard();

try {
  const reservation = await reserveInventory();
  return await createOrder({ charge, reservation });
} catch (error) {
  await refundCharge(charge.id);
  throw error;
}
```

Real compensation must be idempotent. A retry of `refundCharge` should not issue two refunds.

## Workflow Checklist

- give every request an idempotency key
- persist workflow state before acknowledging success
- make compensation retryable
- define timeouts and dead-letter handling
- expose stuck workflows through metrics and alerts
- prefer parallelism for independent reads, not uncoordinated writes

## Related

- [[Upskill/SysDes/HLD/Event-Driven Architecture|Event-Driven Architecture]]
- [[Upskill/SysDes/HLD/Message Queues|Message Queues]]
- [[Upskill/SysDes/HLD/Consistency Models|Consistency Models]]
- [[Upskill/ProgramLang/Python/Retries and Timeouts|Retries and Timeouts]]

#sysdes #reliability

---

## References

- [The Error Handling Problem That Followed Me Everywhere](https://www.youtube.com/watch?v=XDTov7xaD7g) - Parallel mutation and rollback example.
