# Python Concurrency and I-O

> [!summary]
> Choose processes for isolated CPU work, threads for I/O, and explicit timeouts for subprocesses and network calls.

## Parallel Execution

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

## subprocess

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

## HTTP Calls

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

## OCI Lifecycle Waiter

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
