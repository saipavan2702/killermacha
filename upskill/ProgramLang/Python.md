---
title: Python
tags:
  - lang
  - "#python"
date: 2025-12-24
---
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
        time.sleep(2)
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


## Python Best Practices

## 1. Logging Setup

One config. Two streams: `debug` (everything) and `console` (user-visible only).

```python
import logging, os, sys, traceback
from datetime import datetime

DEBUG_LOGGER   = "debug_logs"
CONSOLE_LOGGER = "console_logs"

def setup_logging(name="logs"):
    log_dir = os.path.expanduser("~/escs_work/logs")
    os.makedirs(log_dir, exist_ok=True)
    ts = datetime.now().strftime("_%Y-%m-%dT%H-%M-%S")

    for logger_name, fmt, suffix in [
        (DEBUG_LOGGER,   "%(asctime)s %(threadName)s %(levelname)s %(message)s", "_debug"),
        (CONSOLE_LOGGER, "%(asctime)s %(message)s",                              "_console"),
    ]:
        path    = os.path.join(log_dir, f"{name}{suffix}{ts}.log")
        handler = logging.FileHandler(path, mode="w")
        handler.setFormatter(logging.Formatter(fmt))
        log = logging.getLogger(logger_name)
        log.setLevel(logging.INFO)
        log.handlers.clear()
        log.addHandler(handler)

def log_line(msg):  logging.getLogger(DEBUG_LOGGER).info(msg)
def log_error(msg):
    logging.getLogger(DEBUG_LOGGER).error(msg)
    logging.getLogger(CONSOLE_LOGGER).error(msg)
    print(msg, flush=True)

def core_dump(exit_process=False):
    log_line(traceback.format_exc())
    if exit_process:
        sys.exit(1)
```

> One place to configure. `core_dump()` captures the full traceback in one call.

---

## 2. Execution Lifecycle

Always log start and final status — even on crash.

```python
def execute():
    status = ""
    try:
        log_line("STARTING")
        # ... work ...
        status = "SUCCEEDED"
    finally:
        log_line(f"FINAL STATUS: {status}")   # always runs

if __name__ == "__main__":
    try:
        setup_logging("my_module")
        execute()
    except Exception:
        core_dump(exit_process=True)
```

> `finally` guarantees the status line even if an exception escapes.

---

## 3. Structured Exception Logging

Use `exc_info=True` + `stack_info=True` — full traceback and call stack in one log line.

```python
import logging
logger = logging.getLogger(__name__)

try:
    main_work()
except ValueError as e:
    logger.error(f"Invalid input: {e}", exc_info=True, stack_info=True)
except RuntimeError as e:
    logger.error(f"Runtime failure: {e}", exc_info=True, stack_info=True)
except Exception as e:
    logger.error(f"Unexpected: {e}", exc_info=True, stack_info=True)
```

---

## 4. Decorators

### `@graceful` — clean user-facing error message

```python
from functools import wraps

ERRORS = {
    "create_volume": "Creation of volume failed",
    "attach_volume": "Failed to attach volume to host",
}

def graceful(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            msg = ERRORS.get(func.__name__)
            if msg:
                log_error(msg)
            raise
    return wrapper

@graceful
def create_volume():
    raise RuntimeError("OCI 409 IncorrectState")
```

### `@failsafe` — retryable vs non-retryable errors

```python
class Error:
    def __init__(self, code, msg, is_retryable=True):
        self.code, self.msg, self.is_retryable = code, msg, is_retryable

class NonRetryableError(Exception):
    def __init__(self, code, msg, original):
        self.code, self.msg, self.original = code, msg, original
    def __str__(self):
        return f"{self.code}: {self.msg}. {self.original}"

ERROR_MAP = {
    "initialize_inputs": Error("APP-001", "Invalid input",            is_retryable=False),
    "create_resource":   Error("APP-002", "Resource creation failed", is_retryable=True),
}

def failsafe(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            err = ERROR_MAP.get(func.__name__, Error("APP-000", "Execution failed"))
            log_error(f"{err.code}: {err.msg}: {e}")
            core_dump(exit_process=False)
            if not err.is_retryable:
                raise NonRetryableError(err.code, err.msg, str(e))
            raise
    return wrapper
```

### `@log_method` — entry/exit tracing

```python
def log_method(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        log_line(f">>> {func.__name__} started")
        result = func(self, *args, **kwargs)
        log_line(f">>> {func.__name__} finished")
        return result
    return wrapper
```

> Use `@graceful` for user-facing messages. Use `@failsafe` when callers need to decide retry logic. Always use `@wraps` to preserve the function name.

