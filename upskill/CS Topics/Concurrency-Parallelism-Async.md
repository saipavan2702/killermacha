
> [!summary]
> Concurrency organizes overlapping work, parallelism runs work at the same instant, and async keeps waiting from blocking useful progress.

## The Three-Way Comparison

| Idea | What it answers | Best fit | Multiple cores required? |
| --- | --- | --- | --- |
| **Concurrency** | How can several tasks make progress together? | Independent or waiting-heavy tasks | No |
| **Parallelism** | How can several tasks execute at the same instant? | CPU-bound work that can be divided | Yes |
| **Async** | How can a task wait without blocking its caller? | Network, disk, timers, and other I/O | No |

The relationship is more useful than the labels:

- **Concurrency is a design property.** Tasks have overlapping lifetimes.
- **Parallelism is an execution property.** Tasks literally run simultaneously.
- **Async is a programming model.** A task suspends at a wait point and resumes later.

Async often creates concurrency. Concurrent work may become parallel when the runtime schedules it across multiple cores. None of the three guarantees a speedup by itself.

> [!quote] Rob Pike
> "Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once."

## One Kitchen, Three Models

Imagine preparing pasta and salad:

- **Concurrency:** one cook starts the pasta, chops vegetables while the water boils, then returns to the pasta.
- **Parallelism:** two cooks prepare the pasta and salad at the same time.
- **Async:** the cook starts a timer for the pasta and does other work instead of staring at the pot.

The cook is a worker. The dishes are tasks. Boiling is waiting. A second cook adds execution capacity.

## Concurrency

Concurrency lets multiple tasks remain in progress even when only one can execute at a moment. A scheduler may interleave them by switching whenever a task waits or its time slice ends.

**Good for:** servers handling many requests, UI responsiveness, pipelines, and overlapping I/O.

**Cost:** scheduling overhead and harder reasoning about shared state, ordering, and cancellation.

> [!example]
> A single-core machine can run a browser, music player, and editor concurrently by interleaving their work. It is concurrent, but not parallel.

## Parallelism

Parallelism divides work so multiple execution units can process it simultaneously. It helps only when the work is large enough, sufficiently independent, and not dominated by coordination.

**Good for:** image processing, simulations, compilation, data transforms, and large numerical computations.

**Cost:** splitting work, combining results, synchronization, cache contention, and uneven task sizes.

> [!important] Amdahl's Law
> If part of a program must remain sequential, that part limits the total speedup. Adding workers cannot rescue an algorithm dominated by serial work or coordination.

## Async

Async avoids holding a worker idle while an operation waits. At an `await` or completion boundary, control returns to the runtime; the task continues when its result is ready.

**Good for:** many in-flight network calls, database requests, file operations, timers, and event-driven services.

**Not good for:** making CPU-heavy code faster. CPU work still needs threads, processes, or other parallel execution resources.

> [!warning]
> Async code is not automatically non-blocking. Calling a blocking library inside an async task can still freeze the worker or event loop.

## How Java, Go, and Python Express It

### Java

- `CompletableFuture` and `HttpClient.sendAsync` compose asynchronous I/O.
- Executors and virtual threads support concurrent tasks.
- `ForkJoinPool` and parallel streams can use multiple cores for divisible CPU work.

```java
var user = client.sendAsync(userRequest, BodyHandlers.ofString());
var orders = client.sendAsync(ordersRequest, BodyHandlers.ofString());

CompletableFuture.allOf(user, orders).join();
```

Both requests are in progress together. Whether their internal work runs in parallel is a separate runtime decision.

### Go

- Goroutines model lightweight concurrent tasks.
- Channels communicate results and coordinate ownership.
- Goroutines can also run in parallel when multiple processors are available.

```go
users := make(chan Result, 1)
orders := make(chan Result, 1)

go func() { users <- fetch(userURL) }()
go func() { orders <- fetch(ordersURL) }()

user, order := <-users, <-orders
```

Go emphasizes composing independent activities; concurrency does not imply that every goroutine executes simultaneously.

### Python

- `asyncio` provides cooperative concurrency for I/O with `async` and `await`.
- `ThreadPoolExecutor` is useful for blocking I/O that cannot be awaited directly.
- `ProcessPoolExecutor` uses separate processes for CPU-bound parallelism.

```python
user, orders = await asyncio.gather(
    fetch_user(),
    fetch_orders(),
)
```

The coroutines overlap their waiting. For heavy CPU work, move the function to a process pool instead of blocking the event loop.

## How They Work Together

A web service may use all three:

1. **Concurrency** keeps many requests in progress.
2. **Async** overlaps database and network waits without dedicating a thread to each wait.
3. **Parallelism** spreads CPU-heavy parsing, compression, or inference across cores.

They solve different bottlenecks, so a system can combine them without treating them as synonyms.

## Choosing the Right Model

1. **Find the wait.** If the task mostly waits on I/O, start with async or bounded threads.
2. **Find the computation.** If it keeps a CPU core busy, consider parallel workers.
3. **Check independence.** Parallelize tasks with little shared mutable state.
4. **Bound the work.** Limit queues, workers, and in-flight requests; add timeouts and cancellation.
5. **Measure.** Coordination overhead can make a concurrent version slower than a simple sequential one.

## Common Confusions

- **Concurrent means simultaneous:** not necessarily; tasks may only be interleaved.
- **Async means parallel:** no; one event-loop thread can run many async tasks.
- **More threads means faster:** not when contention and context switching dominate.
- **CPU count limits concurrency:** it limits physical parallelism, not the number of tasks that can be in progress.
- **No shared state means no coordination:** results, errors, timeouts, and cancellation still need a clear owner.

## Related Notes

- [[Upskill/ProgramLang/Java/Concurrency|Java Concurrency]]
- [[Upskill/ProgramLang/Golang/Channels and Select|Go Channels and Select]]
- [[Upskill/ProgramLang/Golang/Synchronization|Go Synchronization]]
- [[Upskill/ProgramLang/Python/Concurrency and I-O|Python Concurrency and I/O]]

#computer-science #concurrency

---

## References

- [Concurrency, Parallelism, and Async: Three Ideas That Sound the Same But Aren't](https://freedium-mirror.cfd/https://code.likeagirl.io/concurrency-parallelism-async-47312e0be553) - Source article and kitchen analogy.
- [Java `HttpClient`](https://docs.oracle.com/en/java/javase/21/docs/api/java.net.http/java/net/http/HttpClient.html) - Blocking and asynchronous HTTP requests with `CompletableFuture`.
- [Concurrency Is Not Parallelism](https://go.dev/blog/waza-talk) - Rob Pike's distinction between composing and executing tasks.
- [Python `asyncio`](https://docs.python.org/3/library/asyncio.html) - Concurrent I/O with `async` and `await`.
- [Python `concurrent.futures`](https://docs.python.org/3/library/concurrent.futures.html) - Thread, process, and interpreter executors.
