> [!summary]
> CPU scheduling is a queueing problem: choose which runnable thread executes next while balancing latency, throughput, fairness, and predictability.

Map: [[Upskill/CS Topics/Operating Systems/Operating Systems|Operating Systems]]
Connections: [[Upskill/CS Topics/Operating Systems/Deadlocks|Deadlocks]]

> [!tip] Plain-English version
> Picture one cashier (the CPU) and a line of customers (runnable threads). The scheduler is the store manager deciding: do we serve people in the order they arrived? Do we serve whoever has the shortest order first? Do we give everyone a fixed 2-minute slot and rotate? Every scheduling algorithm below is really just a different store policy for "who gets served next," each with different trade-offs between speed for the whole line versus fairness to any one customer.

## The Real Unit of Scheduling

Introductory material often says the OS schedules processes. Modern general-purpose kernels more precisely schedule **runnable threads**. A process with ten CPU-hungry threads can therefore compete for more CPU time than a process with one.

The short-term scheduler selects runnable work. Long-term job admission and whole-process swapping are useful historical concepts, but production application engineers mainly encounter CPU run queues, priorities, affinity, cgroups, and runtime worker pools.

## What the Scheduler Optimizes

- **Latency:** time until a task responds or first runs.
- **Throughput:** useful work completed per unit time.
- **Fairness:** whether competing tasks receive a reasonable share.
- **Utilization:** keeping CPUs productive when work exists.
- **Predictability:** bounding jitter and deadline misses.

These goals conflict. A long time slice reduces switching overhead but hurts interactive latency. Strict priority helps urgent work but can starve lower-priority tasks.

## Classical Algorithms

- **First Come, First Served (FCFS):** simple and low-overhead; a long job can delay every short job behind it — this delay effect is called the **convoy effect** (like being stuck behind someone doing a huge grocery run at a single-lane checkout).
- **Shortest Job First / Shortest Remaining Time (SJF/SRTF):** minimizes average wait when duration is known; real systems must estimate it and avoid starving long work.
- **Round Robin (RR):** rotates runnable tasks using a time quantum (a fixed slice of time, e.g. 10ms); responsive, but tiny quanta create switching overhead.
- **Priority scheduling:** runs more important work first; aging (gradually raising the priority of tasks that have waited a long time) or fair-share rules reduce starvation.
- **Multilevel feedback queues:** adjust priority from observed behavior, favoring interactive or short-burst work while still progressing long jobs.

> [!example] Worked comparison: FCFS vs. SJF
> Three jobs arrive at the same time: **A** needs 24ms, **B** needs 3ms, **C** needs 3ms.
>
> **FCFS (in arrival order A, B, C):**
> - A runs 0–24, B runs 24–27, C runs 27–30.
> - Waiting time: A=0, B=24, C=27 → average wait = **17ms**.
>
> **SJF (shortest job first: B, C, A):**
> - B runs 0–3, C runs 3–6, A runs 6–30.
> - Waiting time: B=0, C=3, A=6 → average wait = **3ms**.
>
> Same total work, same finish time for the last job — but SJF gives a much lower *average* wait because short jobs aren't stuck behind the long one. The catch: SJF needs to know (or estimate) how long each job will take, which isn't always possible in real systems.

The algorithms are interview vocabulary. The engineering lesson is to identify the policy your runtime and OS actually use, then understand how queues and priorities affect your service-level objective.

## Preemption and Blocking

- **Preemption:** the scheduler stops a runnable thread so another can run — done *to* the thread, not chosen by it.
- **Blocking:** the thread cannot make progress until I/O, a timer, a lock, or another event completes — the thread gives up the CPU because it genuinely has nothing to do right now.
- **Yielding:** the thread voluntarily gives up the CPU but remains runnable — it *could* keep going, but politely lets someone else go first.

Normal Linux scheduling is preemptive. Real-time policies such as `SCHED_FIFO` and `SCHED_RR` have stronger priority behavior and can starve ordinary work when misconfigured.

## Preemptive vs Non-Preemptive Scheduling

**Preemptive scheduling** allows the OS to interrupt running work and give the CPU to another runnable thread. The trigger may be an expired time slice, a higher-priority task becoming runnable, or another scheduling decision.

- Examples: round robin, shortest remaining time first, and preemptive priority scheduling.
- Benefit: better responsiveness and fairness for interactive workloads.
- Cost: more context switches and more concurrent interleavings to reason about.

**Non-preemptive scheduling** lets the running task keep the CPU until it exits, blocks, or voluntarily yields.

- Examples: first come, first served and non-preemptive shortest job first.
- Benefit: simpler execution and lower switching overhead.
- Cost: one long CPU burst can delay every task waiting behind it.

> [!example] Two arriving jobs
> P1 starts at `0 ms` and needs `8 ms`. P2 arrives at `1 ms` and needs `2 ms`. With non-preemptive FCFS, P2 waits until P1 finishes at `8 ms`. With preemptive shortest-remaining-time scheduling, P2 interrupts P1, finishes at `3 ms`, and P1 then resumes.

> [!important]
> Priority is only one possible reason for preemption. The real distinction is whether the scheduler may forcibly stop currently running work.

## Multiprocessor Effects

With multiple cores, scheduling must also consider:

- **load balancing:** spread runnable work without constant migration;
- **CPU affinity:** keeping a task near warm cache data — like always sending the same customer to the same cashier who already knows their usual order;
- **NUMA locality:** keeping threads close to their memory (on multi-socket machines, some memory is physically "closer," and therefore faster, to some CPUs than others);
- **shared-resource contention:** cache lines, memory bandwidth, and locks;
- **oversubscription:** more runnable workers than useful parallel capacity — like hiring 20 cashiers for 4 registers; they just get in each other's way.

Language runtimes add another layer. Go schedules goroutines over OS threads; Java schedules platform threads directly and virtual threads over carrier threads; Python executors and processes each introduce their own queues.

## Service-Level Reasoning

For a request-handling service:

1. Bound incoming and internal queues.
2. Match CPU worker count to measured parallel capacity, not request count.
3. Separate CPU-heavy pools from blocking I/O pools.
4. Prefer admission control over letting latency grow without limit.
5. Measure queue wait, execution time, context switches, CPU saturation, and throttling together.

> [!example]
> A service at 100% CPU with a growing run queue does not need more async tasks. It needs less work, more efficient work, more CPU capacity, or explicit load shedding.

## Key Vocabulary

| Term | Plain-English meaning |
|---|---|
| **Run queue** | The line of threads that are ready to execute and just waiting for a free CPU. |
| **Time quantum** | The fixed chunk of CPU time Round Robin gives each thread before forcing a switch. |
| **Convoy effect** | Short tasks getting stuck waiting behind one long task in a first-come-first-served queue. |
| **Starvation** | A thread that keeps getting skipped over and never (or rarely) gets to run. |
| **Aging** | A fix for starvation: gradually increase a waiting thread's priority the longer it waits. |
| **Throughput** | Total useful work completed per unit of time — a "whole system" measure. |
| **Latency** | How long one individual task takes to get a response — an "individual" measure. |
| **CPU affinity** | Preference (or a hard rule) for running a thread on the same CPU core repeatedly, to keep its cached data "warm." |
| **NUMA** | Non-Uniform Memory Access — a hardware layout where some memory is faster to reach from some CPUs than others. |

---

## References

- [Linux `sched(7)`](https://man7.org/linux/man-pages/man7/sched.7.html) - Scheduling policies, priorities, preemption, and CPU affinity APIs.