---

## 5. Input Validation

Validate early. Collect **all** errors before raising — don't stop on the first one.

```python
import os
from oci.config import PATTERNS

class Inputs:
    def __init__(self, data: dict):
        self.tenant_id   = data["tenantId"].strip('"')
        self.user_id     = data["userId"].strip('"')
        self.fingerprint = data["fingerprint"].strip('"')
        self.key_path    = data["ociPrivKeyPath"].strip('"')
        self.region      = data.get("region", "us-ashburn-1").strip('"')
        self._validate()

    def _validate(self):
        errors = []
        if not PATTERNS["tenancy"].match(self.tenant_id):
            errors.append(f"tenantId={self.tenant_id}: invalid OCID")
        if not PATTERNS["user"].match(self.user_id):
            errors.append(f"userId={self.user_id}: invalid OCID")
        if not PATTERNS["fingerprint"].match(self.fingerprint):
            errors.append(f"fingerprint: invalid format")
        if not os.path.isfile(self.key_path):
            errors.append(f"ociPrivKeyPath: file not found")
        elif oct(os.stat(self.key_path).st_mode)[-3:] not in ("600", "400"):
            errors.append(f"ociPrivKeyPath: run chmod 600 {self.key_path}")
        if self.region not in ("us-ashburn-1", "sea"):
            errors.append(f"region={self.region}: invalid")
        if errors:
            raise ValueError(f"{len(errors)} error(s):\n" + "\n".join(errors))
```

---

## 6. `.properties` File Parsing

```python
import configparser

def read_properties_file(path: str) -> dict:
    cfg = configparser.RawConfigParser()
    cfg.optionxform = str          # preserve original key casing
    with open(path) as f:
        cfg.read_string("[root]\n" + f.read())
    return dict(cfg.items("root"))

# Usage
data   = read_properties_file("input.properties")
inputs = Inputs(data)
```

> Handles Java-style `.properties` files without a separate library. The `[root]` prefix tricks `configparser` into accepting section-less files.

---

## 7. SSH Handler (Context Manager)

```python
import os, socket, time
from paramiko import SSHClient, AutoAddPolicy, RSAKey, DSSKey, SSHException

class SSHHandler:
    class Error(RuntimeError): pass

    def __init__(self, hostname, username, key_file, max_retries=5):
        self._client = SSHClient()
        self._client.set_missing_host_key_policy(AutoAddPolicy())
        try:
            pkey = RSAKey.from_private_key_file(key_file)
        except Exception:
            try:
                pkey = DSSKey.from_private_key_file(key_file)
            except Exception as e:
                raise SSHHandler.Error(f"Cannot load key: {e}") from e

        for attempt in range(max_retries + 1):
            try:
                self._client.connect(hostname, username=username, pkey=pkey, timeout=30)
                self._client.get_transport().set_keepalive(30)
                return
            except (SSHException, socket.error):
                if attempt < max_retries:
                    time.sleep(30)
        raise SSHHandler.Error(f"Cannot connect to {hostname} after {max_retries} retries")

    def __enter__(self): return self
    def __exit__(self, *_): self._client.close()

    def run(self, cmd, check=True, timeout=60):
        _, out, err = self._client.exec_command(cmd, timeout=timeout)
        code   = out.channel.recv_exit_status()
        stdout = out.read().decode()
        stderr = err.read().decode()
        if check and code != 0:
            raise SSHHandler.Error(f"Exit {code}: {stderr}")
        return stdout, stderr, code

    def put(self, local, remote, executable=False):
        with self._client.open_sftp() as sftp:
            try:   sftp.mkdir(os.path.dirname(remote))
            except Exception: pass
            sftp.put(local, remote, confirm=True)
            if executable:
                sftp.chmod(remote, 0o755)

# Usage
with SSHHandler("10.0.0.10", "opc", "/path/key.pem") as ssh:
    stdout, _, _ = ssh.run("hostname")
```

---

## 8. Temp File Cleanup

```python
def use_temp_script(ssh, local_path, remote_path, content):
    with open(local_path, "w") as f:
        f.write(content)
    try:
        ssh.put(local_path, remote_path, executable=True)
        return ssh.run(f"sh {remote_path}")
    finally:
        if os.path.exists(local_path):
            os.remove(local_path)                         # local: always cleaned
        ssh.run(f"rm -f {remote_path}", check=False)      # remote: best-effort
```

> `finally` runs even if the command fails — no temp file leaks on either side.

---

## 9. OCI Retry Strategy

