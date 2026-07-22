> [!summary]
> Distributed systems coordinate independent machines to improve scale and resilience despite partial failures.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/Microservices|Microservices]]

## What is a Distributed System?

**Single Machine Limitation:**

```python
# Calculate sum of primes from 0 to 10^100
# This will CRASH on single machine!
def count_primes(start, end):
    count = 0
    for num in range(start, end):
        if is_prime(num):
            count += 1
    return count

# ❌ This crashes
count_primes(0, 10**100)
```

**Distributed Solution:**

```
Split work across 10 machines:
Machine-1: 0 to 10^10
Machine-2: 10^10+1 to 10^20
...
Machine-10: 10^90+1 to 10^100

Combine results from all machines
```

## Leader-Follower Architecture

```
        Leader (Coordinator)
       /    |    |    \
   Worker-1 W-2 W-3 W-4
```

**Leader's Responsibilities:**
1. Divide work among followers
2. Monitor follower health
3. Collect and combine results
4. Return final result to client

**Code Example:**

```python
# Leader Node
class DistributedPrimeCounter:
    def __init__(self, workers):
        self.workers = workers

    def count_primes_distributed(self, start, end):
        # 1. Divide work
        chunk_size = (end - start) // len(self.workers)
        tasks = []

        for i, worker in enumerate(self.workers):
            chunk_start = start + (i * chunk_size)
            chunk_end = chunk_start + chunk_size if i < len(self.workers)-1 else end
            tasks.append({
                'worker': worker,
                'start': chunk_start,
                'end': chunk_end
            })

        # 2. Assign tasks to workers
        results = []
        for task in tasks:
            result = task['worker'].count_primes(task['start'], task['end'])
            results.append(result)

        # 3. Combine results
        total = sum(results)
        return total

# Worker Node
class WorkerNode:
    def count_primes(self, start, end):
        count = 0
        for num in range(start, end):
            if self.is_prime(num):
                count += 1
        return count

    def is_prime(self, n):
        if n < 2:
            return False
        for i in range(2, int(n**0.5) + 1):
            if n % i == 0:
                return False
        return True

# Usage
workers = [WorkerNode(), WorkerNode(), WorkerNode(), WorkerNode()]
leader = DistributedPrimeCounter(workers)
result = leader.count_primes_distributed(0, 1000000)
print(f"Total primes: {result}")
```

## Leader Election

**Two scenarios need leader election:**

1. **System startup:** Choose initial leader
2. **Leader failure:** Promote follower to leader

**Leader Election Algorithms:**

| Algorithm | Time Complexity | Description |
|-----------|----------------|-------------|
| LCR | O(N²) | Simple ring-based |
| HS | O(N log N) | Optimized ring |
| Bully | O(N) | Highest ID wins |
| Gossip | O(log N) | Probabilistic |

**Conceptual Example (Bully Algorithm):**

```python
class Node:
    def __init__(self, node_id, all_nodes):
        self.id = node_id
        self.all_nodes = all_nodes
        self.is_leader = False

    def detect_leader_failure(self):
        # Periodically check leader health
        if not self.ping_leader():
            print(f"Node {self.id}: Leader is down!")
            self.start_election()

    def start_election(self):
        print(f"Node {self.id}: Starting election")

        # Find nodes with higher IDs
        higher_nodes = [n for n in self.all_nodes if n.id > self.id]

        if not higher_nodes:
            # I have highest ID, I become leader
            self.become_leader()
        else:
            # Ask higher nodes to take over
            responses = [n.respond_to_election() for n in higher_nodes]

            if not any(responses):
                # No response from higher nodes, I become leader
                self.become_leader()

    def become_leader(self):
        self.is_leader = True
        print(f"Node {self.id}: I am the new leader!")
        self.announce_leadership()

    def announce_leadership(self):
        for node in self.all_nodes:
            if node.id != self.id:
                node.acknowledge_leader(self.id)
```

## Auto-Recoverable System

**Problem:** Servers crash, who restarts them?

**Solution:** Orchestrator monitors and restarts servers

```
      Leader-Orchestrator
     /        |        \
Worker-Orch  Worker-Orch  Worker-Orch
    |            |            |
  [Servers]   [Servers]   [Servers]
```

**Implementation Concept:**

