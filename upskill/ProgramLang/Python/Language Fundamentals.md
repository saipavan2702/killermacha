# Python Language Fundamentals

> [!summary]
> Understand Python's evaluation and memory behavior before reaching for framework-level solutions.

## Mutable Default Arguments

In Python, default arguments are evaluated **once**, at function definition time.
So this part  `list=[]` creates **one single list** that is shared across **all calls** of the function.
### Example of the bug:
```python
print(add_items(1))   # [1]
print(add_items(2))   # [1, 2]  <- unexpected!
print(add_items(3))   # [1, 2, 3]
```

Each call keeps modifying the *same* list.
Use `None` as a default, then create a new list inside the function:
```python
def add_items(val, lst=None):
    if lst is None:
        lst = []
    lst.append(val)
    return lst
```
Now each call behaves independently:
```python
print(add_items(1))        # [1]
print(add_items(2))        # [2]
print(add_items(3, [10]))  # [10, 3]
```
* ❌ avoid mutable default arguments (`list=[]`, `dict={}`, `set=set()`).
* ✅ use `None` and initialise inside the function.


## Recursion Limits

Python has a configurable recursion-depth limit.
```python
import sys

print("Default recursion limit:", sys.getrecursionlimit())
sys.setrecursionlimit(10000)

def recurse(n):
    if n == 0:
        return "Done"
    return recurse(n - 1)

try:
    print(recurse(5000))
except RecursionError as e:
    print("Recursion depth exceeded:", e)
```

Why it crashes:
- Python uses a C stack frame per call
- Hitting the OS / CPython stack limit → RecursionError

Increasing the limit can postpone the crash—but not fix the underlying issue.


## Generators for Large Files

Generators make large-file processing memory efficient.

```python
def read_large_file(filename):
    """
    - Loading a 10GB file with f.read() → Crashes
    - Using generator → Processes one line at a time, uses ~constant memory
    """
    with open(filename) as f:
        for line in f:
            yield line.strip()

def process_with_list(filename):
    """BAD: Loads entire file into memory"""
    with open(filename) as f:
        lines = f.readlines() # Memory spike!
    
    for line in lines:
        process_line(line)

def process_with_generator(filename):
    """GOOD: Uses constant memory"""
    for line in read_large_file(filename):
        process_line(line)

def process_line(line):
    """Simulate processing"""
    return line.upper()

def compare_memory_usage(filename, num_lines=100000):
    """Compare memory usage: list vs generator"""
    # with open(filename) as f:
    #    lines = f.readlines()
    #    count = len(lines)
    
    # Use generator (GOOD)
    count = 0
    for line in read_large_file(filename):
        count += 1
```