```python
import oci

def get_retry_strategy(timeout_secs=3600):
    return oci.retry.RetryStrategyBuilder(
        max_attempts_check=False,
        total_elapsed_time_check=True,
        total_elapsed_time_seconds=timeout_secs,
        retry_max_wait_between_calls_seconds=45,
        retry_base_sleep_time_seconds=2,
        service_error_check=True,
        service_error_retry_on_any_5xx=True,
        service_error_retry_config={409: ["IncorrectState"], 429: []},
        backoff_type=oci.retry.BACKOFF_FULL_JITTER_EQUAL_ON_THROTTLE_VALUE,
    ).get_retry_strategy()

# Usage
client = oci.core.VirtualNetworkClient(
    config=config, signer=signer,
    retry_strategy=get_retry_strategy(3600),
)
```

> Jittered backoff avoids thundering herd. Bounded by wall-clock time, not just attempt count.

---

## 10. Poll Until Remote Process Finishes

```python
import socket, time

def run_background_and_wait(ssh, remote_script, poll_secs=60):
    try:
        ssh.run(f"nohup sh {remote_script} &", check=False)
    except socket.timeout:
        log_line("socket timeout on launch — expected for background jobs")

    while True:
        out, _, _ = ssh.run(
            f"ps -ef | grep -v grep | grep -w {remote_script} | wc -l"
        )
        if out.strip() == "0":
            log_line(f"{remote_script} finished")
            break
        log_line(f"{remote_script} still running...")
        time.sleep(poll_secs)
```

> Separates "launch" timeout from "job still running" — avoids blocking a single SSH call for hours.

---

## 11. Semantic Retry (output-aware)

Use when exit code 0 doesn't mean the system is actually ready yet.

```python
import time

def retry_until(call_fn, success_contains=None, failure_ok_contains=None,
                max_retries=10, sleep_secs=15):
    # call_fn() must return dict: {exitCode, output, error}
    for attempt in range(1, max_retries + 1):
        r   = call_fn()
        out = r.get("output", "")
        err = r.get("error", "")

        if r["exitCode"] == 0:
            if not success_contains or any(m in out for m in success_contains):
                return r
        else:
            if failure_ok_contains and any(m in f"{out} {err}" for m in failure_ok_contains):
                return r

        if attempt < max_retries:
            log_line(f"attempt {attempt}: retrying in {sleep_secs}s")
            time.sleep(sleep_secs)

    raise RuntimeError(f"Retries exhausted. Last error: {err}")
```

---

## 12. Global Retry with Exponential Backoff

For long-running orchestration that needs to survive transient failures over hours.

```python
import time, secrets
from abc import ABC, abstractmethod

class RetryLoop(ABC):
    MIN_BACKOFF = 60
    MAX_BACKOFF = 240

    def __init__(self, timeout_secs=-1):
        self._start    = time.time()
        self._timeout  = timeout_secs
        self._backoff  = self.MIN_BACKOFF
        self._attempts = 0

    def _timed_out(self):
        return self._timeout > 0 and (time.time() - self._start) > self._timeout

    def _sleep(self):
        delay = min(self._backoff, self.MAX_BACKOFF) + secrets.randbelow(10000) / 10000
        log_line(f"retry #{self._attempts}, sleeping {delay:.1f}s")
        time.sleep(delay)
        self._backoff *= 2

    def run(self):
        while True:
            try:
                self.execute()
                self.on_success()
                return
            except Exception as e:
                self._attempts += 1
                self.on_failure(e)
                if self._timed_out():
                    self.on_timeout()
                    raise
                self._sleep()

    @abstractmethod
    def execute(self): pass
    def on_success(self): pass
    def on_failure(self, e): log_error(f"failed: {e}")
    def on_timeout(self):   log_error("timed out")
```

---

## 13. Hard Timeout with `signal.alarm`

```python
import signal

def run_with_timeout(seconds, fn, *args, **kwargs):
    def _handler(sig, frame):
        raise TimeoutError(f"Exceeded {seconds}s")

    signal.signal(signal.SIGALRM, _handler)
    signal.alarm(seconds)
    try:
        return fn(*args, **kwargs)
    except TimeoutError:
        log_error(f"Timeout after {seconds}s")
        raise
    finally:
        signal.alarm(0)    # always cancel

# Usage
run_with_timeout(300, long_running_task)
```

> Unix only. For threads or Windows, use `concurrent.futures` with a `timeout` argument.

---

## 14. Parallel Execution

### Process pool — isolated workers (CPU-bound)

