> [!summary]
> Consistency models define when distributed replicas must agree and which trade-offs are acceptable while they converge.

Map: [[Upskill/SysDes/System Design|System Design]]

## Strong Consistency

**Definition:** All reads return the most recent write, immediately.

**Example: Banking System**

```python
# Node A, B, C (replicated databases)

# User transfers $100
# Write happens on Node A
account_balance = 1000
account_balance -= 100  # Now 900

# BEFORE acknowledging to client:
# Must replicate to ALL nodes synchronously
replicate_to_node_B(account_balance)  # Wait for ACK
replicate_to_node_C(account_balance)  # Wait for ACK

# Only then acknowledge
return "Transfer successful"

# Any subsequent read from ANY node returns 900
read_from_node_A()  # 900
read_from_node_B()  # 900
read_from_node_C()  # 900
```

## Eventual Consistency

**Definition:** Reads may return stale data temporarily, but eventually all nodes converge.

**Example: Social Media Likes**

```python
# Node A, B, C

# User likes a post (write to Node A)
like_count = 100
like_count += 1  # Now 101

# Immediately acknowledge (don't wait for replication)
return "Like successful"

# Asynchronously replicate to other nodes
async_replicate_to_node_B(like_count)
async_replicate_to_node_C(like_count)

# Different users may see different counts temporarily
read_from_node_A()  # 101 (latest)
read_from_node_B()  # 100 (stale, not replicated yet)
read_from_node_C()  # 100 (stale)

# After a few seconds, all nodes have 101
# System is "eventually consistent"
```

## Achieving Strong Consistency

### 1. Synchronous Replication

```python
class StrongConsistentDatabase:
    def __init__(self, nodes):
        self.master = nodes[0]
        self.replicas = nodes[1:]

    def write(self, key, value):
        # Write to master
        self.master.write(key, value)

        # Wait for ALL replicas to acknowledge
        acks = []
        for replica in self.replicas:
            ack = replica.write(key, value)  # Blocking call
            acks.append(ack)

        # Only return success if ALL replicas acknowledged
        if all(acks):
            return {"status": "success", "consistency": "strong"}
        else:
            # Rollback if any replica failed
            self.master.rollback(key)
            return {"status": "failed"}

    def read(self, key):
        # Can read from any node, guaranteed to be latest
        return self.master.read(key)
```

**Trade-off:** Higher latency (wait for all replicas)

### 2. Quorum-Based (W + R > N)

```python
class QuorumDatabase:
    def __init__(self, nodes):
        self.nodes = nodes
        self.N = len(nodes)  # Total nodes
        self.W = 3  # Write quorum
        self.R = 2  # Read quorum
        # W + R > N ensures strong consistency
        # 3 + 2 > 4 ✓

    def write(self, key, value):
        # Write to W nodes (not all)
        acks = 0
        for node in self.nodes:
            try:
                node.write(key, value)
                acks += 1
                if acks >= self.W:
                    break
            except:
                continue

        if acks >= self.W:
            return {"status": "success"}
        else:
            return {"status": "failed", "error": "Quorum not met"}

    def read(self, key):
        # Read from R nodes
        values = []
        for node in self.nodes[:self.R]:
            value = node.read(key)
            values.append(value)

        # Return most recent value (highest timestamp)
        return max(values, key=lambda v: v['timestamp'])
```

**Why W + R > N guarantees consistency?**

```
N = 5 nodes
W = 3 (write to 3 nodes)
R = 3 (read from 3 nodes)

Write goes to: Node-1, Node-2, Node-3
Read comes from: Node-2, Node-4, Node-5

At least one node (Node-2) is in both sets!
So read will get the latest write.
```

### 3. Consensus Algorithms (Raft)

**Simplified Raft Visualization:**

```python
class RaftNode:
    def __init__(self, node_id, all_nodes):
        self.id = node_id
        self.state = 'follower'  # follower, candidate, or leader
        self.current_term = 0
        self.voted_for = None
        self.log = []
        self.all_nodes = all_nodes

    def request_vote(self):
        # Candidate asks for votes
        self.state = 'candidate'
        self.current_term += 1
        self.voted_for = self.id

        votes = 1  # Vote for self
        for node in self.all_nodes:
            if node.vote(self.current_term, self.id):
                votes += 1

        # Need majority to become leader
        if votes > len(self.all_nodes) / 2:
            self.state = 'leader'
            print(f"Node {self.id} became leader")

    def append_entry(self, entry):
        # Leader replicates to followers
        if self.state != 'leader':
            return False

        self.log.append(entry)

        # Replicate to majority of followers
        acks = 1  # Leader counts as ack
        for node in self.all_nodes:
            if node.replicate_log_entry(entry):
                acks += 1

        # Commit only if majority acknowledged
        if acks > len(self.all_nodes) / 2:
            self.commit_entry(entry)
            return True
        else:
            self.log.remove(entry)  # Rollback
            return False
```

