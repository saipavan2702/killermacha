> [!summary]
> An operating system turns hardware into safe, shareable abstractions: processes, threads, virtual memory, files, sockets, timers, and devices.

Map: [[Upskill/CS Topics/Computer Science|Computer Science]]
Connections: [[Upskill/CS Topics/Concurrency-Parallelism-Async|Concurrency, Parallelism, and Async]], [[Upskill/CS Topics/Cache-Friendly Loops|Cache-Friendly Loops]], [[Upskill/SysDes/System Design|System Design]]

> [!tip] Plain-English version
> Your computer has one (or a handful of) CPU, one pool of RAM, and one set of disks — but it runs dozens of programs "at once." The OS is the referee that makes that illusion work: it decides whose turn it is to use the CPU, pretends every program has its own private memory, and stops programs from stepping on each other's data. Everything in this whole note series is really just answering one question: **"how does the OS fake infinite, safe resources out of a small, shared, fragile set of real ones?"**

## Why This Matters for an SDE2/SDE3

You rarely implement a scheduler or page-replacement algorithm at work. You do need to reason about what the OS is doing when a service is slow, memory grows, a lock stalls, a child process leaks, or a write is not durable.

The useful mental model is:

```text
application code
    ↓ runtime and libraries
system calls
    ↓ kernel abstractions
CPU · memory · storage · network · devices
```

Think of it like a hotel. Your application code is the guest. The runtime/libraries are the concierge who knows how to phrase requests properly. The system call is the guest picking up the house phone to call the front desk. The kernel is the front desk — the only one allowed to actually touch the safe, the room keys, and the master systems. The guest never walks into the back office and grabs things directly; every privileged action goes through the front desk.

At this level, you should be able to:

- explain a user-to-kernel transition without calling every transition a context switch;
- distinguish a process, an OS thread, and a runtime task such as a goroutine or virtual thread;
- reason about runnable, blocked, sleeping, and terminated work;
- connect scheduling and queueing to latency, throughput, fairness, and overload;
- prevent races and deadlocks instead of only naming them;
- interpret RSS, virtual memory, page faults, swapping, cache, and OOM behavior;
- explain what a filesystem promises before and after `fsync`;
- narrow a production symptom to CPU, memory, locking, I/O, or an external dependency.

## Learning Path

1. [[Upskill/CS Topics/Operating Systems/Kernel and System Calls|Kernel and System Calls]] - how programs cross into the kernel.
2. [[Upskill/CS Topics/Operating Systems/Processes and Context Switching|Processes and Context Switching]] - lifecycle, isolation, `fork`, and switching cost.
3. [[Upskill/CS Topics/Operating Systems/CPU Scheduling|CPU Scheduling]] - how runnable work competes for CPU time.
4. [[Upskill/CS Topics/Operating Systems/Threads and Runtime Tasks|Threads and Runtime Tasks]] - OS threads versus language-level concurrency.
5. [[Upskill/CS Topics/Operating Systems/Synchronization|Synchronization]] - races, locks, semaphores, conditions, and ownership.
6. [[Upskill/CS Topics/Operating Systems/Deadlocks|Deadlocks]] - prevention, detection, and recovery.
7. [[Upskill/CS Topics/Operating Systems/Virtual Memory|Virtual Memory]] - paging, page faults, replacement, and memory pressure.
8. [[Upskill/CS Topics/Operating Systems/Storage and File Systems|Storage and File Systems]] - caching, allocation, and durability.
9. [[Upskill/CS Topics/Operating Systems/Production Debugging|Production Debugging]] - turning OS signals into engineering decisions.
10. [[Upskill/CS Topics/Operating Systems/OS Interview Questions|OS Interview Questions]] - compact review of classic OS topics and trade-offs.

## How to Study It

- Learn the abstraction first: process, thread, page, file descriptor, inode.
- Trace one real operation end to end: HTTP request, file read, database write, or child process.
- Predict what a metric or trace should show, then verify it on a machine.
- Prefer trade-offs and failure modes over memorizing algorithm definitions.

## Key Vocabulary

| Term | Plain-English meaning |
|---|---|
| **Kernel** | The trusted core part of the OS that's allowed to touch hardware directly. Everything else asks it for permission. |
| **Process** | A running program with its own private slice of memory and resources — like its own locked office. |
| **Thread** | A single line of execution inside a process. Multiple threads in one process share the same office (memory) but each has their own desk (stack/registers). |
| **System call (syscall)** | A formal request from your program to the kernel — "please open this file," "please give me more memory." |
| **Scheduler** | The part of the OS that decides which runnable thread gets the CPU next. |
| **Context switch** | The act of pausing one thread and resuming another, including saving/restoring its state. |
| **Page / paging** | RAM is chopped into fixed-size chunks (pages) so the OS can manage and swap memory in small pieces instead of huge blocks. |
| **File descriptor** | A small number your program uses as a "handle" to refer to an open file, socket, or pipe. |

#operating-systems

---

## References

- [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/) - Free textbook for deeper study and exercises.
- [Linux man-pages project](https://www.kernel.org/doc/man-pages/) - Primary reference for Linux system-call behavior.
