> [!summary]
> A map of Python language behavior and practical patterns for reliable scripts and services.

Map: [[Upskill/Learning|Learning]]
Connections: [[Upskill/SysDes/LLD/Design Patterns/Design Patterns|Design Patterns]], [[Upskill/ProgramLang/Golang/Go|Go]], [[Upskill/ProgramLang/Java/Java|Java]]

## Topics

- [[Upskill/ProgramLang/Python/Language Fundamentals|Language Fundamentals]]
- [[Upskill/ProgramLang/Python/Debugging and Monitoring|Debugging and Monitoring]]
- [[Upskill/ProgramLang/Python/Application Structure|Application Structure]]
- [[Upskill/ProgramLang/Python/Configuration and Validation|Configuration and Validation]]
- [[Upskill/ProgramLang/Python/Resource Management|Resource Management]]
- [[Upskill/ProgramLang/Python/Retries and Timeouts|Retries and Timeouts]]
- [[Upskill/ProgramLang/Python/Concurrency and I-O|Concurrency and I/O]]

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



#python
