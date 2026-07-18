> [!summary]
> An OS thread is a schedulable execution context; language runtimes may multiplex many lighter tasks over a smaller or elastic set of OS threads.

> [!tip] Plain-English version
> There are really three "sizes" of concurrency, from biggest/heaviest to smallest/lightest:
> - **Process** = a whole separate apartment building (its own memory, totally isolated).
> - **OS thread** = a person the kernel personally knows about and schedules — has weight (a stack, kernel bookkeeping), but shares the building (memory) with roommates (other threads).
> - **Runtime task** (goroutine / virtual thread / coroutine / future) = a sticky note the *language runtime* manages itself, cheap enough to have thousands of them, that gets temporarily assigned to a real OS thread only while it's actually doing work.
>
> The whole point of runtime tasks is: OS threads are relatively expensive to create and switch between, so if you have 100,000 "mostly waiting" jobs, you don't want 100,000 real OS threads — you want a runtime that can juggle them cheaply and only uses a handful of real OS threads underneath.

Map: [[Upskill/CS Topics/Operating Systems/Operating Systems|Operating Systems]]

## Process, Thread, and Runtime Task

- A **process** owns an isolated address space and resource namespace.
- An **OS thread** owns registers, a stack, scheduling state, and a thread ID while sharing its process's memory and descriptors.
- A **runtime task** such as a goroutine, coroutine, future, or Java virtual thread is managed partly in user space and may not map one-to-one to an OS thread at every moment.

Most Linux and modern desktop language threads use a one-to-one kernel-thread model. Creating them does involve the kernel. Blocking one thread does not normally block every other thread in the process; that warning applies to many-to-one user-thread systems or to blocking a single event-loop/carrier thread that many tasks depend on.

## Why Threads Are Cheaper, Not Free

Threads share code, heap, and open resources, so creation and switching can be cheaper than separate processes. Each thread still consumes stack space, kernel/runtime metadata, scheduler attention, and debugging complexity.

Thousands of mostly waiting OS threads may waste memory or create scheduler pressure. Lightweight runtime tasks reduce per-task cost, but unbounded tasks still create queues, retained objects, downstream load, and cancellation problems.

> [!example] Why "just spawn a thread per request" breaks down
> A default OS thread stack is often ~1MB (reserved virtual memory, even if not all touched). 10,000 threads-per-request under load could reserve gigabytes just for stacks, before you've done any real work — plus the OS scheduler now has to shuffle 10,000 contenders for a handful of CPU cores. This is exactly the problem virtual threads / goroutines / async runtimes are designed to solve: keep the *cheap* per-task bookkeeping in user space, and only touch the *expensive* OS thread when actual CPU work needs to happen.

## Java Example: Bounded Concurrency

Virtual threads are useful for blocking-style I/O, but the downstream dependency still needs a limit.

```java
var permits = new Semaphore(50);

try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    var future = executor.submit(() -> {
        permits.acquire();
        try {
            return callRemoteService();
        } finally {
            permits.release();
        }
    });

    var result = future.get();
}
```

**Reading this line by line:** `Semaphore(50)` is a counter that only allows 50 "checked out" permits at once — think of it as 50 tickets in a bucket. `newVirtualThreadPerTaskExecutor()` spins up a *cheap* virtual thread for every submitted task (you could submit thousands without exhausting real OS threads). Inside the task, `permits.acquire()` takes a ticket (blocking if none are free), does the actual remote call, then `permits.release()` returns the ticket in a `finally` block so it's always returned even on failure.

The virtual thread improves the cost of *waiting* (you can have huge numbers of them idle on I/O for cheap). The semaphore protects the remote service and the local connection pool from unbounded concurrency — without it, "cheap threads" would just let you hit the downstream service harder than it can handle.

## Go Example: Tasks Over Workers

```go
func runJobs(ctx context.Context, jobs []Job, limit int) error {
    group, ctx := errgroup.WithContext(ctx)
    group.SetLimit(limit)

    for _, job := range jobs {
        job := job
        group.Go(func() error {
            return process(ctx, job)
        })
    }
    return group.Wait()
}
```

**Reading this line by line:** `errgroup.WithContext` creates a group of goroutines that share one cancellable context — if any goroutine returns an error, the whole group's context is cancelled, signaling the rest to stop early. `group.SetLimit(limit)` caps how many goroutines can be active simultaneously (subsequent `group.Go` calls block until a slot frees up). Each `group.Go(...)` launches one goroutine per job. `group.Wait()` blocks until everything finishes and returns the first error, if any.

Goroutines are runtime-scheduled tasks — Go's runtime multiplexes many goroutines over a much smaller pool of OS threads automatically. `SetLimit` prevents the program from turning a convenient abstraction into an unlimited work queue.

## Choosing the Model

- Use **processes** for fault isolation, security boundaries, independent deployment, or CPU parallelism where the runtime requires it.
- Use **threads** for shared-memory parallelism and integrations built around blocking calls.
- Use **async/runtime tasks** for large numbers of waiting operations when libraries support cancellation and non-blocking behavior.
- Use **bounded pools or limits** whenever a finite resource is involved.

The decision is not just speed. Consider failure isolation, memory ownership, observability, cancellation, backpressure, and library compatibility.

## Common Failure Modes

- blocking an event loop or scarce carrier thread (one slow task can stall everything sharing that thread);
- creating one worker per request without a bound;
- assuming thread-safe means compound operations are atomic (see [[Upskill/CS Topics/Operating Systems/Synchronization|Synchronization]]);
- losing task errors because no owner joins or awaits them;
- cancelling the caller while the underlying work continues (cancellation doesn't always propagate all the way down);
- using thread-local state where tasks migrate between threads (a virtual thread or goroutine isn't guaranteed to stay pinned to the same OS thread).

## Key Vocabulary

| Term | Plain-English meaning |
|---|---|
| **Goroutine** | Go's lightweight, runtime-managed task — cheap enough to create thousands of. |
| **Virtual thread (Java)** | Java's lightweight thread abstraction; many virtual threads share a smaller pool of real "carrier" OS threads. |
| **Carrier thread** | The real OS thread that a virtual thread is temporarily "riding on" while doing actual work. |
| **Coroutine / future / async task** | General terms for a lightweight, cooperatively-scheduled unit of work managed by a language runtime rather than the OS. |
| **Semaphore** | A counter-based lock that allows up to N concurrent holders (versus a mutex, which allows only 1). |
| **Backpressure** | A system deliberately slowing down or rejecting new work when it's overloaded, instead of queueing forever. |
| **Event loop** | A single thread that repeatedly picks up and handles ready events/tasks one at a time — if a task blocks it, everything else waiting on that loop stalls too. |

---

## References

- [Linux `pthreads(7)`](https://man7.org/linux/man-pages/man7/pthreads.7.html) - POSIX thread model and shared process attributes.
- [Java virtual threads](https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html) - Runtime behavior and guidance for thread-per-request code.
- [Go scheduler design](https://go.dev/src/runtime/HACKING) - Runtime concepts behind goroutines, threads, and processors.
