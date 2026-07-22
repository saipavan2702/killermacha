> [!summary]
> Synchronization establishes safe ordering and visibility when concurrent work accesses shared state.

Map: [[Upskill/CS Topics/Operating Systems/Operating Systems|Operating Systems]]
Connections: [[Upskill/CS Topics/Operating Systems/Deadlocks|Deadlocks]]

> [!tip] Plain-English version
> Imagine two people editing the same shared spreadsheet cell at the same time without talking to each other — one types "5," the other types "10" a split second later, and depending on timing either value could "win" or the cell could end up corrupted. **Synchronization** is the set of tools (locks, semaphores, queues) that make sure only the right people can touch shared data at the right times, in the right order, so the result is always correct no matter how the timing shakes out.

## Start With the Invariant

A **race condition** exists when correctness depends on an uncontrolled execution order — the outcome varies depending on "who gets there first," and that's not supposed to matter for correct behavior. A **data race** is the narrower, more specific case where concurrent accesses to the same memory location include a write without adequate synchronization (this is undefined behavior in most languages' memory models, not just "probably fine").

Before choosing a lock, write the invariant that must remain true — an **invariant** is a fact that must always hold, no matter what:

```text
available + reserved + sold = total inventory
```

Then identify every operation that reads or changes those values. The critical section (the piece of code that must run without interruption from other threads) must cover the whole state transition, not just an individual assignment.

