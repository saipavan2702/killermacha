> [!summary]
> Performance comes from allocation, data layout, ownership, compilation, and concurrency choices more than from language stereotypes.

Map: [[Upskill/Learning|Learning]]

## 01. Abstractions have cost

**Use case:** Parsing large files in tight loops. Python lists and dicts allocate heap objects dynamically on every operation. C++ fixed buffers avoid this entirely.

**Optimization:** Use stack buffers for hot paths. In Python, read in fixed-size chunks instead of line-by-line. In C++, use .reserve(n) on vectors before filling them.

### Python

```python
# every line creates a new string object on the heap
with open("data.log") as f:
    for line in f:
        process(line)  # implicit allocation per line

# better: read in fixed chunks
with open("data.log", "rb") as f:
    while chunk := f.read(1024):
        process(chunk)  # reuses the same buffer size
```

### C++

```cpp
// BAD: dynamic allocation on every read
std::vector<char> buf(1024);  // heap alloc each iteration

// GOOD: stack buffer, zero allocation
char buffer[1024];
while (file.read(buffer, sizeof(buffer))) {
    process(buffer);
}
```

## 02. Memory management is your job

**Use case:** Long-running 24/7 systems. Garbage collectors pause at unpredictable times. Controlling allocation and deallocation gives deterministic latency.

**Optimization:** In C++, prefer unique_ptr over raw new/delete. Use shared_ptr only when ownership is genuinely shared. In Python, be aware of reference cycles and pre-allocate where it helps.

### Python

```python
import gc

# Python GC runs automatically, but you can force it
# to avoid pauses at inconvenient times
gc.disable()           # disable automatic GC
do_latency_critical_work()
gc.collect()           # collect manually at a safe point
gc.enable()

# also: avoid creating unnecessary objects in hot loops
result = []
result.append(x)       # each append may trigger realloc
                       # pre-allocate with [None] * n instead
result = [None] * 1000
for i, x in enumerate(data):
    result[i] = process(x)
```

### C++

```cpp
// raw — avoid in modern C++
int* data = new int[1000];
process(data);
delete[] data;

// BETTER: RAII with smart pointers
#include <memory>
auto data = std::make_unique<int[]>(1000);
process(data.get());
// auto-freed when out of scope — no leak possible
```

## 03. Speed comes from design, not tricks

**Use case:** Data pipelines doing multiple passes over the same dataset. Merging passes reduces cache misses and memory bandwidth — the real bottleneck on modern CPUs.

**Optimization:** Structure data flow linearly — fewer passes means fewer cache evictions. In Python, use generators and itertools to avoid materialising intermediate lists. Profile first with perf/gprof (C++) or cProfile (Python) before optimising anything.

### Python

```python
# BAD: 3 separate passes = 3x memory reads
validated  = [validate(x) for x in records]
transformed = [transform(x) for x in validated]
result     = [aggregate(x) for x in transformed]

# GOOD: single pass, generator chain — lazy, no intermediate lists
from itertools import islice

def pipeline(records):
    for item in records:
        v = validate(item)
        t = transform(v)
        yield aggregate(t)

result = list(pipeline(records))
```

### C++

```cpp
// BAD: 3 separate passes
for (auto& x : records) validate(x);
for (auto& x : records) transform(x);
for (auto& x : records) aggregate(x);

// GOOD: single pass, cache-friendly
for (const auto& item : records) {
    validate(item);
    transform(item);
    aggregate(item);
}
```

## 04. Compilation is a safety net

**Use case:** Large codebases with many function interfaces. Static type checking — whether from a compiler or a type checker — catches mismatches before runtime, not in production.

**Optimization:** In C++, compile with -Wall -Wextra -Werror and -fsanitize=address,undefined during development. In Python, adopt mypy or pyright with strict mode — they give you a large chunk of compile-time safety without leaving the language.

### Python

```python
# without type hints — errors surface at runtime only
def add(a, b):
    return a + b

add(1.5, "two")  # runs, then crashes or silently misbehaves

# WITH type hints + mypy — caught before execution
def add(a: int, b: int) -> int:
    return a + b

# run: mypy script.py
# error: Argument 2 to "add" has incompatible type "str"; expected "int"
```

