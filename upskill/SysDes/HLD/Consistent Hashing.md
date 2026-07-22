> [!summary]
> Consistent hashing limits key movement when nodes join or leave a distributed system.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/Database Sharding|Database Sharding]], [[Upskill/SysDes/HLD/Distributed Systems Papers/Consistent Hashing Paper|Consistent Hashing Paper]]

## The Problem with Simple Hashing

**Simple Approach:**

```python
def get_server(key, num_servers):
    hash_value = hash(key)
    server_index = hash_value % num_servers
    return f"server_{server_index}"

# With 3 servers
get_server("user_1", 3)  # server_0
get_server("user_2", 3)  # server_2
get_server("user_3", 3)  # server_1
```

**Problem: Adding/Removing Servers**

```python
# Originally 3 servers
get_server("user_1", 3)  # server_0

# Now 4 servers (added one)
get_server("user_1", 4)  # server_1 (DIFFERENT!)

# Data needs to move from server_0 to server_1
# This happens for MOST keys!
```

**Result:** Massive data reshuffling when servers change

## Consistent Hashing Solution

**Concept:** Map both servers AND keys to a ring

```python
import hashlib

class ConsistentHashing:
    def __init__(self):
        self.ring = {}  # position -> server
        self.sorted_positions = []

    def _hash(self, key):
        # Returns value in [0, 2^32)
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_server(self, server_id):
        # Add server to ring
        position = self._hash(server_id)
        self.ring[position] = server_id
        self.sorted_positions = sorted(self.ring.keys())
        print(f"Added {server_id} at position {position}")

    def remove_server(self, server_id):
        # Remove server from ring
        position = self._hash(server_id)
        del self.ring[position]
        self.sorted_positions = sorted(self.ring.keys())
        print(f"Removed {server_id} from position {position}")

    def get_server(self, key):
        # Hash the key
        key_position = self._hash(key)

        # Find nearest server clockwise
        for position in self.sorted_positions:
            if position >= key_position:
                return self.ring[position]

        # Wrap around to first server
        return self.ring[self.sorted_positions[0]]

# Example usage
ch = ConsistentHashing()

# Add servers
ch.add_server("server_A")  # Position: 2847563829
ch.add_server("server_B")  # Position: 1928374651
ch.add_server("server_C")  # Position: 3918273645

# Map keys to servers
print(ch.get_server("user_1"))  # server_C
print(ch.get_server("user_2"))  # server_A
print(ch.get_server("user_3"))  # server_B

# Remove a server
ch.remove_server("server_B")

# Only keys on server_B move (to next server clockwise)
print(ch.get_server("user_3"))  # server_C (changed)
# Other keys stay on same servers!
print(ch.get_server("user_1"))  # server_C (unchanged)
print(ch.get_server("user_2"))  # server_A (unchanged)
```

## Visual Representation

```
Ring (0 to 2^32):

    server_A (pos: 500)
        /            \
  key_2             key_4
  (pos: 450)       (pos: 520)
       |                |
       ↓                ↓
   server_C          server_A
   (pos: 900)
        |
      key_1
    (pos: 750)
        ↓
    server_C
```

**Rule:** Key goes to next server clockwise

## Virtual Nodes (Improved Distribution)

**Problem:** Servers may not distribute evenly on ring

```python
class ConsistentHashingWithVirtualNodes:
    def __init__(self, virtual_nodes=150):
        self.virtual_nodes = virtual_nodes
        self.ring = {}
        self.sorted_positions = []

    def _hash(self, key):
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_server(self, server_id):
        # Add multiple virtual nodes for each server
        for i in range(self.virtual_nodes):
            virtual_key = f"{server_id}#{i}"
            position = self._hash(virtual_key)
            self.ring[position] = server_id

        self.sorted_positions = sorted(self.ring.keys())
        print(f"Added {server_id} with {self.virtual_nodes} virtual nodes")

    def remove_server(self, server_id):
        # Remove all virtual nodes
        positions_to_remove = [
            pos for pos, server in self.ring.items()
            if server == server_id
        ]

        for pos in positions_to_remove:
            del self.ring[pos]

        self.sorted_positions = sorted(self.ring.keys())
        print(f"Removed {server_id}")

    def get_server(self, key):
        if not self.ring:
            return None

        key_position = self._hash(key)

        # Binary search for efficiency
        for position in self.sorted_positions:
            if position >= key_position:
                return self.ring[position]

        return self.ring[self.sorted_positions[0]]

# Usage
ch = ConsistentHashingWithVirtualNodes(virtual_nodes=150)

ch.add_server("server_A")
ch.add_server("server_B")
ch.add_server("server_C")

# Much better distribution!
# Each server appears 150 times on ring
# Keys distributed more evenly
```

## Benefits

| Aspect | Simple Hashing | Consistent Hashing |
|--------|----------------|-------------------|
| Keys reshuffled when adding server | ~100% | ~1/N (minimal) |
| Keys reshuffled when removing server | ~100% | ~1/N (minimal) |
| Load distribution | Uneven | Even (with virtual nodes) |

**Used By:**
- Amazon DynamoDB
- Apache Cassandra
- Memcached
- Content Delivery Networks

---
