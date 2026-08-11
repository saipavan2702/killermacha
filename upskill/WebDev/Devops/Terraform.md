## 1. The Problem: "ClickOps"

Most infrastructure starts small — one VPS, set up by hand. As the app grows, so does the infra:

- A second server
- A load balancer in front of them
- A staging environment
- A database read replica
- New DNS records

If every one of these changes is made by clicking through the cloud provider's web console — **"ClickOps"** — you end up with three problems:

| Problem | What it means |
|---|---|
| **No history** | No record of who changed what, or when |
| **No review** | Changes go live instantly, with no peer review |
| **Environment drift** | Staging and prod silently diverge because a fix gets clicked in one place and forgotten in the other |

The killer scenario: try to rebuild the exact same setup in a new region, and you realize your "infrastructure" is really just the sum of hundreds of forgotten clicks made by different people over time.

---

## 2. The Fix: Infrastructure as Code (Terraform)

Instead of clicking, you **write text files** describing the infrastructure you want. Terraform figures out how to make reality match that description.

**Why this works:** every action in a cloud console is secretly just an API call under the hood. Terraform talks to those same APIs directly — no browser needed.

**The language:** Terraform configs are written in **HCL** (HashiCorp Configuration Language), designed to be readable even for beginners:

```hcl
resource "aws_instance" "web" {
  # resource type + logical name, then its settings
}
```

**What Terraform does vs. doesn't do:**

