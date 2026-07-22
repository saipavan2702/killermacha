> [!summary]
> Retry only transient failures, bound every wait, and make completion checks depend on meaningful state.

Map: [[Upskill/ProgramLang/Python/Python|Python]]
Connections: [[Upskill/ProgramLang/Python/Debugging and Monitoring|Debugging and Monitoring]], [[Upskill/ProgramLang/Python/Concurrency and I-O|Concurrency and I-O]]

## OCI Retry Strategy

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

## Poll Until Remote Process Finishes

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

## Semantic Retry (output-aware)

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

## Global Retry with Exponential Backoff

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

## Hard Timeout with `signal.alarm`

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
