> [!summary]
> Diagnose from symptoms and resource queues: establish whether work is using CPU, ready for CPU, waiting on locks, faulting on memory, blocked on I/O, or waiting outside the host.

Map: [[Upskill/CS Topics/Operating Systems/Operating Systems|Operating Systems]]
Connections: [[Upskill/CS Topics/Operating Systems/Virtual Memory|Virtual Memory]]

> [!tip] Plain-English version
> This is the "putting it all together" note. Everything else in this series (processes, scheduling, memory, locks, filesystems) is background knowledge for answering one real-world question at 3am: **"why is this service slow/broken right now, and what specifically is it stuck on?"** The trick is always the same: figure out which of a handful of buckets the problem lives in (CPU? memory? locks? disk? network? a downstream service?) before trying to fix anything.

## A Repeatable Workflow

1. Define the symptom and time window: latency, throughput, errors, restarts, or saturation.
2. Compare the affected instance with a healthy one.
3. Check CPU, run queue, memory pressure, disk I/O, network, and process limits.
4. Narrow to the process, then thread/goroutine, syscall, lock, allocation, or dependency.
5. Capture evidence before restarting when the service can tolerate it — restarting destroys the evidence you need to actually fix the root cause.
6. Change one cause, then verify both recovery and prevention telemetry.

## Read the Host Before the Stack Trace

```bash
# Process state and resource use
ps -eo pid,ppid,stat,ni,pri,pcpu,pmem,rss,vsz,comm

# CPU run queue, memory, paging, I/O, and context switching
vmstat 1

# Per-process CPU, faults, switches, and I/O
pidstat -p <pid> -r -u -w -d 1

# Disk latency, queueing, and utilization
iostat -xz 1

# Open files and sockets
lsof -p <pid>
```

**What each command is for, in plain terms:** `ps` gives a one-shot snapshot of processes and their basic resource usage. `vmstat 1` prints a fresh line every 1 second showing system-wide CPU/memory/paging/IO trends over time — good for spotting a pattern, not just a single moment. `pidstat` is like `vmstat` but scoped to one process, broken out by resource type. `iostat -xz` focuses specifically on disk devices — useful when you suspect storage is the bottleneck. `lsof -p <pid>` lists every file/socket/pipe a process currently has open — useful for spotting fd leaks or unexpected connections.

One sample is a clue, not a conclusion. Correlate several samples with service metrics and request traces.

## Symptom to Hypothesis

### CPU Is High

