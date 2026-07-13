# Python Configuration and Validation

> [!summary]
> Validate inputs at the boundary and parse configuration into a predictable internal shape.

## Input Validation

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

## `.properties` File Parsing

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
