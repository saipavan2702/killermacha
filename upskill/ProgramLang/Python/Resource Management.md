Map: [[Upskill/ProgramLang/Python/Python|Python]]


> [!summary]
> Context managers and finally blocks make remote connections and temporary resources clean up reliably.

## SSH Handler (Context Manager)

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

## Temp File Cleanup

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

## Related

- [[Upskill/ProgramLang/Python/Configuration and Validation|Configuration and Validation]]
