## Performance: Python vs C++

```dataviewjs
const sections = [
  {
    num: "01",
    title: "Abstractions have cost",
    color: "#378ADD",
    useCase: "Parsing large files in tight loops. Python lists and dicts allocate heap objects dynamically on every operation. C++ fixed buffers avoid this entirely.",
    optimisation: "Use stack buffers for hot paths. In Python, read in fixed-size chunks instead of line-by-line. In C++, use .reserve(n) on vectors before filling them.",
    py: `# every line creates a new string object on the heap
with open("data.log") as f:
    for line in f:
        process(line)  # implicit allocation per line

# better: read in fixed chunks
with open("data.log", "rb") as f:
    while chunk := f.read(1024):
        process(chunk)  # reuses the same buffer size`,
    cpp: `// BAD: dynamic allocation on every read
std::vector<char> buf(1024);  // heap alloc each iteration

// GOOD: stack buffer, zero allocation
char buffer[1024];
while (file.read(buffer, sizeof(buffer))) {
    process(buffer);
}`
  },
  {
    num: "02",
    title: "Memory management is your job",
    color: "#27AE60",
    useCase: "Long-running 24/7 systems. Garbage collectors pause at unpredictable times. Controlling allocation and deallocation gives deterministic latency.",
    optimisation: "In C++, prefer unique_ptr over raw new/delete. Use shared_ptr only when ownership is genuinely shared. In Python, be aware of reference cycles and pre-allocate where it helps.",
    py: `import gc

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
    result[i] = process(x)`,
    cpp: `// raw — avoid in modern C++
int* data = new int[1000];
process(data);
delete[] data;

// BETTER: RAII with smart pointers
#include <memory>
auto data = std::make_unique<int[]>(1000);
process(data.get());
// auto-freed when out of scope — no leak possible`
  },
  {
    num: "03",
    title: "Speed comes from design, not tricks",
    color: "#E67E22",
    useCase: "Data pipelines doing multiple passes over the same dataset. Merging passes reduces cache misses and memory bandwidth — the real bottleneck on modern CPUs.",
    optimisation: "Structure data flow linearly — fewer passes means fewer cache evictions. In Python, use generators and itertools to avoid materialising intermediate lists. Profile first with perf/gprof (C++) or cProfile (Python) before optimising anything.",
    py: `# BAD: 3 separate passes = 3x memory reads
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

result = list(pipeline(records))`,
    cpp: `// BAD: 3 separate passes
for (auto& x : records) validate(x);
for (auto& x : records) transform(x);
for (auto& x : records) aggregate(x);

// GOOD: single pass, cache-friendly
for (const auto& item : records) {
    validate(item);
    transform(item);
    aggregate(item);
}`
  },
  {
    num: "04",
    title: "Compilation is a safety net",
    color: "#9B59B6",
    useCase: "Large codebases with many function interfaces. Static type checking — whether from a compiler or a type checker — catches mismatches before runtime, not in production.",
    optimisation: "In C++, compile with -Wall -Wextra -Werror and -fsanitize=address,undefined during development. In Python, adopt mypy or pyright with strict mode — they give you a large chunk of compile-time safety without leaving the language.",
    py: `# without type hints — errors surface at runtime only
def add(a, b):
    return a + b

add(1.5, "two")  # runs, then crashes or silently misbehaves

# WITH type hints + mypy — caught before execution
def add(a: int, b: int) -> int:
    return a + b

# run: mypy script.py
# error: Argument 2 to "add" has incompatible type "str"; expected "int"`,
    cpp: `// compiler catches this immediately:
int add(int a, int b) { return a + b; }

add(1.5, "two");  // ERROR: type mismatch — caught at compile time

// templates add compile-time generics:
template<typename T>
T add(T a, T b) { return a + b; }`
  },
  {
    num: "05",
    title: "Concurrency is not magic",
    color: "#E74C3C",
    useCase: "Shared mutable state across threads. Without locks, two threads writing the same variable produce a data race — silent corruption, not a clean crash.",
    optimisation: "Minimise shared state. Prefer message-passing (queues) over shared memory. In C++, use std::atomic for simple counters — cheaper than a mutex. In Python, use multiprocessing to bypass the GIL for CPU-bound work.",
    py: `import threading

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
# but don't rely on it — use locks for anything non-trivial`,
    cpp: `#include <thread>
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
t2.join();`
  },
  {
    num: "06",
    title: "Hardware-level thinking",
    color: "#16A085",
    useCase: "Large datasets iterated repeatedly. Scattered heap pointers cause cache misses (~100 CPU cycles each). Contiguous memory means predictable, fast access.",
    optimisation: "Prefer arrays of primitives over lists of objects wherever possible. In Python, reach for numpy or array.array for numeric data. In C++, prefer struct-of-arrays over array-of-structs for SIMD/cache efficiency.",
    py: `# BAD: list of objects — each is a separate heap allocation
class Point:
    def __init__(self, x, y): self.x, self.y = x, y

points = [Point(i, i) for i in range(100_000)]  # scattered heap

# GOOD: numpy array — contiguous memory, C-speed iteration
import numpy as np

xs = np.zeros(100_000, dtype=np.int32)  # single contiguous block
# operations run on the whole array without Python loop overhead
xs *= 2`,
    cpp: `// BAD: pointer-chasing, cache unfriendly
std::vector<int*> scattered;
for (int i = 0; i < 100000; i++)
    scattered.push_back(new int(i));

// GOOD: contiguous memory, pre-allocated
std::vector<int> values;
values.reserve(100000);  // single allocation
for (int i = 0; i < 100000; i++)
    values.push_back(i);`
  },
  {
    num: "07",
    title: "Responsibility builds discipline",
    color: "#F39C12",
    useCase: "Any code that crosses module boundaries. Without explicit contracts, invalid inputs cause failures deep inside a system — hard to trace, hard to fix.",
    optimisation: "Use assert() for invariants that should never fail, exceptions for recoverable errors. In Python, validate at function entry and raise descriptive exceptions early. Never return error codes silently — propagate intent explicitly.",
    py: `# BAD: silent failure — wrong input, wrong output, no signal
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
        data[i] *= 2`,
    cpp: `#include <cassert>
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
process(buf.get(), 1000);`
  }
];