### C++

```cpp
// compiler catches this immediately:
int add(int a, int b) { return a + b; }

add(1.5, "two");  // ERROR: type mismatch — caught at compile time

// templates add compile-time generics:
template<typename T>
T add(T a, T b) { return a + b; }
```

## 05. Concurrency is not magic

**Use case:** Shared mutable state across threads. Without locks, two threads writing the same variable produce a data race — silent corruption, not a clean crash.

**Optimization:** Minimise shared state. Prefer message-passing (queues) over shared memory. In C++, use std::atomic for simple counters — cheaper than a mutex. In Python, use multiprocessing to bypass the GIL for CPU-bound work.

### Python

```python
import threading

counter = 0
lock = threading.Lock()

def increment():
    global counter
    with lock:
        counter += 1  # safe — only one thread at a time

threads = [threading.Thread(target=increment) for _ in range(100)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)  # reliably 100

# note: Python's GIL protects simple ops like counter += 1,
# but don't rely on it — use locks for anything non-trivial
```

### C++

```cpp
#include <thread>
#include <mutex>

int counter = 0;
std::mutex mtx;

void increment() {
    std::lock_guard<std::mutex> lock(mtx);
    counter++;  // safe — only one thread at a time
}

std::thread t1(increment);
std::thread t2(increment);
t1.join();
t2.join();
```

## 06. Hardware-level thinking

**Use case:** Large datasets iterated repeatedly. Scattered heap pointers cause cache misses (~100 CPU cycles each). Contiguous memory means predictable, fast access.

**Optimization:** Prefer arrays of primitives over lists of objects wherever possible. In Python, reach for numpy or array.array for numeric data. In C++, prefer struct-of-arrays over array-of-structs for SIMD/cache efficiency.

### Python

```python
# BAD: list of objects — each is a separate heap allocation
class Point:
    def __init__(self, x, y): self.x, self.y = x, y

points = [Point(i, i) for i in range(100_000)]  # scattered heap

# GOOD: numpy array — contiguous memory, C-speed iteration
import numpy as np

xs = np.zeros(100_000, dtype=np.int32)  # single contiguous block
# operations run on the whole array without Python loop overhead
xs *= 2
```

### C++

```cpp
// BAD: pointer-chasing, cache unfriendly
std::vector<int*> scattered;
for (int i = 0; i < 100000; i++)
    scattered.push_back(new int(i));

// GOOD: contiguous memory, pre-allocated
std::vector<int> values;
values.reserve(100000);  // single allocation
for (int i = 0; i < 100000; i++)
    values.push_back(i);
```

## 07. Responsibility builds discipline

**Use case:** Any code that crosses module boundaries. Without explicit contracts, invalid inputs cause failures deep inside a system — hard to trace, hard to fix.

**Optimization:** Use assert() for invariants that should never fail, exceptions for recoverable errors. In Python, validate at function entry and raise descriptive exceptions early. Never return error codes silently — propagate intent explicitly.

### Python

```python
# BAD: silent failure — wrong input, wrong output, no signal
def process(data, length):
    for i in range(length):
        data[i] *= 2

# GOOD: explicit contracts at the boundary
def process(data: list[int], length: int) -> None:
    if data is None:
        raise ValueError("data must not be None")
    if length == 0:
        raise ValueError("length must be > 0")
    if length > len(data):
        raise IndexError(f"length {length} exceeds data size {len(data)}")

    for i in range(length):
        data[i] *= 2
```

### C++

```cpp
#include <cassert>
#include <stdexcept>

void process(int* data, size_t len) {
    assert(data != nullptr);       // dev-mode check, zero cost in release
    if (len == 0)
        throw std::invalid_argument("empty input");

    for (size_t i = 0; i < len; i++)
        data[i] *= 2;
}

// caller owns cleanup — don't assume the runtime saves you
auto buf = std::make_unique<int[]>(1000);
process(buf.get(), 1000);
```

## Related

- [[Upskill/ProgramLang/C++/Priority Queues|Priority Queues]]