| Terraform DOES | Terraform does NOT |
|---|---|
| Provision infrastructure (servers, networks, storage, DNS, etc.) | Install software on those servers |
| Talk to cloud provider APIs | Configure your app once the server exists (that's a separate job — Ansible, cloud-init, Docker, etc.) |

Because the config is plain text, all three ClickOps problems disappear:

1. It lives in **Git** → full history of every change
2. Changes go through **Pull Requests** → peer review before anything is deployed
3. The whole environment can be **rebuilt from scratch** any time, in any region

---

## 3. The Core Workflow: Write → Plan → Apply

```
1. WRITE            2. PLAN                      3. APPLY
   (HCL files)   →      (terraform plan)      →      (terraform apply)
   describe what        dry-run diff:                confirm, then Terraform
   you want              create/change/destroy        makes the real API calls
```

1. **Write** — describe the desired infrastructure in `.tf` files.
2. **`terraform plan`** — a dry run. Terraform prints exactly what will be **created**, **changed**, or **destroyed** — nothing happens to the cloud yet.
3. **`terraform apply`** — shows the plan one more time; once you confirm, it executes the real API calls.

> **Side note on alternatives:** Some newer platforms (e.g. Encore) skip the separate config-language step entirely and let you declare infrastructure directly inside your application code (Go/TypeScript), which the platform then parses to provision things like S3 buckets and databases. This is a different philosophy from Terraform's "separate declarative layer" approach — worth knowing exists, not a replacement for understanding Terraform itself.

---

## 4. The State File: How Terraform Knows What's Real

Your config says `resource "aws_instance" "web"`. AWS doesn't know or care about the name `web` — it only knows the resource by a long, opaque, auto-generated ID. Something has to bridge that gap.

That something is the **state file** — a JSON file Terraform maintains that maps every logical name in your code to its real cloud resource ID and attributes (including, notably, any sensitive values — stored in **plain text**, which is why state files need to be protected).

### The Three-Way Comparison

Every `plan` or `apply` compares **three** things, not two:

| Source | What it represents |
|---|---|
| **Desired state** | Your `.tf` config files — what you *want* |
| **Last known state** | The state file — what Terraform *remembers* |
| **Cloud reality** | A live query to the actual cloud API — what *actually exists right now* |

This third leg is what lets Terraform catch someone who manually clicked a change in the console — it doesn't just trust its own memory.

### The Four Possible Actions

From that comparison, each resource gets tagged with one of:

1. **Create**
2. **Update in place**
3. **Destroy**
4. **Destroy and recreate**

The last one is the sneaky one: some cloud attributes are **immutable** — they simply cannot be changed after a resource is created. Change one line of code that touches such an attribute, and Terraform's only option is to delete the resource and build a new one. This can be a nasty surprise (e.g. unexpected downtime) if you don't read the plan output carefully.

---

## 5. Under the Hood: Core vs. Providers

Terraform's architecture is split into two pieces:

### Terraform Core
- The engine you actually run (`terraform` CLI)
- Reads your HCL, maintains the state file, computes the diff
- **Knows nothing about any specific cloud** — it has no built-in concept of "AWS" or "GCP"

### Providers
- Separate binaries (AWS provider, GCP provider, Azure provider, GitHub provider, etc.) downloaded into your project during `terraform init`
- Core launches each provider as a **subprocess** and talks to it over **gRPC**
- The provider is what actually knows how to translate an abstract "create this resource" instruction into a real, vendor-specific HTTP API call
- If your config spans multiple clouds, Core runs multiple provider subprocesses side by side

```
Terraform Core  <--gRPC-->  AWS Provider (subprocess)  --HTTP-->  AWS API
                <--gRPC-->  GCP Provider (subprocess)  --HTTP-->  GCP API
```

Every provider, regardless of vendor, is required to implement the same four operations per resource type: **Create, Read, Update, Delete (CRUD)**. This is why anyone can technically write their own Terraform provider for any API.

### Worked Example: Adding an S3 Bucket

1. You add an `aws_s3_bucket` block to your `.tf` file.
2. `terraform plan` → Core refreshes state, queries AWS live, computes the diff, reports "1 to add."
3. `terraform apply` → Core sends the create instruction to the AWS provider over gRPC.
4. The AWS provider makes the real `CreateBucket` API call.
5. AWS returns the new bucket's ID/attributes, which Core writes back into the state file.

---

## 6. Team Safety: Concurrency & State Locking

**The risk:** two engineers run `terraform apply` at the same moment against the same state file. Both read the same "last known" picture, both compute changes, and one overwrites the other — corrupting the state file, duplicating resources, or breaking production.

**The fix:** move the state file off local machines into a **remote backend** (classically an S3 bucket) and enable **state locking**.

- Engineer A runs `apply` → acquires a lock
- Engineer B runs `apply` at the same time → immediately gets a **lock error** and is blocked
- Engineer A finishes, writes updated state, releases the lock
- Now Engineer B (or anyone else) can proceed against the current, correct state

This guarantees the whole team is always working from one consistent version of reality, never a stale or conflicting one.

---

## Summary Table

| Feature | Manual "ClickOps" | Terraform (IaC) |
|---|---|---|
| Execution | Manual clicks in web console | Declarative code files |
| History | None | Full Git history |
| Review | None — changes go live instantly | Peer-reviewed via Pull Requests |
| Replicability | Nearly impossible to recreate elsewhere | Rebuildable from scratch anytime |
| Safety | High risk of human error / drift | Protected by dry-run plans + state locking |

---

## 2025–2026 Update: DynamoDB Is No Longer Required for S3 Locking

One detail worth knowing if you're learning this today: the classic AWS setup paired an **S3 bucket** (for the state file) with a **DynamoDB table** (purely for locking). As of **Terraform 1.10 (November 2024)**, this changed:

- AWS S3 gained a **conditional writes** feature that lets S3 itself reject a write if a lock file already exists.
- Terraform's S3 backend now supports `use_lockfile = true`, which uses this feature to lock **natively inside S3** — no DynamoDB table needed.
- Terraform 1.11 began deprecating the old `dynamodb_table` argument, signaling that the DynamoDB-based approach is being phased out in favor of the S3-native one.

So the *concept* of state locking taught in the video is still exactly right — but if you're setting up a real AWS backend today, you likely don't need to provision a separate DynamoDB table anymore; a correctly configured S3 bucket can handle locking on its own.

```hcl
terraform {
  backend "s3" {
    bucket       = "my-terraform-state"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true   # S3-native locking — no DynamoDB table required
  }
}
```
