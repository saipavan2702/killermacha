# Database Scaling

> [!summary]
> Scale databases through indexing, partitioning, replication, multi-primary setups, and sharding based on the actual bottleneck.

Scale **step-by-step** based on your actual needs. Don't over-engineer!

## 1. Indexing

**Problem:** Without indexing, database scans every row (O(N) time)

**Solution:** Create an index on frequently queried columns

```sql
-- Before: Full table scan
SELECT * FROM users WHERE id = 12345;  -- O(N) time

-- Create index
CREATE INDEX idx_user_id ON users(id);

-- After: Uses B-tree for faster lookup
SELECT * FROM users WHERE id = 12345;  -- O(log N) time
```

**How it works:**
- Database creates a B-tree data structure
- IDs stored in sorted order
- Binary search possible → faster lookups

## 2. Partitioning

**Break large table into smaller tables within the SAME server**

```
Before:
users (10M rows)

After:
users_table_1 (3.3M rows)
users_table_2 (3.3M rows)
users_table_3 (3.4M rows)
```

**Benefits:**
- Smaller index files → faster searches
- Each partition has its own index

**Query remains the same:**
```sql
-- PostgreSQL handles routing automatically
SELECT * FROM users WHERE id = 4;
```

## 3. Master-Slave Architecture

**Use when:** Single server can't handle read traffic

```
         Master (Writes)
        /      |      \
   Slave-1  Slave-2  Slave-3
   (Reads)  (Reads)  (Reads)
```

**How it works:**
```python
# All writes go to Master
if operation == "INSERT" or operation == "UPDATE":
    route_to(master_db)
    # Master asynchronously replicates to slaves

# Reads distributed across slaves
if operation == "SELECT":
    route_to(least_busy_slave)
```

**Example:**
```sql
-- Write operation → Master only
INSERT INTO users (name, email) VALUES ('Alice', 'alice@email.com');

-- Read operations → Any slave
SELECT * FROM users WHERE id = 100;  -- Routes to Slave-1
SELECT * FROM users WHERE id = 200;  -- Routes to Slave-2
```

## 4. Multi-Master Setup

**Use when:** Single master can't handle write traffic

```
Master-North-India  ←→  Master-South-India
(Handles writes        (Handles writes
from North)            from South)
```

**Challenge: Conflict Resolution**
```python
# Same ID updated in both masters simultaneously
# North Master: user_id=5 → name="Alice"
# South Master: user_id=5 → name="Bob"

# You must define conflict resolution strategy:
def resolve_conflict(data1, data2):
    # Option 1: Last write wins
    return data1 if data1.timestamp > data2.timestamp else data2
    
    # Option 2: Concatenate
    return data1 + " & " + data2
    
    # Option 3: Accept both as separate records
    return [data1, data2]
```

## 5. Database Sharding

Moved to [[Upskill/SysDes/HLD/Database Sharding|Database Sharding]].

## Database Scaling Rules

1. **Always try vertical scaling first** (easiest)
2. **Read-heavy traffic** → Master-Slave architecture
3. **Write-heavy traffic** → Sharding (data doesn't fit one machine)
4. **Extreme read-heavy** → Sharding + Master-Slave per shard

---