const esc = (s) => s
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const root = dv.el("div", "", { attr: { id: "perf-preview-root" } });

root.innerHTML = `
<style>
  #perf-preview-root {
    font-family: var(--font-interface, sans-serif);
    font-size: 14px;
    color: var(--text-normal);
    --bg: var(--background-primary);
    --bg2: var(--background-secondary);
    --border: var(--background-modifier-border);
    --muted: var(--text-muted);
    --code: var(--code-background, var(--background-secondary));
    --mono: var(--font-monospace, monospace);
    --r: 8px;
    --py: #3776AB;
    --py-bg: color-mix(in srgb, #3776AB 12%, var(--bg) 88%);
    --cpp: #00599C;
    --cpp-bg: color-mix(in srgb, #00599C 12%, var(--bg) 88%);
  }
  #perf-preview-root .pf-shell {
    border: 1px solid var(--border);
    border-radius: var(--r);
    background: var(--bg);
    overflow: hidden;
  }
  #perf-preview-root .pf-top-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    padding: 16px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(180deg, color-mix(in srgb, var(--bg2) 88%, white 12%), var(--bg));
  }
  #perf-preview-root .pf-point-tab {
    padding: 10px 15px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--muted);
    font-family: var(--font-interface, sans-serif);
    font-size: 12.5px;
    font-weight: 800;
    letter-spacing: .06em;
    cursor: pointer;
    transition: all .15s ease;
  }
  #perf-preview-root .pf-point-tab:hover {
    color: var(--text-normal);
  }
  #perf-preview-root .pf-point-tab.active {
    color: var(--text-normal);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--pf-accent, #378ADD) 28%, transparent);
    background: color-mix(in srgb, var(--pf-accent, #378ADD) 12%, var(--bg) 88%);
    border-color: color-mix(in srgb, var(--pf-accent, #378ADD) 30%, var(--border));
  }
  #perf-preview-root .pf-panels {
    padding: 0;
  }
  #perf-preview-root .pf-panel {
    display: none;
  }
  #perf-preview-root .pf-panel.active {
    display: block;
  }
  #perf-preview-root .pf-head {
    padding: 18px 18px 12px;
    border-bottom: 1px solid var(--border);
  }
  #perf-preview-root .pf-kicker {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  #perf-preview-root .pf-title {
    font-size: 21px;
    font-weight: 800;
    margin: 0 0 12px;
  }
  #perf-preview-root .pf-meta {
    display: grid;
    gap: 8px;
    color: var(--muted);
    line-height: 1.6;
  }
  #perf-preview-root .pf-label {
    color: var(--text-normal);
    font-weight: 600;
  }
  #perf-preview-root .pf-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    padding: 16px 18px 18px;
  }
  #perf-preview-root .pf-col {
    min-width: 0;
    border: 1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden;
    background: var(--bg);
  }
  #perf-preview-root .pf-col.py {
    border-color: color-mix(in srgb, var(--py) 22%, var(--border));
  }
  #perf-preview-root .pf-col.cpp {
    border-color: color-mix(in srgb, var(--cpp) 22%, var(--border));
  }
  #perf-preview-root .pf-col-head {
    padding: 10px 12px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: .06em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  #perf-preview-root .pf-col-head.py {
    color: var(--py);
    background: var(--py-bg);
    border-bottom-color: color-mix(in srgb, var(--py) 22%, var(--border));
  }
  #perf-preview-root .pf-col-head.cpp {
    color: var(--cpp);
    background: var(--cpp-bg);
    border-bottom-color: color-mix(in srgb, var(--cpp) 22%, var(--border));
  }
  #perf-preview-root pre {
    margin: 0;
    padding: 14px 16px;
    overflow-x: auto;
    background: var(--code);
    font-family: var(--mono);
    font-size: 12.75px;
    line-height: 1.72;
    white-space: pre;
  }
  #perf-preview-root .pf-col.py pre {
    background: color-mix(in srgb, var(--py) 5%, var(--code) 95%);
    color: color-mix(in srgb, var(--text-normal) 88%, var(--py) 12%);
  }
  #perf-preview-root .pf-col.cpp pre {
    background: color-mix(in srgb, var(--cpp) 5%, var(--code) 95%);
    color: color-mix(in srgb, var(--text-normal) 88%, var(--cpp) 12%);
  }
  #perf-preview-root .pf-col pre code {
    font-family: var(--mono);
  }
  @media (max-width: 900px) {
    #perf-preview-root .pf-compare {
      grid-template-columns: 1fr;
    }
  }
</style>
<div class="pf-shell">
  <div class="pf-top-tabs">
    ${sections.map((s, idx) => `
      <button
        class="pf-point-tab ${idx === 0 ? "active" : ""}"
        data-point="${s.num}"
        style="--pf-accent:${s.color}"
      >
        ${s.num}
      </button>
    `).join("")}
  </div>
  <div class="pf-panels">
  ${sections.map(s => `
    <section class="pf-panel ${s.num === "01" ? "active" : ""}" data-point-panel="${s.num}">
      <div class="pf-head">
        <div class="pf-kicker" style="color:${s.color}">Preview ${s.num}</div>
        <div class="pf-title">${s.num} — ${s.title}</div>
        <div class="pf-meta">
          <div><span class="pf-label">Use case:</span> ${s.useCase}</div>
          <div><span class="pf-label">Optimisation:</span> ${s.optimisation}</div>
        </div>
      </div>
      <div class="pf-compare">
        <div class="pf-col py">
          <div class="pf-col-head py">Python</div>
          <pre class="language-python"><code class="language-python">${esc(s.py)}</code></pre>
        </div>
        <div class="pf-col cpp">
          <div class="pf-col-head cpp">C++</div>
          <pre class="language-cpp"><code class="language-cpp">${esc(s.cpp)}</code></pre>
        </div>
      </div>
    </section>
  `).join("")}
</div>
</div>
`;

const pointTabs = root.querySelectorAll(".pf-point-tab");
const pointPanels = root.querySelectorAll(".pf-panel");

pointTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-point");

    pointTabs.forEach((t) => t.classList.remove("active"));
    pointPanels.forEach((p) => p.classList.remove("active"));

    tab.classList.add("active");
    const panel = root.querySelector('[data-point-panel="' + target + '"]');
    if (panel) panel.classList.add("active");
  });
});

if (window.Prism?.highlightAllUnder) {
  window.Prism.highlightAllUnder(root);
}
```


#cpp #python 
