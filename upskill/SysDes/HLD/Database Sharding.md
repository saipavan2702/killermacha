# Database Sharding

Source: [[Upskill/SysDes/Core#database-scaling|Database Scaling Techniques]]

Related: [[Upskill/SysDes/HLD/Caching|Caching]] · [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]] · [[Upskill/SysDes/Core#Consistent Hashing|Consistent Hashing]] · [[QoL/Refs/SysDes|SysDes Refs]]

### 5. Database Sharding

**Break table into chunks across DIFFERENT servers**

```
       Application Server
      /         |         \
Shard-1      Shard-2     Shard-3
(ID 1-1000) (ID 1001-   (ID 2001-
             2000)       3000)
```

**Sharding Strategies:**

#### Range-Based Sharding
```python
def get_shard(user_id):
    if 1 <= user_id <= 1000:
        return "shard_1"
    elif 1001 <= user_id <= 2000:
        return "shard_2"
    elif 2001 <= user_id <= 3000:
        return "shard_3"
```

**Pros:** Simple
**Cons:** Uneven distribution if data skewed

#### Hash-Based Sharding
```python
def get_shard(user_id):
    shard_number = hash(user_id) % total_shards
    return f"shard_{shard_number}"
```

**Pros:** Even distribution
**Cons:** Rebalancing hard when adding shards

#### Geographic Sharding
```python
def get_shard(user_region):
    if user_region == "North America":
        return "shard_na"
    elif user_region == "Europe":
        return "shard_eu"
    elif user_region == "Asia":
        return "shard_asia"
```

**Pros:** Low latency for regional users
**Cons:** Hotspots if one region has more traffic

### Sharding Disadvantages

1. **Complex Implementation:** You write the routing logic
2. **Cross-Shard Queries:** Expensive to join data across shards
3. **Lost Consistency:** Hard to maintain ACID across shards
