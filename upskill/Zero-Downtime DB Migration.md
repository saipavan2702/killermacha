# Zero-Downtime Column Migration

## The problem

Rolling deploys run old code (V1) and new code (V2) against the same database simultaneously.

- Rename the column first → V1 queries the old name → 500.
- Deploy new code first → V2 queries a column that doesn't exist yet → 500.

Fix: never make one atomic switch. Move schema and app through overlapping steps where both versions stay compatible with the database at all times.

---

## Pattern 1: Expand-Contract

**Rule:** expand = only add. contract = only remove, and only once nothing depends on the old thing.

### Step 1 — Expand the schema

```sql
ALTER TABLE users ADD COLUMN email_address VARCHAR(255) DEFAULT NULL;
```

Nullable, no default, no index. Indexing a half-empty column wastes work and can lock writes.

### Step 2 — Dual write, read old (V1.5)

```python
def update_user_email(user_id, new_email):
    db.execute(
        "UPDATE users SET email = %s, email_address = %s WHERE id = %s",
        (new_email, new_email, user_id)
    )

def get_user_email(user_id):
    row = db.query("SELECT email FROM users WHERE id = %s", (user_id,))
    return row['email']
```

Every write updates both columns. Reads still hit the old one. This keeps live rows in sync without a separate copy job.

### Step 3 — Backfill

```sql
UPDATE users
SET email_address = email
WHERE email_address IS NULL
LIMIT 1000;
```

Run repeatedly until it updates 0 rows. `WHERE email_address IS NULL` makes it idempotent — safe to rerun after a crash. `LIMIT 1000` avoids locking the whole table.

### Step 4 — Read new, still dual write (V2)

```python
def update_user_email(user_id, new_email):
    db.execute(
        "UPDATE users SET email = %s, email_address = %s WHERE id = %s",
        (new_email, new_email, user_id)
    )

def get_user_email(user_id):
    row = db.query("SELECT email_address FROM users WHERE id = %s", (user_id,))
    return row['email_address']
```

Reads flip to the new column — but only after backfill finishes, or un-migrated rows return `NULL`. Dual write stays on: it's your rollback path. If V2 has a bug, V1 comes back up and still finds fresh data in `email`.

### Step 5 — Verify

Check no cron job, BI tool, stored procedure, or trigger still reads `email`. No code — just an audit before you commit to deleting anything.

### Step 6 — Contract the app (V3)

```python
def update_user_email(user_id, new_email):
    db.execute(
        "UPDATE users SET email_address = %s WHERE id = %s",
        (new_email, user_id)
    )

def get_user_email(user_id):
    row = db.query("SELECT email_address FROM users WHERE id = %s", (user_id,))
    return row['email_address']
```

### Step 7 — Contract the schema

```sql
ALTER TABLE users DROP COLUMN email;
```

**Mental model:** add before you use it → use before you stop writing the old one → stop writing before you delete it.

---

## Pattern 2: Trigger-based sync

Instead of updating app code to dual-write, let the database keep both columns in sync via a trigger. Useful when you can't touch application code yet, or want sync enforced at the DB layer regardless of which service writes.

```sql
-- Keep email_address in sync whenever email is written
CREATE OR REPLACE FUNCTION sync_email_address()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_address := NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sync_email_address
BEFORE INSERT OR UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION sync_email_address();
```

Backfill still runs the same batched `UPDATE` as above. Once the app is fully cut over to `email_address` and verified, drop the trigger before dropping the column — an orphaned trigger writing to a dropped column will break every insert.

```sql
DROP TRIGGER trg_sync_email_address ON users;
```

**Trade-off:** simple to bolt on, but sync logic now lives outside version control alongside app code, and every write pays a small trigger overhead.

---

## Pattern 3: View-based abstraction

Freeze the table's public interface behind a view so the underlying schema can change without every consumer needing simultaneous updates.

```sql
-- Physical table already renamed
ALTER TABLE users RENAME COLUMN email TO email_address;

-- Old consumers keep working against the original shape
CREATE VIEW users_v1 AS
SELECT id, email_address AS email, created_at
FROM users;
```

Old code queries `users_v1` and sees `email` exactly as before. New code queries `users` directly and sees `email_address`. Once every consumer of `users_v1` has migrated, drop the view.

```sql
DROP VIEW users_v1;
```

**Trade-off:** great for decoupling many independent consumers from a schema change, but views add a layer of indirection — writes through a view have restrictions, and query planners don't always optimize through them as well as a direct table.

---

## Pattern 4: Online schema-change tools

For large tables, even a "safe" `ALTER TABLE ADD COLUMN` can hold a lock long enough to hurt. Tools like `gh-ost` (GitHub) and `pt-online-schema-change` (Percona) migrate without blocking reads/writes:

1. Create a shadow copy of the table with the new schema.
2. Copy existing rows into the shadow table in batches.
3. Stream ongoing writes into the shadow table (via binlog for `gh-ost`, via triggers for `pt-online-schema-change`) so it stays current.
4. Atomically rename the shadow table into place.

```bash
# gh-ost: add a column with no locking
gh-ost \
  --host=db.internal \
  --database=mydb \
  --table=users \
  --alter="ADD COLUMN email_address VARCHAR(255) DEFAULT NULL" \
  --execute
```

```bash
# pt-online-schema-change equivalent
pt-online-schema-change \
  --alter "ADD COLUMN email_address VARCHAR(255) DEFAULT NULL" \
  D=mydb,t=users \
  --execute
```

**Trade-off:** removes locking from the schema change itself, but this only replaces steps 1 and 7 of expand-contract — you still need the app-level dual write / backfill / cutover phases around it for a rename or data migration, not just a structural change.

---

## Choosing between them

| Situation | Use |
|---|---|
| Standard rename/migration, you control app deploys | Expand-contract |
| Can't touch app code, or many uncoordinated writers | Trigger-based sync |
| Many independent consumers, want to shield them from the change | View-based abstraction |
| Table is huge and even `ALTER TABLE` risks locking | Online schema-change tool, alongside expand-contract |

All four are the same idea underneath: keep two schema versions readable and writable at once, and only collapse to one once every consumer has moved.