```python
from concurrent.futures import ProcessPoolExecutor, as_completed

def run_on_all_hosts(hosts, worker_fn, max_workers=4):
    failed = 0
    with ProcessPoolExecutor(max_workers=max_workers) as pool:
        futures = {pool.submit(worker_fn, h): h for h in hosts}
        for future in as_completed(futures):
            try:
                future.result()
            except Exception as e:
                log_error(f"Worker {futures[future]} failed: {e}")
                failed += 1
    return failed
```

### Thread fanout — I/O-bound tasks

```python
import threading

def run_threads(items, worker_fn):
    errors = {}
    def _wrap(i, item):
        try:   worker_fn(item)
        except Exception as e: errors[i] = str(e)

    threads = [
        threading.Thread(target=_wrap, args=(i, item), name=f"T-{i+1}")
        for i, item in enumerate(items)
    ]
    for t in threads: t.start()
    for t in threads: t.join()

    if errors:
        for i, msg in errors.items():
            log_line(f"Thread T-{i+1}: {msg}")
        raise RuntimeError("One or more threads failed")
```

> `as_completed` collects all results even when some workers fail — others keep running.

---

## 15. subprocess

```python
import subprocess

def run_cmd(cmd: list, timeout=120):
    try:
        subprocess.run(cmd, check=True, timeout=timeout)
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Command failed: {cmd}") from e
    except subprocess.TimeoutExpired:
        raise RuntimeError(f"Command timed out: {cmd}")

def run_cmd_output(cmd: list, timeout=120) -> str:
    result = subprocess.run(cmd, check=True, capture_output=True, text=True, timeout=timeout)
    return result.stdout

def require_command(name: str):
    try:   subprocess.run(["command", "-v", name], check=True)
    except subprocess.CalledProcessError:
        raise RuntimeError(f"'{name}' not found in PATH")
```

> Always pass `check=True` and `timeout`. Never let a subprocess hang.

---

## 16. HTTP Calls

```python
import requests, time

def fetch_with_retries(url, retry_limit=10, timeout=30):
    last_error = ""
    for _ in range(retry_limit):
        try:
            r = requests.get(url, timeout=timeout)
            r.raise_for_status()
            return r.json()
        except Exception as e:
            last_error = str(e)
            time.sleep(10)
    raise RuntimeError(f"Failed after {retry_limit} attempts: {last_error}")
```

> Always set `timeout`. Never let a network call block forever.

---

## 17. OCI Lifecycle Waiter

```python
import oci

def wait_for_state(client, get_fn, resource_id, terminal_states, timeout=3600):
    try:
        return oci.wait_until(
            client,
            get_fn(resource_id),
            evaluate_response=lambda r: r.data["lifecycleState"].lower() in terminal_states,
            max_wait_seconds=timeout,
        )
    except Exception as e:
        raise oci.exceptions.MaximumWaitTimeExceeded(
            f"Resource {resource_id} did not reach {terminal_states}"
        ) from e
```

---

## Cheat Sheet

| Problem                    | Pattern                                             |
| -------------------------- | --------------------------------------------------- |
| Logs everywhere            | `setup_logging()` — one config, two streams         |
| Exception details          | `logger.error(msg, exc_info=True, stack_info=True)` |
| Start/end always logged    | `try / finally` in `execute()`                      |
| Clean user error message   | `@graceful`                                         |
| Retry-aware error codes    | `@failsafe` + `NonRetryableError`                   |
| Log every method call      | `@log_method`                                       |
| Bad inputs at startup      | `Inputs._validate()` — collect all, then raise      |
| `.properties` file         | `configparser` with `[root]` prefix trick           |
| SSH with auto-cleanup      | `SSHHandler` as context manager                     |
| Temp file leaks            | `try / finally` — local always, remote best-effort  |
| OCI API calls              | `get_retry_strategy()` — jitter + time-bounded      |
| Long remote background job | `nohup` launch + `ps` poll loop                     |
| Exit 0 but not ready yet   | `retry_until()` — checks output content             |
| Long orchestration         | `RetryLoop` ABC — exponential backoff + hooks       |
| Hard wall-clock timeout    | `signal.alarm()` — Unix only                        |
| Parallel hosts             | `ProcessPoolExecutor` + `as_completed`              |
| Parallel I/O tasks         | `threading` with error dict                         |
| Local shell commands       | `subprocess.run(check=True, timeout=N)`             |
| HTTP calls                 | `requests.get(url, timeout=30)` + retry loop        |
| OCI resource lifecycle     | `oci.wait_until()` + `MaximumWaitTimeExceeded`      |


[[Design Patterns]] showcases the information related to the design principles needs to be followed while writing clean code.