
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

---
We can change recursion depth limit in Python
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

---
We can make file reading more efficient in Python using generators.

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

---
For any kind of debugging in Python we shud use logging, strace, and watchdog for more information about errors.
```python
# =============================================================================
# STEP 1: LOGGING - Your Black Box Recorder
# =============================================================================

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',  # Timestamp + level + message
    handlers=[
        logging.FileHandler('app.log'),  # Save to file
        logging.StreamHandler()           # Also print to console
    ]
)

logger = logging.getLogger(__name__)

logger.info("Script started")           # General information
logger.warning("Disk space low!")        # Something concerning
logger.error("Failed to save file")      # Something broke
logger.critical("Database unreachable")  # Everything is on fire

"""
EXAMPLE OUTPUT IN app.log:
2024-12-05 14:30:01 - INFO - Script started
2024-12-05 14:30:05 - WARNING - Disk space low!
2024-12-05 14:30:10 - ERROR - Failed to save file

Now when your boss asks "Why did it crash?" → You have receipts!
"""


# =============================================================================
# STEP 2: EXCEPTION HANDLING - Don't Let Your Script Die Silently
# =============================================================================
def process_file(filename):
    """
    This function shows PROPER exception handling with logging
    """
    
    try:
        logger.info(f"Opening file: {filename}")
        
        with open(filename, 'r') as f:
            data = f.read()
            logger.info(f"Successfully read {len(data)} characters")
            return data
            
    except FileNotFoundError:
        logger.error(f"ERROR: File '{filename}' not found!")
        logger.error("Check if the file path is correct")
        return None
    
    except PermissionError:
        logger.error(f"ERROR: Permission denied for '{filename}'")
        logger.error("Check file permissions (chmod on Linux/Mac)")
        return None
    
    except Exception as e:
        logger.error(f"Unexpected error: {type(e).__name__}")
        logger.error(f"Details: {e}")
        logger.debug("Full error trace:", exc_info=True)  # Full traceback
        return None
    
    finally:
        logger.info("Finished processing file")


# =============================================================================
# STEP 3: MEMORY TRACKING - Find Memory Leaks
# =============================================================================
"""
WHY MEMORY TRACKING?
--------------------
Your script runs fine for 5 minutes, then crashes.
Why? Memory leak! It keeps eating RAM until the system kills it.

tracemalloc = Memory detective. It tells you:
- How much memory you're using RIGHT NOW
- What's the highest memory usage (peak)
- Where the memory is being allocated
"""

import tracemalloc

def memory_hungry_function():
    tracemalloc.start()
    logger.info("Started memory tracking")
    
    big_list = [i * i for i in range(1000000)]  # Creates 1 million numbers
    
    current, peak = tracemalloc.get_traced_memory()
    logger.info(f"Current memory: {current / 1024 / 1024:.2f} MB")
    logger.info(f"Peak memory: {peak / 1024 / 1024:.2f} MB")
    
    tracemalloc.stop()
    
# =============================================================================
# STEP 4: WATCHDOG - Monitor File Changes in Real-Time
# =============================================================================
"""
WHY WATCHDOG?
-------------
Scenario: Your script processes data files. Suddenly it breaks.
Question: Did someone modify/delete a file? When? Which one?

Watchdog = Security camera for your files. It watches a directory and alerts you
when files are created, modified, or deleted.
"""

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class MyFileMonitor(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.is_directory:
            logger.warning(f"⚠️  FILE MODIFIED: {event.src_path}")
    
    def on_created(self, event):
        if not event.is_directory:
            logger.info(f"✅ FILE CREATED: {event.src_path}")
    
    def on_deleted(self, event):
        if not event.is_directory:
            logger.error(f"❌ FILE DELETED: {event.src_path}")

def start_watching_directory(path="./data"):
    event_handler = MyFileMonitor()
    observer = Observer()
    
    # Tell observer: watch this directory, use this event handler
    observer.schedule(event_handler, path, recursive=False)
    observer.start()
    
    logger.info(f"👀 Now watching directory: {path}")
    return observer


# =============================================================================
# STEP 5: STRACE - See What Your Script is ACTUALLY Doing
# =============================================================================
"""
WHAT IS STRACE?
---------------
Strace = X-ray vision for your program. It shows EVERY system call.

System call = When your Python code asks the operating system to do something:
- Open a file? → System call
- Read from disk? → System call
- Write to network? → System call

WHY USE IT?
-----------
Your script says "I opened the file!" but it still fails.
Strace shows: "Actually, you tried to open /wrong/path/file.txt"

HOW TO USE IT:
--------------
Instead of:
    python my_script.py

Run:
    strace -e trace=open,read,write python my_script.py

This shows ONLY file operations (open, read, write)

EXAMPLE OUTPUT:
open("/home/user/data.txt", O_RDONLY) = -1 ENOENT (No such file or directory)
                                        ^^^^^ Aha! File doesn't exist!

open("/var/log/app.log", O_WRONLY|O_APPEND) = 3
write(3, "2024-12-05 14:30:01 - INFO...", 45) = 45
                                                 ^^^ Successfully wrote 45 bytes
"""

# =============================================================================
# STEP 6: PDB - Interactive Debugger
# =============================================================================
"""
WHAT IS PDB?
------------
PDB = Python Debugger. It's like stopping time and inspecting everything.

When your code breaks, you can:
- Pause execution at any line
- Check variable values
- Step through code line by line
- Run commands interactively

HOW TO USE IT:
--------------
Add this line where you want to pause:
"""

def buggy_function(x, y):
    result = x + y
    
    import pdb; pdb.set_trace()  # ← EXECUTION PAUSES HERE
    
    # Now you can type commands:
    # (Pdb) print(x)      → Shows value of x
    # (Pdb) print(y)      → Shows value of y
    # (Pdb) n             → Next line
    # (Pdb) c             → Continue execution
    # (Pdb) l             → List code around current line
    
    return result * 2

# =============================================================================
# COMPLETE WORKFLOW EXAMPLE
# =============================================================================

def complete_monitoring_workflow():
    """
    THE FULL PROFESSIONAL WORKFLOW
    """
    
    logger.info("="*60)
    logger.info("APPLICATION STARTED")
    logger.info("="*60)
    
    # Step 1: Start memory tracking
    tracemalloc.start()
    logger.info("✓ Memory tracking started")
    
    # Step 2: Start file monitoring
    observer = start_watching_directory("./data")
    logger.info("✓ File monitoring started")
    
    try:
        # Step 3: Do your actual work with exception handling
        logger.info("Processing files...")
        result = process_file("data.txt")
        if result:
            logger.info("✓ File processed successfully")
        else:
            logger.error("✗ File processing failed")
        
        # Step 4: Check memory usage
        current, peak = tracemalloc.get_traced_memory()
        logger.info(f"Memory usage: {current / 1024 / 1024:.2f} MB (peak: {peak / 1024 / 1024:.2f} MB)")
        
        # If you suspect a specific section, add breakpoint:
        # import pdb; pdb.set_trace()
        
    except Exception as e:
        logger.critical(f"CRITICAL ERROR: {e}", exc_info=True)
    
    finally:
        # Step 5: Cleanup
        observer.stop()
        observer.join()
        tracemalloc.stop()
        logger.info("="*60)
        logger.info("APPLICATION STOPPED")
        logger.info("="*60)

"""
NOW YOU HAVE:
✓ Logs showing what happened (logging)
✓ Errors caught and logged (exception handling)
✓ Memory usage tracked (tracemalloc)
✓ File changes monitored (watchdog)
✓ Can trace system calls (strace - run from terminal)
✓ Can debug interactively (pdb - add breakpoints)

THIS IS HOW PROFESSIONALS DEBUG IN PRODUCTION.
"""

if __name__ == "__main__":
    print("This is PRODUCTION Python.")
    print("\nWhen your script crashes at 3 AM, THIS is what saves you.\n")
    print("="*70)
    
    import os
    os.makedirs("./data", exist_ok=True)
    
    complete_monitoring_workflow()
```