> [!summary]
> Centralized logging, explicit lifecycle handling, and focused decorators make production scripts easier to operate.

Map: [[Upskill/ProgramLang/Python/Python|Python]]
Connections: [[Upskill/ProgramLang/Python/Language Fundamentals|Language Fundamentals]], [[Upskill/ProgramLang/Python/Configuration and Validation|Configuration and Validation]]

## Logging Setup

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

## Execution Lifecycle

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

## Structured Exception Logging

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

## Decorators

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