## Achieving Eventual Consistency

### 1. Asynchronous Replication

```python
class EventuallyConsistentDatabase:
    def __init__(self, nodes):
        self.master = nodes[0]
        self.replicas = nodes[1:]

    def write(self, key, value):
        # Write to master immediately
        self.master.write(key, value)

        # Return success immediately
        response = {"status": "success", "consistency": "eventual"}

        # Asynchronously replicate to replicas (don't wait)
        for replica in self.replicas:
            threading.Thread(
                target=replica.write,
                args=(key, value)
            ).start()

        return response

    def read(self, key):
        # May return stale data if replica not yet updated
        node = random.choice(self.replicas)
        return node.read(key)
```

**Trade-off:** Lower latency, temporary inconsistency

### 2. Gossip Protocol

```python
class GossipNode:
    def __init__(self, node_id, all_nodes):
        self.id = node_id
        self.data = {}
        self.all_nodes = all_nodes
        self.version_vector = {node.id: 0 for node in all_nodes}

    def write(self, key, value):
        # Write locally
        self.data[key] = {
            'value': value,
            'version': self.version_vector[self.id] + 1,
            'timestamp': time.time()
        }
        self.version_vector[self.id] += 1

    def gossip(self):
        # Periodically share data with random nodes
        while True:
            # Pick random subset of nodes
            peers = random.sample(self.all_nodes, k=3)

            for peer in peers:
                # Exchange data
                peer_data = peer.get_data()

                # Merge data (keep newer versions)
                for key, value in peer_data.items():
                    if key not in self.data:
                        self.data[key] = value
                    elif value['version'] > self.data[key]['version']:
                        self.data[key] = value

            time.sleep(1)  # Gossip every second
```

**How Gossip Spreads Data:**

```
Time 0: Node-A has update
Time 1: Node-A tells Node-B, Node-C
Time 2: Node-B tells Node-D, Node-E
Time 3: Node-C tells Node-F, Node-G
...
After log(N) rounds, all nodes have update
```

### 3. Conflict Resolution (Last Write Wins)

```python
class ConflictResolution:
    def resolve_conflict(self, value1, value2):
        # Strategy 1: Last Write Wins (LWW)
        if value1['timestamp'] > value2['timestamp']:
            return value1
        else:
            return value2

    def resolve_multi_master_conflict(self, master1_value, master2_value):
        # Same key updated in both masters

        # Strategy 1: Last Write Wins
        return self.resolve_conflict(master1_value, master2_value)

        # Strategy 2: Custom business logic
        if self.is_critical_data:
            # Keep both, manual reconciliation
            return {
                'value': [master1_value, master2_value],
                'status': 'conflict',
                'requires_manual_resolution': True
            }

        # Strategy 3: Merge values
        if self.can_merge:
            return {
                'value': f"{master1_value} & {master2_value}",
                'status': 'merged'
            }
```

## Real-World Examples

**Strong Consistency (Google Spanner):**

```sql
-- Financial transaction
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 'user_A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'user_B';

-- Spanner ensures ALL replicas (across continents!) see this change
-- before committing. Uses atomic clocks for global ordering.

COMMIT;
```

**Eventual Consistency (Amazon DynamoDB):**

```python
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

# Write
table.put_item(Item={'user_id': '123', 'name': 'Alice'})
# Returns immediately, replicates asynchronously

# Read (may get stale data)
response = table.get_item(Key={'user_id': '123'})
# Might not see 'Alice' immediately if reading from replica

# Eventually (within seconds), all replicas have 'Alice'
```

---

## Related

- [[Upskill/SysDes/HLD/CAP Theorem|CAP Theorem]]
- [[Upskill/SysDes/HLD/Replication and Recovery|Replication and Recovery]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Amazon Dynamo|Amazon Dynamo]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Apache Cassandra|Apache Cassandra]]
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Apache ZooKeeper|Apache ZooKeeper]]
