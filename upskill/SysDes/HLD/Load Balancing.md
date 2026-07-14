Map: [[Upskill/SysDes/System Design|System Design]]

Related: [[Upskill/SysDes/HLD/Caching|Caching]] · [[Upskill/SysDes/HLD/Rate Limiting|Rate Limiting]] · [[Upskill/SysDes/HLD/Database Sharding|Database Sharding]] · [[Upskill/SysDes/System Design|System Design]]

## Load Balancers {#load-balancers}

### Why Load Balancers?

**Problem:** Can't give clients multiple server IPs and let them choose

```
❌ Bad approach:
Client: "Which server should I use?"
Client: "Is Server-2 less busy than Server-1?"
```

**Solution:** Load Balancer acts as single entry point

```
        Load Balancer (single IP)
       /        |         \
   Server-1  Server-2  Server-3
```

### Load Balancer Algorithms

#### 1. Round Robin

**Distributes requests sequentially in circular order**

```python
class RoundRobinLoadBalancer:
    def __init__(self, servers):
        self.servers = servers
        self.current = 0

    def get_next_server(self):
        server = self.servers[self.current]
        self.current = (self.current + 1) % len(self.servers)
        return server

# Example usage
lb = RoundRobinLoadBalancer(['Server-1', 'Server-2', 'Server-3'])

print(lb.get_next_server())  # Server-1
print(lb.get_next_server())  # Server-2
print(lb.get_next_server())  # Server-3
print(lb.get_next_server())  # Server-1 (loops back)
```

**Request Flow:**
```
Request 1 → Server-1
Request 2 → Server-2
Request 3 → Server-3
Request 4 → Server-1
Request 5 → Server-2
Request 6 → Server-3
```

**Pros:** Simple, works well for equal capacity servers
**Cons:** Ignores server load and health

#### 2. Weighted Round Robin

**Servers with higher capacity receive more requests**

```python
class WeightedRoundRobinLoadBalancer:
    def __init__(self, servers_with_weights):
        # servers_with_weights = [('Server-1', 1), ('Server-2', 1), ('Server-3', 2)]
        self.servers = []
        for server, weight in servers_with_weights:
            self.servers.extend([server] * weight)
        self.current = 0

    def get_next_server(self):
        server = self.servers[self.current]
        self.current = (self.current + 1) % len(self.servers)
        return server

# Example
lb = WeightedRoundRobinLoadBalancer([
    ('Server-1', 1),  # Gets 1/4 of traffic
    ('Server-2', 1),  # Gets 1/4 of traffic
    ('Server-3', 2)   # Gets 2/4 of traffic (more powerful)
])

# Request distribution:
# Server-3, Server-1, Server-3, Server-2, Server-3, Server-1, Server-3, Server-2...
```

**Pros:** Handles unequal server capacities
**Cons:** Static weights don't reflect real-time performance

#### 3. Least Connections

**Routes to server with fewest active connections**

```python
class LeastConnectionsLoadBalancer:
    def __init__(self, servers):
        self.connections = {server: 0 for server in servers}

    def get_next_server(self):
        # Find server with minimum connections
        server = min(self.connections, key=self.connections.get)
        self.connections[server] += 1
        return server

    def release_connection(self, server):
        self.connections[server] -= 1

# Example
lb = LeastConnectionsLoadBalancer(['Server-1', 'Server-2', 'Server-3'])

# Current state: All servers have 0 connections
lb.get_next_server()  # Server-1 (connections: S1=1, S2=0, S3=0)
lb.get_next_server()  # Server-2 (connections: S1=1, S2=1, S3=0)
lb.get_next_server()  # Server-3 (connections: S1=1, S2=1, S3=1)
lb.release_connection('Server-2')  # (connections: S1=1, S2=0, S3=1)
lb.get_next_server()  # Server-2 (least connections)
```

**Pros:** Balances load dynamically based on real-time activity
**Cons:** Doesn't account for connection duration differences

#### 4. Hash-Based (Consistent Hashing)

**Routes same client to same server (session persistence)**

```python
import hashlib

class HashBasedLoadBalancer:
    def __init__(self, servers):
        self.servers = servers

    def get_next_server(self, client_id):
        # Hash client identifier
        hash_value = int(hashlib.md5(client_id.encode()).hexdigest(), 16)
        server_index = hash_value % len(self.servers)
        return self.servers[server_index]

# Example
lb = HashBasedLoadBalancer(['Server-1', 'Server-2', 'Server-3'])

# Same client always goes to same server
print(lb.get_next_server('user_123'))  # Always Server-2
print(lb.get_next_server('user_123'))  # Always Server-2
print(lb.get_next_server('user_456'))  # Always Server-1
```

**Pros:** Maintains session consistency
**Cons:** Adding/removing servers disrupts hash mapping

---