- Check whether throughput rose proportionally; high CPU can be healthy useful work (busy doesn't always mean broken).
- Profile on-CPU code before optimizing guesses — don't guess at what's slow, measure it.
- Look for retry storms, busy loops, serialization, excessive allocation, and lock spinning.
- Check container CPU throttling; the host may have idle CPU while the cgroup has exhausted its quota — this is a very common and confusing production trap, where the *host* looks fine but your specific container is being artificially capped.

```bash
perf stat -p <pid>
perf record -F 99 -g -p <pid> -- sleep 30
```

`perf stat` gives you summary hardware counters (instructions, cache misses, etc.) for a running process. `perf record ... sleep 30` samples the process's call stack 99 times a second for 30 seconds, letting you later build a flame graph showing exactly which functions are consuming CPU.

### Load Is High but CPU Is Not

Linux "load average" can be misleading — it can include runnable tasks *and* tasks in **uninterruptible sleep** (a state where a thread is blocked on something like disk I/O and can't even be interrupted by a signal). So a high load number doesn't automatically mean the CPU is the bottleneck. Check storage, network filesystems, locks, and stalled devices rather than assuming CPU saturation.

```bash
ps -eo state,pid,tid,wchan:32,comm | sort
strace -f -tt -T -p <pid>
```

`ps ... wchan` shows the kernel function each thread is currently blocked inside — a quick way to see "what is everyone waiting on." `strace` traces every system call a process makes in real time, showing exactly which syscalls are slow or failing.

Tracing adds overhead and may expose sensitive arguments. Use it deliberately and for a bounded period.

### Memory Keeps Growing

Separate runtime heap from total RSS (see [[Upskill/CS Topics/Operating Systems/Virtual Memory|Virtual Memory]] for what RSS means). Inspect mappings, page faults, child processes, thread count, native buffers, allocator retention, and caches.

```bash
cat /proc/<pid>/status
pmap -x <pid>
cat /proc/pressure/memory
```

`/proc/<pid>/status` shows a summary of a process's memory usage and other kernel-tracked state. `pmap -x` breaks down exactly which memory mappings (heap, stack, shared libraries, etc.) make up a process's footprint. `/proc/pressure/memory` is Linux's PSI (Pressure Stall Information) — it directly tells you what fraction of recent time work was stalled specifically due to memory pressure, which is a much clearer signal than just "memory usage is high."

An OOM kill is an outcome, not a root cause. Check cgroup limits, working-set growth, bursts, and reclaim pressure — the real question after an OOM kill is *why* memory grew, not just that it did.

### Requests Hang

- Capture thread or goroutine dumps more than once (a single snapshot can't tell "stuck" from "just slow" — compare two snapshots a few seconds apart; if the same threads are in the exact same spot, that's a strong stuck signal).
- Check lock cycles, pool exhaustion, queue length, and dependency timeouts.
- Verify whether cancellation propagates to database, HTTP, and filesystem work — a client giving up doesn't always mean the server-side work actually stops.
- Inspect file-descriptor and ephemeral-port limits (exhausting either can silently hang new connections).

## Runtime Tools

- **Java:** `jcmd <pid> Thread.print`, Java Flight Recorder, heap histograms, and GC logs.
- **Go:** `/debug/pprof`, `go tool pprof`, goroutine profiles, block profiles, and mutex profiles.
- **Python:** `py-spy`, `faulthandler`, `tracemalloc`, executor/process inspection, and native-extension metrics.

Runtime tools explain language-level behavior; OS tools reveal scheduling, syscalls, mappings, and host pressure. Use both views on the same time window — a runtime profiler alone can miss OS-level bottlenecks like a throttled cgroup, and OS tools alone can't see inside your language's own thread pool.

## Local macOS Equivalents

```bash
vm_stat 1
sample <pid> 10
sudo fs_usage -w -f filesystem <pid>
lsof -p <pid>
```

Activity Monitor is useful for an initial view, while `sample` captures stacks and `fs_usage` reveals live filesystem activity. Production Linux commands and metrics do not always have one-to-one macOS equivalents, so compare concepts rather than column names — useful if you're debugging locally on a Mac before deploying to Linux production.

## Senior-Level Habits

- Put a bound and a metric on every queue and pool.
- Record timeout and cancellation reasons, not just final errors.
- Expose dependency time separately from local queue and execution time.
- Keep thread/goroutine dumps and profiles easy to collect safely.
- Load test past the knee of the curve to learn the failure mode before production does. *(The "knee of the curve" is the point where latency starts rising much faster than load — you want to know what happens just past that point in a controlled test, not for the first time during a real incident.)*
- Write incident notes that connect the OS signal to the application decision that caused it.

## Key Vocabulary

| Term | Plain-English meaning |
|---|---|
| **Load average** | A rough count of runnable + uninterruptibly-sleeping tasks, averaged over 1/5/15 minutes — not purely a CPU metric. |
| **Uninterruptible sleep** | A thread blocked on something like disk I/O, unable to even respond to signals until the I/O finishes. |
| **PSI (Pressure Stall Information)** | A Linux feature reporting exactly how much time was lost to CPU/memory/IO contention. |
| **cgroup throttling** | A container's CPU usage being artificially capped by its cgroup quota, even if the host has spare capacity. |
| **Flame graph** | A visualization of profiling data showing which functions consumed the most CPU time, and their call relationships. |
| **Knee of the curve** | The load level where latency starts increasing much faster than before — the point right before things get bad. |

---

## References

- [Linux `/proc`](https://man7.org/linux/man-pages/man5/proc.5.html) - Process, memory, scheduler, and kernel state.
- [Linux PSI](https://docs.kernel.org/accounting/psi.html) - CPU, memory, and I/O pressure-stall information.
- [Linux perf tools](https://www.kernel.org/doc/html/latest/admin-guide/perf-security.html) - Profiling capabilities and security considerations.