> [!example] Why "just make each variable atomic" isn't enough
> Say you make `available`, `reserved`, and `sold` each individually atomic (thread-safe on their own). A "sell one item" operation still needs to decrement `available` **and** increment `sold` together. If another thread reads between those two atomic operations, it can see a moment where the invariant is broken (e.g., total doesn't add up) even though each individual variable was "safely" updated. This is why the note stresses: protect the *invariant* (the relationship between variables), not just each variable in isolation.

## What Synchronization Must Provide

- **Mutual exclusion:** incompatible operations do not overlap — only one thread "in the room" at a time for a given piece of data.
- **Ordering:** one action is known to happen before another.
- **Visibility:** writes by one worker become observable to another — without proper synchronization, one CPU core's write might sit in a private cache and never become visible to another core in a timely way.
- **Progress:** waiting work eventually has a chance to continue (nobody waits forever for no reason).

Atomicity without visibility is insufficient; visibility without a valid state transition is also insufficient. Use the language memory model rather than reasoning from source-code order alone (compilers and CPUs are allowed to reorder instructions in ways that don't affect single-threaded correctness but can surprise you across threads).

## Main Tools

- **Mutex** *(mutual exclusion lock)*: one owner at a time; best default for a small shared invariant. Like a single bathroom key — whoever has it, everyone else waits outside.
- **Read-write lock:** allows readers together (many people can read a book at once); useful only when reads dominate and hold times justify its overhead, since it also allows exactly one writer with everyone else — readers included — blocked out.
- **Semaphore:** represents a count of permits; good for limiting concurrency or modeling finite resources. Like a parking lot with N spaces — the Nth+1 car has to wait for someone to leave.
- **Condition variable:** lets a thread sleep until a predicate over protected state may have changed — like waiting by a phone that only rings when there's actually news, instead of constantly checking.
- **Atomic operation:** efficient for small independent state, counters, and carefully designed lock-free algorithms — a single, uninterruptible read-modify-write on one small value.
- **Channel or queue:** transfers data or ownership and can reduce shared mutable state — instead of both threads touching the same variable, one thread hands off a message and stops touching it.

Peterson's algorithm (a classic two-thread mutual-exclusion algorithm using only two flags and a turn variable, taught to explain the *idea* of mutual exclusion from first principles) is useful for learning mutual exclusion, but production code should use tested runtime and OS primitives with the correct memory-order guarantees.

## Go: Protect a Compound Invariant

```go
type Inventory struct {
    mu        sync.Mutex
    available int
    sold      int
}

func (i *Inventory) Sell(n int) bool {
    i.mu.Lock()
    defer i.mu.Unlock()

    if n <= 0 || i.available < n {
        return false
    }
    i.available -= n
    i.sold += n
    return true
}
```

**Reading this line by line:** `mu sync.Mutex` is the lock guarding the two fields below it. `i.mu.Lock()` claims exclusive access; `defer i.mu.Unlock()` guarantees the lock is released when the function returns, even on an early `return false`. Inside the locked section, both `available` and `sold` are updated together, so no other goroutine can ever observe a half-finished sale.

Two atomic counters would not make the relationship between them atomic (see the box above). One lock protects the business invariant.

## Java: Prefer a Blocking Queue for Handoff

```java
var jobs = new ArrayBlockingQueue<Job>(100);

// Producer: blocks or times out when downstream work is saturated.
boolean accepted = jobs.offer(job, 200, TimeUnit.MILLISECONDS);

// Consumer: sleeps without polling until work is available.
Job next = jobs.take();
process(next);
```

**Reading this line by line:** `ArrayBlockingQueue<Job>(100)` creates a fixed-capacity queue holding at most 100 jobs. `offer(job, 200, MILLISECONDS)` tries to add a job, but if the queue is full, it waits up to 200ms for space rather than blocking forever or failing instantly — this is the producer applying backpressure gracefully. `take()` on the consumer side sleeps efficiently (no CPU-wasting polling loop) until a job appears, then processes it.

This is the producer-consumer pattern with a bounded buffer. Capacity is part of correctness: it creates backpressure instead of allowing memory growth without limit.

## Locking Discipline

1. Keep the protected invariant and its lock close together (ideally in the same class/struct, clearly named).
2. Hold locks for the shortest complete state transition — don't do slow work while holding a lock "just in case."
3. Do not perform slow network or disk I/O while holding a lock unless the design explicitly requires it.
4. Use one global lock order whenever multiple locks may be acquired (see [[Upskill/CS Topics/Operating Systems/Deadlocks|Deadlocks]]).
5. Make cancellation, timeout, and error paths release resources (this is why `defer`/`finally` patterns matter so much).
6. Measure contention before replacing simple locks with complex lock-free code — lock-free code is much harder to get right and usually isn't worth it unless profiling proves the lock is the bottleneck.

## Reader-Writer Trade-off

Reader-writer locks are not automatically faster. They add bookkeeping, can starve writers, and may perform worse when critical sections are short or writes are frequent. Immutable snapshots, copy-on-write structures, sharding, or a normal mutex may be simpler.

## Review Questions

- What exact state does this primitive protect?
- Is every access following the same protocol?
- Can the operation call user code, block, or re-enter while holding the lock?
- Is wake-up based on a predicate checked in a loop? *(Always re-check the condition after waking — a "spurious wakeup" or a stale signal can otherwise let a thread proceed when it shouldn't.)*
- What bounds the queue, goroutine, future, or waiter count?

## Key Vocabulary

| Term | Plain-English meaning |
|---|---|
| **Race condition** | A bug where the result depends on unpredictable timing between threads. |
| **Data race** | The specific, stricter case of concurrent read+write (or write+write) to the same memory without synchronization — undefined behavior in most languages. |
| **Critical section** | The part of code that must not run concurrently for two threads at once. |
| **Invariant** | A condition that must always be true, no matter what operations have run. |
| **Mutex** | A lock that only one thread can hold at a time. |
| **Semaphore** | A lock that allows up to N holders at once, tracked with a counter. |
| **Deadlock** | Threads stuck waiting on each other forever — covered in its own note. |
| **Backpressure** | Deliberately slowing/rejecting new work instead of letting a queue grow without limit. |
| **Memory model** | The rules a language guarantees about when one thread's writes become visible to another thread. |

---

## References

- [Go memory model](https://go.dev/ref/mem) - Happens-before guarantees for goroutines and synchronization.
- [Linux kernel locking](https://docs.kernel.org/locking/index.html) - Primary documentation for kernel locking primitives and design.
