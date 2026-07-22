> [!summary]
> Real SDE2-style OS interview questions, answered clearly, with pointers back to the deeper notes in this vault — plus a handful of classic topics (microkernels, spinlocks, IPC, disk scheduling) that weren't covered elsewhere.

Map: [[Upskill/CS Topics/Operating Systems/Operating Systems|Operating Systems]]
Connections: [[Upskill/CS Topics/Operating Systems/Processes and Context Switching|Processes and Context Switching]], [[Upskill/CS Topics/Operating Systems/Threads and Runtime Tasks|Threads and Runtime Tasks]], [[Upskill/CS Topics/Operating Systems/CPU Scheduling|CPU Scheduling]], [[Upskill/CS Topics/Operating Systems/Synchronization|Synchronization]]

> [!tip] Plain-English version
> This file is your "rapid-fire round" prep. Most of what interviewers ask is a compressed version of what's already in your other notes — this file drills those down into direct Q&A form, and fills in a few classic topics (segmentation, monitors, threading models, IPC) that are common in interviews but weren't in the deeper notes.

## Processes, Threads, and Scheduling

**Q: What's the difference between a process and a thread?**
A process is an independent program with its own private memory space and resources. A thread is a unit of execution *inside* a process — multiple threads in the same process share memory and file descriptors but have their own stack and registers. See [[Upskill/CS Topics/Operating Systems/Processes and Context Switching|Processes and Context Switching]] and [[Upskill/CS Topics/Operating Systems/Threads and Runtime Tasks|Threads and Runtime Tasks]].

**Q: Walk me through the process life cycle.**
New → Ready → Running → (Waiting/Blocked ↔ Ready) → Terminated. A process is Ready when it could run but isn't assigned a CPU yet; Running when actually executing; Blocked when it can't proceed regardless of CPU availability (e.g. waiting on I/O). Full diagram in [[Upskill/CS Topics/Operating Systems/Processes and Context Switching|Processes and Context Switching]].

**Q: What's a context switch, and why is it expensive?**
Saving the current thread's state (registers, program counter, etc.) and loading another thread's state so the CPU can run it. It's pure overhead — no useful work happens during the switch itself — and it also cools down CPU caches and the TLB, making the resumed thread's *first* few memory accesses slower too. Details in [[Upskill/CS Topics/Operating Systems/Processes and Context Switching|Processes and Context Switching]].

**Q: Preemptive vs. non-preemptive scheduling — what's the real difference?**
Whether the OS is *allowed to forcibly stop* currently running work. Preemptive (Round Robin, priority-preemptive) can interrupt a running thread at any time; non-preemptive (FCFS, non-preemptive SJF) lets a thread run until it finishes or blocks itself. See [[Upskill/CS Topics/Operating Systems/CPU Scheduling|CPU Scheduling]].

**Q: What's the convoy effect?**
In FCFS, one long job at the front of the queue delays every short job behind it — like being stuck behind someone's giant grocery order at a single checkout lane.

**Q: Explain the different types of schedulers (long/short/medium term).**
- **Long-term (job scheduler):** decides which processes are admitted into the system at all — controls the "degree of multiprogramming."
- **Short-term (CPU scheduler):** picks which *ready* process/thread runs next — runs constantly, must be fast.
- **Medium-term (swapping scheduler):** temporarily moves processes out of RAM to disk under memory pressure, and back in later.

**Q: What are the different threading models?** *(classic question, not covered elsewhere in this vault)*
- **Many-to-one:** many user-level threads mapped onto a single OS thread. Cheap to create, but one blocking call stalls *everything* — the kernel only sees one thread.
- **One-to-one:** each user thread maps to its own OS (kernel) thread. This is what most modern languages use directly (Java platform threads, C `pthreads`). Simple and safe, but each thread has real kernel overhead.
- **Many-to-many:** many user threads multiplexed over a smaller *pool* of OS threads — the runtime can move a task to a different OS thread when one blocks. This is roughly the model Go goroutines and Java virtual threads approximate (see [[Upskill/CS Topics/Operating Systems/Threads and Runtime Tasks|Threads and Runtime Tasks]] for the modern framing of this same idea).

## Synchronization

**Q: Mutex vs. semaphore — what's the difference?**
A **mutex** allows exactly one owner at a time, and typically only the thread that locked it can unlock it (ownership matters). A **semaphore** is a counter that allows up to N concurrent holders — useful for limiting concurrency to a pool size, not just "one at a time." A semaphore with a count of 1 (a "binary semaphore") looks similar to a mutex but usually lacks the ownership rule — any thread can signal/release it, not just the one that acquired it. See [[Upskill/CS Topics/Operating Systems/Synchronization|Synchronization]].

**Q: Spinlock vs. mutex?** *(not covered elsewhere in this vault)*
A **mutex** puts a waiting thread to sleep (the OS deschedules it) until the lock is free — no CPU wasted while waiting, but there's a context-switch cost to sleep and wake up. A **spinlock** makes the waiting thread continuously check ("spin") in a tight loop instead of sleeping — no context-switch cost, but it burns CPU cycles the whole time it waits. Spinlocks make sense only when the expected wait is extremely short (nanoseconds to low microseconds, like inside kernel interrupt handlers) — for anything longer, a mutex wins. On a single-core system, a naive spinlock can be actively dangerous: if the lock holder can't run because the spinning thread has the only CPU, you get a hang, not just wasted cycles.