```python
import time
import requests

class Orchestrator:
    def __init__(self, servers, is_leader=False):
        self.servers = servers
        self.is_leader = is_leader
        self.health_check_interval = 30  # seconds

    def monitor_servers(self):
        while True:
            for server in self.servers:
                if not self.check_health(server):
                    print(f"Server {server.id} is down!")
                    self.restart_server(server)

            time.sleep(self.health_check_interval)

    def check_health(self, server):
        try:
            response = requests.get(f"{server.url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False

    def restart_server(self, server):
        print(f"Restarting server {server.id}...")
        # Execute restart command (e.g., Docker, Kubernetes)
        os.system(f"docker restart {server.container_id}")
        print(f"Server {server.id} restarted successfully")

class LeaderOrchestrator(Orchestrator):
    def __init__(self, worker_orchestrators, servers):
        super().__init__(servers, is_leader=True)
        self.worker_orchestrators = worker_orchestrators

    def monitor_all(self):
        # Monitor worker orchestrators
        threading.Thread(target=self.monitor_workers).start()
        # Monitor servers
        threading.Thread(target=self.monitor_servers).start()

    def monitor_workers(self):
        while True:
            for worker in self.worker_orchestrators:
                if not self.check_health(worker):
                    print(f"Worker orchestrator {worker.id} is down!")
                    self.restart_orchestrator(worker)

            time.sleep(self.health_check_interval)

    def restart_orchestrator(self, worker):
        print(f"Restarting worker orchestrator {worker.id}...")
        os.system(f"docker restart {worker.container_id}")

# Usage
servers = [Server(1), Server(2), Server(3), Server(4)]
worker_orch_1 = Orchestrator(servers[:2])
worker_orch_2 = Orchestrator(servers[2:])
leader_orch = LeaderOrchestrator([worker_orch_1, worker_orch_2], servers)

# If leader crashes, worker promotes itself
def handle_leader_failure():
    if not ping_leader():
        # Start leader election among workers
        elect_new_leader([worker_orch_1, worker_orch_2])
```

**Flow:**

```
Normal Operation:
Leader monitors Workers → Workers monitor Servers

Worker Crashes:
Leader detects → Restarts Worker

Server Crashes:
Worker detects → Restarts Server

Leader Crashes:
Workers detect → Run election → New leader emerges
```

## Real-World Example: Kubernetes

Kubernetes uses this exact pattern:

```yaml
# Kubernetes architecture
Control Plane (Leader):
  - API Server
  - Controller Manager
  - Scheduler
  - etcd (distributed key-value store for leader election)

Worker Nodes (Followers):
  - Kubelet (monitors pods)
  - Container Runtime (Docker/containerd)

# If Control Plane fails:
# - etcd uses Raft consensus for leader election
# - New control plane node becomes leader
# - System continues operating
```

## Foundational Papers

These notes explain the original design decisions, show the mechanism in code, and separate paper-era architecture from modern implementations.

**Placement, storage, and consistency**

- [[Upskill/SysDes/HLD/Distributed Systems Papers/Consistent Hashing Paper|Consistent Hashing Paper]] - stable placement as membership changes, plus random trees for hot objects.
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Amazon Dynamo|Amazon Dynamo]] - availability, sloppy quorums, vector clocks, hints, and anti-entropy.
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Google Bigtable|Google Bigtable]] - sorted row keys, tablets, memtables, SSTables, and compaction.
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Apache Cassandra|Apache Cassandra]] - Dynamo-style distribution combined with Bigtable-style storage.

**Membership and coordination**

- [[Upskill/SysDes/HLD/Distributed Systems Papers/Gossip and Failure Detection|Gossip and Failure Detection]] - gossip families and SWIM-style probing, suspicion, and dissemination.
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Google Chubby|Google Chubby]] - coarse locks, sessions, leases, cache invalidation, and fencing tokens.
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Apache ZooKeeper|Apache ZooKeeper]] - znodes, ordered updates, watches, and coordination recipes.

**Logs and batch data**

- [[Upskill/SysDes/HLD/Distributed Systems Papers/Apache Kafka Architecture|Apache Kafka Architecture]] - partitioned logs, consumer offsets, retention, and replay.
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Hadoop Distributed File System|Hadoop Distributed File System]] - NameNode metadata, replicated blocks, and streaming pipelines.
- [[Upskill/SysDes/HLD/Distributed Systems Papers/Google MapReduce|Google MapReduce]] - map, shuffle, reduce, retries, locality, and straggler handling.

---
