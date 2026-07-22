> [!summary]
> During a network partition, a distributed system must trade between immediate consistency and availability.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/Consistency Models|Consistency Models]]

**CAP stands for:**
- **C**onsistency
- **A**vailability
- **P**artition Tolerance

## The Three Properties

Let's use 3 database nodes (A, B, C) in different locations:

```
     Node A (Mumbai)
          |
     Node B (Delhi)
          |
     Node C (Bangalore)
```

### 1. Consistency
**All nodes have identical data at all times.**

```
Write to Node B → Data replicates to A & C
Read from ANY node → Get the SAME result
```

### 2. Availability
**System continues serving requests even if nodes fail.**

```
Node B crashes → Nodes A & C still serve requests
```

### 3. Partition Tolerance
**System works despite network failures between nodes.**

```
Network partition: B loses connection to A & C
Node B continues functioning independently
```

## The CAP Trade-off

**You can only achieve 2 out of 3 properties simultaneously:**

| Combination | What it means | When to use |
|-------------|---------------|-------------|
| **CP** | Consistency + Partition Tolerance | Banking, payments, financial transactions |
| **AP** | Availability + Partition Tolerance | Social media, product catalogs |
| ~~**CA**~~ | Not practical in distributed systems | Network partitions WILL happen |

## Why not CAP?

**Scenario:** Network partition separates Node B from A & C

**Option 1: Prioritize Availability (AP)**
```
Continue serving requests
B has different data than A & C
Result: INCONSISTENT but AVAILABLE
```

**Option 2: Prioritize Consistency (CP)**
```
Stop serving requests until partition heals
Ensure A, B, C have identical data
Result: CONSISTENT but UNAVAILABLE
```

**Real-World Examples:**

**CP System (Banking):**
```python
# Transfer $100 from Account A to Account B
# System ensures ALL nodes see the updated balance
# or transaction fails entirely
if not all_nodes_agree():
    return "Service temporarily unavailable"
```

**AP System (Social Media):**
```python
# Like count on a post
# Different users might see slightly different counts
# System eventually converges to correct value
show_approximate_like_count()  # Might be off by a few
```

---