**Q: What's a monitor?** *(not named explicitly elsewhere in this vault)*
A higher-level synchronization construct that bundles a mutex with condition variables so mutual exclusion is automatic rather than manually managed. Java's `synchronized` keyword plus `wait()`/`notify()` is a textbook monitor implementation — you don't manually create and release a lock object; the language does it for you around the block/method.

**Q: What's the producer-consumer problem, and how do you solve it?**
Producers add items to a shared buffer, consumers remove them, and the buffer has finite capacity — you need to prevent producers from overflowing a full buffer and consumers from reading an empty one, without wasting CPU on busy-waiting. The classic textbook solution uses **three semaphores**: `mutex` (1, protects the buffer itself), `empty` (starts at buffer_size, counts free slots), and `full` (starts at 0, counts filled slots). In modern code you'd typically just reach for a bounded blocking queue instead of hand-rolling this — see the Java `ArrayBlockingQueue` example in [[Upskill/CS Topics/Operating Systems/Synchronization|Synchronization]], which *is* this pattern, just using a built-in data structure.

**Q: What's the dining philosophers problem?** *(classic problem, not named elsewhere in this vault)*
Five philosophers sit at a round table, alternating thinking and eating. Between each pair sits one fork, and each philosopher needs *both* adjacent forks to eat. If every philosopher picks up their left fork at the same time, all five are now holding one fork and waiting forever for the second — a deadlock via circular wait, structurally identical to the lock-ordering examples in [[Upskill/CS Topics/Operating Systems/Deadlocks|Deadlocks]]. Standard fixes: make one philosopher pick up their *right* fork first instead of left (breaks the symmetry, so the cycle can't form), only allow four philosophers to sit down at once (breaks hold-and-wait), or use a resource hierarchy (always pick up the lower-numbered fork first — this is exactly the account-ID ordering trick in the Deadlocks note).

## Memory

**Q: Paging vs. segmentation?** *(segmentation isn't covered elsewhere in this vault)*
**Paging** splits memory into fixed-size chunks (pages), which is simple and avoids external fragmentation, but a "logical unit" like a function or array may be split across multiple physical pages with no relation to its meaning. **Segmentation** splits memory into variable-size chunks that map to logical units (code segment, stack segment, heap segment) — more intuitive to a programmer, but reintroduces external fragmentation since segments vary in size and free gaps can end up scattered and unusable. Most modern general-purpose OSes (Linux, Windows) use paging as the primary mechanism; segmentation still shows up in some hardware/ISA-level contexts and older/x86 real-mode designs. See [[Upskill/CS Topics/Operating Systems/Virtual Memory|Virtual Memory]] for the paging deep-dive.

**Q: What causes thrashing, and how do you fix it?**
Thrashing happens when the memory actually needed by running processes (the "working set") doesn't fit in available RAM, so the system spends most of its time swapping pages in and out instead of doing real work. Fix: reduce concurrency/working set, add memory, or isolate workloads — adding more workers to a thrashing system usually makes it worse. Full explanation in [[Upskill/CS Topics/Operating Systems/Virtual Memory|Virtual Memory]].

**Q: Explain Belady's Anomaly.**
A genuinely counterintuitive result: for certain page-reference patterns under the FIFO replacement algorithm, *adding more physical memory frames can increase* the number of page faults, instead of decreasing it as you'd expect. It's a good example of why "more resources = always better" isn't a safe assumption in systems design. Covered in [[Upskill/CS Topics/Operating Systems/Virtual Memory|Virtual Memory]].

## Deadlocks

**Q: What are the four necessary conditions for deadlock?**
Mutual exclusion, hold-and-wait, no preemption, circular wait — all four must hold simultaneously. Break any one and that class of deadlock becomes impossible. Full detail in [[Upskill/CS Topics/Operating Systems/Deadlocks|Deadlocks]].

**Q: Deadlock vs. livelock vs. starvation — what's the difference?**
- **Deadlock:** everyone is completely stuck, forever, in a cycle.
- **Livelock:** everyone is *actively doing something* in response to each other, but no real progress happens — like two people repeatedly side-stepping the same direction in a hallway.
- **Starvation:** one participant is repeatedly denied a resource while the rest of the system keeps making progress just fine.

**Q: How would you detect and resolve a deadlock in a live system?**
Build (or inspect) a wait-for graph — who's waiting on what, held by whom — and look for a cycle. In Java specifically, `ThreadMXBean.findDeadlockedThreads()` does this automatically at runtime. Resolution options: kill/roll back one participant in the cycle, force-release a resource, or restart the affected component. See [[Upskill/CS Topics/Operating Systems/Deadlocks|Deadlocks]] for the full incident-response checklist.

## Kernel, I/O, and Systems Topics

**Q: Monolithic vs. microkernel — what's the difference?** *(not covered elsewhere in this vault)*
A **monolithic kernel** (Linux, traditional Unix) runs almost everything — device drivers, filesystems, networking — in kernel space as one large, tightly-integrated program. Fast (no cross-boundary calls between kernel subsystems) but a bug in any one driver can crash the whole kernel. A **microkernel** (seL4, early Minix, QNX) keeps the kernel itself tiny — just scheduling, basic IPC, and memory protection — and pushes drivers, filesystems, etc. out into separate user-space processes that talk to each other via message passing. More robust (a crashed driver doesn't crash the kernel) but slower due to the overhead of all that inter-process message passing. Most production general-purpose OSes lean monolithic (or "hybrid," like Windows NT) for performance reasons.

**Q: What IPC (inter-process communication) mechanisms do you know?** *(not consolidated elsewhere in this vault — pieces are scattered across Kernel/Storage notes)*
- **Pipes:** one-directional byte stream between related processes (e.g. shell `|`).
- **Message queues:** structured messages passed through the kernel, can persist beyond the sender.
- **Shared memory:** processes map the *same* physical memory into their own address spaces — fastest IPC method since there's no copying through the kernel, but requires explicit synchronization (a mutex/semaphore) since the OS won't coordinate access for you.
- **Sockets:** general-purpose, works across machines over a network, not just locally.
- **Signals:** a lightweight, asynchronous notification (like `SIGTERM`) rather than a data channel.

**Q: What's the difference between a system call and a library function call?**
A library call might do plenty of work purely in user space (e.g. a string function). A system call specifically crosses into the kernel to request a privileged operation — reading a file, allocating memory, sending network data. See [[Upskill/CS Topics/Operating Systems/Kernel and System Calls|Kernel and System Calls]] — many library calls (like `Files.readString` in Java) eventually make a system call underneath, but not every library call does.

**Q: Name some disk scheduling algorithms.** *(not covered elsewhere in this vault)*
Disk scheduling decides the order to service pending disk read/write requests to minimize seek time (the time the disk head takes to physically move):
- **FCFS:** service requests in arrival order — simple, but can cause a lot of unnecessary head movement.
- **SSTF (Shortest Seek Time First):** always service the closest pending request next — efficient on average, but can starve far-away requests.
- **SCAN ("elevator algorithm"):** the disk head sweeps in one direction, servicing requests as it passes them, then reverses at the end — like a building elevator that doesn't skip floors on its way.
- **C-SCAN (Circular SCAN):** like SCAN, but only services requests while moving in one direction, then jumps back to the start without servicing on the return trip — gives more uniform wait times.
This matters less directly on modern SSDs (no physical seek time), but the algorithm-family vocabulary still comes up in interviews and matters for spinning disks and some scheduling analogies elsewhere in CS.

**Q: Containers vs. virtual machines — OS perspective?** *(not covered elsewhere in this vault, but common in modern interviews)*
A **VM** virtualizes the hardware itself — each VM runs its own full OS kernel on top of a hypervisor, giving strong isolation but heavier overhead (full OS boot, more memory/disk per instance). A **container** (Docker, etc.) shares the *host's* kernel and uses OS-level isolation features — Linux namespaces (separate views of processes, network, mounts, users) and cgroups (resource limits/accounting) — to make a process feel like it's running alone, without the overhead of a second kernel. Faster startup, lighter weight, but weaker isolation boundary than a true VM since they share one kernel.

## Key Vocabulary (New Terms From This File)

| Term | Plain-English meaning |
|---|---|
| **Spinlock** | A lock where a waiting thread busy-loops checking instead of sleeping — fast for tiny waits, wasteful for long ones. |
| **Monitor** | A language-level construct bundling a lock with condition variables so mutual exclusion is automatic. |
| **Segmentation** | Splitting memory into variable-size, logically-meaningful chunks (code/stack/heap), as an alternative to fixed-size paging. |
| **Monolithic kernel** | An OS design where drivers/filesystems/networking all run inside the kernel itself. |
| **Microkernel** | An OS design where only the bare essentials run in the kernel; drivers/filesystems run as separate user-space processes. |
| **Namespace (Linux)** | A kernel feature giving a process its own isolated view of processes, network, mounts, etc. — the core mechanism behind containers. |
| **cgroup** | A Linux kernel feature for limiting and accounting for a group of processes' resource usage (CPU, memory, etc.). |
| **Seek time** | The time a spinning disk's read/write head takes to physically move to the right track. |

---

## References

- [GeeksforGeeks: OS Interview Questions](https://www.geeksforgeeks.org/operating-systems/operating-systems-interview-questions/)
- [GeeksforGeeks: Synchronization & Concurrency Interview Questions](https://www.geeksforgeeks.org/operating-systems/synchronization-concurrency-interview-questions/)
- [LeetCode Discuss: OS Interview Questions with Brief Answers](https://leetcode.com/discuss/interview-question/6145345/Operating-System-Interview-Questions-with-Brief-Answers/)
