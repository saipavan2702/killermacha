## Table of Contents
1. [Why Study System Design?](#why-study-system-design)
2. [Fundamentals: Servers, Latency & Throughput](#fundamentals)
3. [Scaling Strategies](#scaling-strategies)
4. [CAP Theorem](#cap-theorem)
5. [Database Scaling Techniques](#database-scaling)
6. [SQL vs NoSQL](#sql-vs-nosql)
7. [Microservices Architecture](#microservices)
8. [Load Balancers](#load-balancers)
9. [Caching with Redis](#caching)
10. [Blob Storage & CDN](#blob-storage-cdn)
11. [Message Brokers & Kafka](#message-brokers)
12. [Event-Driven Architecture](#event-driven-architecture)
13. [Distributed Systems](#distributed-systems)
14. [Consistency Models](#consistency)
15. [Proxy Servers](#proxy-servers)

---

## Why Study System Design? {#why-study-system-design}

Most college projects work fine with a simple architecture:

```
Client → Backend Server → Database
```

But in the real world with millions or billions of users, this breaks down. You need to consider:
- **Scaling** (handling massive traffic)
- **Fault tolerance** (staying up when things fail)
- **Security** (protecting user data)
- **Performance** (fast response times)
- **Monitoring** (knowing what's happening)

**System Design teaches you how to build systems that work at scale.**

---

## Fundamentals: Servers, Latency & Throughput {#fundamentals}

### What is a Server?

A server is just a physical machine running your application code. When you develop locally:
- Your app runs on `http://localhost:8080`
- `localhost` resolves to `127.0.0.1` (your laptop's IP)

For production websites like `https://abc.com`:

1. **DNS Resolution**: `abc.com` → DNS resolver → finds IP address (e.g., `35.154.33.64`)
2. **Request Routing**: Browser requests `35.154.33.64:443` (port 443 for HTTPS)
3. **Application Processing**: Server finds the correct app by port number and responds

```
https://abc.com = 35.154.33.64:443
```

**Deployment** means copying your application code to a cloud provider's virtual machine (like AWS EC2) that has a public IP address.

### Latency vs Throughput

| Metric | Definition | Measurement | Goal |
|--------|------------|-------------|------|
| **Latency** | Time for ONE request to complete | Milliseconds (ms) | Lower is better |
| **Throughput** | Number of requests handled per second | RPS (Requests Per Second) | Higher is better |

**Real-World Example:**
- **Latency**: Time for one car to travel from A to B (10 minutes)
- **Throughput**: Number of cars on highway per hour (1,000 cars)

**Ideal System**: Low latency + High throughput

---

## Scaling Strategies {#scaling-strategies}

### 1. Vertical Scaling (Scale Up/Down)

**Increase specs of the SAME machine** (more RAM, CPU, storage)

```
Before: 4GB RAM, 2 CPU cores
After:  16GB RAM, 8 CPU cores
```

**Use Cases:**
- SQL databases (easier to maintain ACID properties)
- Stateful applications

**Limitation:** You hit a ceiling - can't infinitely increase hardware specs.

### 2. Horizontal Scaling (Scale Out/In)

**Add MORE machines** and distribute the load

```
Before: 1 server handling all traffic
After:  3 servers sharing the load via Load Balancer
```

**Architecture:**

```
        Load Balancer
       /      |      \
   Server-1  Server-2  Server-3
```

**How it works:**
- All clients hit the Load Balancer
- Load Balancer routes to the least busy server
- Servers don't communicate directly with clients

### 3. Auto Scaling

**Dynamically adjust server count based on traffic**

**Scenario:**
- 1 EC2 instance handles 1,000 users
- Low traffic day: 10,000 users → need 10 instances
- High traffic day: 100,000 users → need 100 instances

**Problem with manual scaling:**
- Running 100 instances 24/7 wastes money during low traffic
- Manually adding/removing servers is tedious

**Auto Scaling Solution:**
```
IF CPU usage > 90%:
    Launch new instance
    Distribute traffic
    
IF CPU usage < 20%:
    Terminate instance
    Consolidate traffic
```

---

## Back-of-the-Envelope Estimation

Quick approximations for system requirements. **Don't spend more than 5 minutes on this in interviews.**

### Memory Conversion Table (MUST MEMORIZE)

| Power of 2 | Approximate Value | Power of 10 | Name | Short |
|------------|-------------------|-------------|------|-------|
| 10 | 1 Thousand | 3 | Kilobyte | KB |
| 20 | 1 Million | 6 | Megabyte | MB |
| 30 | 1 Billion | 9 | Gigabyte | GB |
| 40 | 1 Trillion | 12 | Terabyte | TB |
| 50 | 1 Quadrillion | 15 | Petabyte | PB |

### Example: Twitter Estimation

**Given:**
- 100 million Daily Active Users (DAU)
- 10 tweets per user per day
- 1 user reads 1,000 tweets per day

#### 1. Load Estimation

**Writes (Tweet creation):**
```
100M users × 10 tweets = 1 billion tweets/day
```

**Reads (Tweet viewing):**
```
100M users × 1,000 tweets = 100 billion reads/day
```

#### 2. Storage Estimation

**Assumptions:**
- 10% of tweets have photos
- 1 tweet = 200 characters × 2 bytes = 400 bytes ≈ 500 bytes
- 1 photo = 2 MB

**Tweets with photos:**
```
10% of 1 billion = 100 million tweets with photos
```

**Daily storage:**
```
Text:   500 bytes × 1 billion = 500 GB ≈ 1 TB
Photos: 2 MB × 100 million = 200 TB ≈ 1 PB

Total: ~1 PB/day (ignoring 1TB as negligible)
```

#### 3. Resource Estimation

**Assumptions:**
- 10,000 requests/second
- Each request takes 10ms CPU time

**CPU time needed:**
```
10,000 rps × 10ms = 100,000 ms/second of CPU time
```

**CPU cores required:**
```
Each core handles 1,000 ms/second
Total cores needed: 100,000 ÷ 1,000 = 100 cores
```

**Servers needed:**
```
Each server has 4 cores
Total servers: 100 ÷ 4 = 25 servers
```

---

## CAP Theorem {#cap-theorem}

**CAP stands for:**
- **C**onsistency
- **A**vailability
- **P**artition Tolerance

### The Three Properties

Let's use 3 database nodes (A, B, C) in different locations:

```
     Node A (Mumbai)
          |
     Node B (Delhi)
          |
     Node C (Bangalore)
```

#### 1. Consistency
**All nodes have identical data at all times.**

```
Write to Node B → Data replicates to A & C
Read from ANY node → Get the SAME result
```

#### 2. Availability
**System continues serving requests even if nodes fail.**

```
Node B crashes → Nodes A & C still serve requests
```

#### 3. Partition Tolerance
**System works despite network failures between nodes.**

```
Network partition: B loses connection to A & C
Node B continues functioning independently
```

### The CAP Trade-off

**You can only achieve 2 out of 3 properties simultaneously:**

| Combination | What it means | When to use |
|-------------|---------------|-------------|
| **CP** | Consistency + Partition Tolerance | Banking, payments, financial transactions |
| **AP** | Availability + Partition Tolerance | Social media, product catalogs |
| ~~**CA**~~ | Not practical in distributed systems | Network partitions WILL happen |

### Why not CAP?

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

## Database Scaling Techniques {#database-scaling}

Scale **step-by-step** based on your actual needs. Don't over-engineer!

### 1. Indexing

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

### 2. Partitioning

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

### 3. Master-Slave Architecture

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

### 4. Multi-Master Setup

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

### Database Scaling Rules

1. **Always try vertical scaling first** (easiest)
2. **Read-heavy traffic** → Master-Slave architecture
3. **Write-heavy traffic** → Sharding (data doesn't fit one machine)
4. **Extreme read-heavy** → Sharding + Master-Slave per shard

---

## SQL vs NoSQL {#sql-vs-nosql}

### SQL Databases

**Structure:** Tables with predefined schema

```sql
-- Schema MUST be defined first
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP
);

-- Then insert data
INSERT INTO users VALUES (1, 'Alice', 'alice@email.com', NOW());
```

**Properties:**
- ✅ ACID compliance (data integrity)
- ✅ Strong consistency
- ✅ Complex queries with JOINs
- ❌ Primarily vertical scaling

**Examples:** MySQL, PostgreSQL, Oracle, SQL Server

### NoSQL Databases

**Four Types:**

#### 1. Document-Based (MongoDB)
```javascript
// Flexible schema - add fields anytime
db.users.insertOne({
    id: 1,
    name: "Alice",
    email: "alice@email.com",
    // Can add new field not in "schema"
    preferences: { theme: "dark", language: "en" }
});
```

#### 2. Key-Value (Redis, DynamoDB)
```python
# Simple key-value pairs
cache.set("user:1", {"name": "Alice", "email": "alice@email.com"})
cache.get("user:1")  # Returns the object
```

#### 3. Column-Family (Cassandra)
```
Row Key: user_1
Columns: name="Alice", email="alice@email.com", age=30
```

#### 4. Graph (Neo4j)
```cypher
// Perfect for relationships
CREATE (alice:Person {name: 'Alice'})
CREATE (bob:Person {name: 'Bob'})
CREATE (alice)-[:FRIENDS_WITH]->(bob)
```

**Properties:**
- ✅ Flexible schema
- ✅ Horizontal scaling (sharding)
- ✅ High availability
- ❌ Eventual consistency (usually)
- ❌ Limited JOIN support

### When to Use Which?

| Use Case | Database Type | Example |
|----------|---------------|---------|
| Structured data with fixed schema | SQL | Customer accounts, invoices |
| Unstructured/flexible data | NoSQL | Product reviews, recommendations |
| Data integrity critical | SQL | Banking transactions, payments |
| High availability & scalability | NoSQL | Social media posts, real-time data |
| Complex queries & analytics | SQL | Business reports, data warehousing |
| Large data volumes (petabytes) | NoSQL | IoT sensor data, logs |

**Real E-commerce Example:**

```python
# SQL for critical data
customer_accounts → PostgreSQL
orders → PostgreSQL
payments → PostgreSQL

# NoSQL for flexible/high-volume data
product_reviews → MongoDB
product_recommendations → MongoDB
user_sessions → Redis
real_time_inventory_tracking → Cassandra
```

---

## Microservices Architecture {#microservices}

### Monolith vs Microservices

**Monolith:** Entire app in one codebase

```
One Backend Application
├── User Management
├── Product Catalog
├── Order Processing
└── Payment System
```

**Microservices:** Break into independent services

```
User Service (NodeJS)    → Deployed on Server-1
Product Service (Python) → Deployed on Server-2
Order Service (Go)       → Deployed on Server-3
Payment Service (Java)   → Deployed on Server-4
```

### Why Microservices?

**1. Independent Scaling**
```
Product Service has 10x traffic → Scale only that service
User Service has low traffic → Keep 1 instance
```

**2. Technology Flexibility**
```python
# Each team chooses their tech stack
user_service = "NodeJS"
product_service = "Python FastAPI"
order_service = "Go"
payment_service = "Java Spring Boot"
```

**3. Fault Isolation**
```
Order Service crashes → User & Product services still work
```

### API Gateway Pattern

**Problem:** Clients can't track multiple service URLs

```
Client needs to know:
- User Service: http://192.168.1.10:3000
- Product Service: http://192.168.1.20:4000
- Order Service: http://192.168.1.30:5000
```

**Solution:** Single entry point via API Gateway

```
Client → API Gateway (api.myapp.com)
               ↓
     Routes based on path:
     /user/* → User Service
     /product/* → Product Service
     /order/* → Order Service
```

**API Gateway Implementation:**

```javascript
// Node.js API Gateway example
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Route to User Service
app.use('/user', createProxyMiddleware({
    target: 'http://user-service:3000',
    changeOrigin: true
}));

// Route to Product Service
app.use('/product', createProxyMiddleware({
    target: 'http://product-service:4000',
    changeOrigin: true
}));

// Route to Order Service
app.use('/order', createProxyMiddleware({
    target: 'http://order-service:5000',
    changeOrigin: true
}));

app.listen(8080, () => {
    console.log('API Gateway running on port 8080');
});
```

**Additional API Gateway Features:**
- Rate limiting
- Authentication & authorization
- Request/response caching
- Logging & monitoring

### When to Use Microservices?

**Microservices = Team Structure**
```
3 teams working on 3 features → 3 microservices
Team grows → More microservices
```

**Start with Monolith:**
- 2-3 developers → Monolith is simpler
- As team grows → Split into microservices

**Choose Microservices when:**
- Multiple teams working independently
- Need to scale different components separately
- Want to avoid single point of failure

---

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

## Caching with Redis {#caching}

### What is Caching?

**Store frequently accessed data in fast storage layer**

**Without Caching:**
```
Client Request → Backend (100ms) → Database (500ms) → Response
Total: 600ms
```

**With Caching:**
```
Client Request → Backend → Redis (10ms) → Response
Total: 110ms (if cache hit)
```

### Benefits of Caching

- ⚡ **Improved Performance:** Reduced latency
- 💰 **Cost Efficiency:** Less database load = lower costs
- 📈 **Scalability:** Handle more requests with same resources
- 🔋 **Reduced Backend Load:** Database does less work

### Cache Types

| Type | Location | Use Case | Example |
|------|----------|----------|---------|
| **Client-Side** | User's browser | Static assets | HTML, CSS, JS files |
| **Server-Side** | Application server | Query results | Redis, Memcached |
| **CDN** | Edge servers globally | Static content | Images, videos |
| **Application-Level** | Within app code | Computed results | In-memory cache |

### Redis Deep Dive

**Redis = In-Memory Data Store**

**Why Redis is fast:**
- Data stored in RAM (not disk)
- RAM access: ~100 nanoseconds
- Disk access: ~10 milliseconds
- **Redis is ~100,000x faster!**

**Why not use only Redis?**
- RAM is expensive and limited
- Risk of data loss on crash (unless configured for persistence)

### Redis Data Types

#### 1. String

```bash
# Set a key-value pair
SET user:1:name "Alice"

# Get value
GET user:1:name
# Returns: "Alice"

# Set only if key doesn't exist
SET user:2:email "bob@email.com" NX

# Get multiple values
MGET user:1:name user:2:email
# Returns: ["Alice", "bob@email.com"]

# Set with expiry (TTL)
SETEX user:3:session 3600 "session_token_xyz"
# Expires after 3600 seconds (1 hour)
```

#### 2. List

```bash
# Add to left
LPUSH queue:emails "email1@example.com"
LPUSH queue:emails "email2@example.com"

# Add to right
RPUSH queue:emails "email3@example.com"

# Get length
LLEN queue:emails
# Returns: 3

# Pop from left (FIFO queue)
LPOP queue:emails
# Returns: "email2@example.com"

# Pop from right
RPOP queue:emails
# Returns: "email3@example.com"
```

**Queue Implementation:**
```bash
# Enqueue: LPUSH
# Dequeue: RPOP
# Result: First In, First Out (FIFO)
```

**Stack Implementation:**
```bash
# Push: LPUSH
# Pop: LPOP
# Result: Last In, First Out (LIFO)
```

#### 3. Hash

```bash
# Set multiple fields for a user
HSET user:1 name "Alice" email "alice@email.com" age 30

# Get specific field
HGET user:1 name
# Returns: "Alice"

# Get all fields
HGETALL user:1
# Returns: {name: "Alice", email: "alice@email.com", age: 30}

# Increment numeric field
HINCRBY user:1 age 1
# age is now 31
```

#### 4. Set

```bash
# Add members to set
SADD tags:post:1 "technology" "programming" "tutorial"

# Check if member exists
SISMEMBER tags:post:1 "technology"
# Returns: 1 (true)

# Get all members
SMEMBERS tags:post:1
# Returns: ["technology", "programming", "tutorial"]

# Set operations
SADD tags:post:2 "technology" "ai" "machinelearning"
SINTER tags:post:1 tags:post:2
# Returns: ["technology"] (intersection)
```

#### 5. Sorted Set

```bash
# Add members with scores (leaderboard)
ZADD leaderboard 100 "Alice"
ZADD leaderboard 200 "Bob"
ZADD leaderboard 150 "Charlie"

# Get top 3 (highest scores)
ZREVRANGE leaderboard 0 2 WITHSCORES
# Returns: ["Bob", 200, "Charlie", 150, "Alice", 100]

# Get rank of member
ZRANK leaderboard "Alice"
# Returns: 0 (lowest rank)
```

### Practical Caching Example: Blog API

```javascript
const express = require('express');
const Redis = require('ioredis');
const app = express();

// Initialize Redis client
const redis = new Redis({
    host: 'localhost',
    port: 6379
});

// Simulated database call
async function getBlogsFromDB() {
    // Simulate 800ms database query
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        { id: 1, title: 'First Blog', content: 'Content 1' },
        { id: 2, title: 'Second Blog', content: 'Content 2' }
    ];
}

// Cache middleware
async function cacheMiddleware(req, res, next) {
    const cacheKey = `blogs:all`;
    
    try {
        // Try to get from cache
        const cachedData = await redis.get(cacheKey);
        
        if (cachedData) {
            console.log('✅ Cache HIT');
            return res.json({
                source: 'cache',
                data: JSON.parse(cachedData),
                responseTime: '20ms'
            });
        }
        
        console.log('❌ Cache MISS');
        next(); // Proceed to route handler
    } catch (error) {
        console.error('Redis error:', error);
        next();
    }
}

// GET /blogs route
app.get('/blogs', cacheMiddleware, async (req, res) => {
    const blogs = await getBlogsFromDB();
    
    // Store in cache with 24-hour expiry
    await redis.setex('blogs:all', 86400, JSON.stringify(blogs));
    
    res.json({
        source: 'database',
        data: blogs,
        responseTime: '800ms'
    });
});

// POST /blogs - Invalidate cache on new blog
app.post('/blogs', async (req, res) => {
    // Add blog to database (simulated)
    const newBlog = { id: 3, title: 'New Blog', content: 'New content' };
    
    // Invalidate cache
    await redis.del('blogs:all');
    console.log('🗑️ Cache invalidated');
    
    res.json({
        message: 'Blog created',
        data: newBlog
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

**Flow Diagram:**

```
First Request:
Client → /blogs → Cache MISS → Database (800ms) → Store in Redis → Response

Subsequent Requests (within 24 hours):
Client → /blogs → Cache HIT → Redis (20ms) → Response

New Blog Created:
Client → POST /blogs → Delete cache key → Response

Next Request:
Client → /blogs → Cache MISS → Database → Store in Redis → Response
```

### Cache Invalidation Strategies

#### 1. Time-Based (TTL)
```javascript
// Expire after 1 hour
await redis.setex('key', 3600, 'value');
```

#### 2. Event-Based
```javascript
// Invalidate on data change
async function updateUser(userId, data) {
    await database.update(userId, data);
    await redis.del(`user:${userId}`); // Clear cache
}
```

#### 3. Write-Through Cache
```javascript
// Update cache and database together
async function updateUser(userId, data) {
    await database.update(userId, data);
    await redis.set(`user:${userId}`, JSON.stringify(data));
}
```

#### 4. Write-Behind Cache
```javascript
// Update cache immediately, database later
async function updateUser(userId, data) {
    await redis.set(`user:${userId}`, JSON.stringify(data));
    // Queue database update for later
    await queue.add({ userId, data });
}
```

---

## Blob Storage & CDN {#blob-storage-cdn}

### What is Blob Storage?

**Blob = Binary Large Object**

Files like images, videos, PDFs can't be stored efficiently in traditional databases. They're represented as binary data (0s and 1s).

**Why not store in MySQL/MongoDB?**
- Slow queries (1GB video makes queries sluggish)
- Complex scaling and backups
- Expensive compared to blob storage

**Solution:** Use managed blob storage like **AWS S3**

### AWS S3 Overview

**Think of S3 as Google Drive for applications**

```python
# Upload file to S3
import boto3

s3_client = boto3.client('s3')

# Upload image
s3_client.upload_file(
    Filename='profile.jpg',
    Bucket='my-app-images',
    Key='users/user123/profile.jpg'
)

# Generate public URL
url = f"https://my-app-images.s3.amazonaws.com/users/user123/profile.jpg"
```

**S3 Features:**
- ✅ **Scalability:** Automatically scales to petabytes
- ✅ **Durability:** 99.999999999% (11 9's) durability
- ✅ **Cost-Effective:** $0.023/GB/month (cheaper than databases)
- ✅ **Security:** Encryption, access control, pre-signed URLs
- ✅ **Availability:** 99.99% uptime SLA

**Typical Architecture:**

```javascript
// Node.js image upload example
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const s3 = new AWS.S3();

app.post('/upload', upload.single('image'), async (req, res) => {
    const params = {
        Bucket: 'my-app-images',
        Key: `uploads/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
    };
    
    try {
        const result = await s3.upload(params).promise();
        
        // Store URL in database (not the file itself!)
        await database.users.update({
            userId: req.user.id,
            profileImage: result.Location
        });
        
        res.json({ 
            message: 'Upload successful',
            url: result.Location 
        });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});
```

### Content Delivery Network (CDN)

**Problem:** S3 bucket in India → Users in USA experience high latency

```
User (USA) → S3 (India) = 300ms latency
User (Australia) → S3 (India) = 250ms latency
```

**Solution:** CDN caches content on edge servers worldwide

```
User (USA) → CDN Edge (USA) → S3 (India)
             ↑
          Cached content
```

### How CDN Works

**First Request (Cache Miss):**
```
1. User (USA) requests image.jpg
2. Request goes to nearest CDN edge server (USA)
3. Edge server doesn't have file (CACHE MISS)
4. Edge server fetches from Origin (S3 in India)
5. Edge server caches the file
6. Returns file to user (300ms total)
```

**Subsequent Requests (Cache Hit):**
```
1. User (USA) requests image.jpg
2. Request goes to CDN edge server (USA)
3. Edge server HAS the file (CACHE HIT)
4. Returns file immediately (20ms total)
```

**Visual:**

```
         Origin Server (S3 - India)
                  |
                  | (Only on Cache Miss)
                  |
        CDN Edge Servers (Cached)
       /         |          \
   USA Edge   Europe Edge   Asia Edge
      |           |             |
   USA Users   EU Users    Asia Users
```

### CDN Key Concepts

#### 1. Time to Live (TTL)
```javascript
// CloudFront cache behavior
{
    "PathPattern": "/images/*",
    "MinTTL": 86400,        // 24 hours minimum
    "DefaultTTL": 2592000,  // 30 days default
    "MaxTTL": 31536000      // 1 year maximum
}
```

#### 2. Cache Invalidation
```bash
# Invalidate specific files
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/images/logo.png" "/css/style.css"
```

#### 3. GeoDNS Routing
```
User in USA → Routed to us-east-1 edge
User in Europe → Routed to eu-west-1 edge
User in Asia → Routed to ap-south-1 edge
```

**Example: Setting up CloudFront with S3**

```python
import boto3

cloudfront = boto3.client('cloudfront')

# Create CloudFront distribution
distribution_config = {
    'Origins': {
        'Items': [{
            'Id': 'my-s3-origin',
            'DomainName': 'my-bucket.s3.amazonaws.com',
            'S3OriginConfig': {
                'OriginAccessIdentity': ''
            }
        }]
    },
    'DefaultCacheBehavior': {
        'TargetOriginId': 'my-s3-origin',
        'ViewerProtocolPolicy': 'redirect-to-https',
        'MinTTL': 0,
        'DefaultTTL': 86400,  # 24 hours
        'MaxTTL': 31536000    # 1 year
    },
    'Enabled': True
}

response = cloudfront.create_distribution(
    DistributionConfig=distribution_config
)

cdn_url = response['Distribution']['DomainName']
print(f"CDN URL: https://{cdn_url}")
```

**Before CDN:**
```javascript
// Direct S3 URL
const imageUrl = "https://my-bucket.s3.amazonaws.com/image.jpg";
// Users worldwide hit S3 directly → High latency
```

**After CDN:**
```javascript
// CloudFront URL
const imageUrl = "https://d1234abcd.cloudfront.net/image.jpg";
// Users hit nearest edge server → Low latency
```

---

## Message Brokers & Kafka {#message-brokers}

### Synchronous vs Asynchronous Programming

#### Synchronous (Traditional)

```javascript
// Client waits for complete response
app.post('/process-video', async (req, res) => {
    const video = req.body.video;
    
    // This takes 10 minutes!
    await transcodeVideo(video);  // Client waits...
    await generateThumbnail(video);  // Still waiting...
    await extractAudio(video);  // Still waiting...
    
    res.json({ message: 'Done!' });  // Finally responds after 10 mins
});

// Problem: HTTP timeout, poor user experience
```

#### Asynchronous (With Message Broker)

```javascript
// Client gets immediate response
app.post('/process-video', async (req, res) => {
    const video = req.body.video;
    
    // Push task to message queue
    await messageQueue.publish('video-processing', {
        videoId: video.id,
        userId: req.user.id
    });
    
    // Immediate response
    res.json({ 
        message: 'Video processing started',
        status: 'pending'
    });
    // Worker processes in background
});

// Worker (separate process)
messageQueue.subscribe('video-processing', async (message) => {
    const video = await getVideo(message.videoId);
    await transcodeVideo(video);
    await generateThumbnail(video);
    await extractAudio(video);
    
    // Notify user via email or push notification
    await notifyUser(message.userId, 'Processing complete!');
});
```

### Why Use Message Broker?

**Architecture:**

```
Producer (Server) → Message Broker → Consumer (Worker)
```

**Benefits:**

1. **Reliability:** Producer/consumer can fail independently
2. **Retry Mechanism:** Failed tasks can be retried
3. **Decoupling:** Producer and consumer work at their own pace
4. **Scalability:** Add more consumers to process faster

### Message Queue vs Message Stream

#### Message Queue (RabbitMQ, AWS SQS)

**One message → One type of consumer**

```
Producer → [Message Queue] → Consumer (deletes after processing)
```

**Example: Video Transcoding**

```javascript
// Producer: Upload Service
const videoMetadata = {
    videoId: '123',
    s3Url: 's3://bucket/video.mp4',
    userId: 'user_456'
};

await queue.sendMessage('transcode-queue', videoMetadata);

// Consumer: Transcoder Service
const message = await queue.receiveMessage('transcode-queue');
await transcodeVideo(message.s3Url);
await queue.deleteMessage('transcode-queue', message.id);  // Remove from queue
```

**Problem: Multiple Consumers for Same Message**

```
Need to:
1. Transcode video
2. Generate captions
3. Extract metadata

❌ Can't use message queue - message deleted after first consumer
```

#### Message Stream (Kafka, AWS Kinesis)

**One message → Multiple types of consumers**

```
Producer → [Message Stream] → Consumer-A (transcoder)
                            → Consumer-B (caption generator)
                            → Consumer-C (metadata extractor)
```

**Key Difference:**
- Messages are **NOT deleted** by consumers
- Each consumer maintains its own **offset** (position in stream)
- Messages have **retention period** (e.g., 7 days)

**Example: Video Processing with Kafka**

```javascript
// Producer: Upload Service
const videoEvent = {
    videoId: '123',
    s3Url: 's3://bucket/video.mp4',
    userId: 'user_456',
    timestamp: Date.now()
};

await kafka.produce('video-uploaded', videoEvent);

// Consumer Group 1: Transcoder Service
kafka.subscribe('video-uploaded', 'transcoder-group', async (message) => {
    await transcodeVideo(message.s3Url);
    // Message stays in Kafka for other consumers
});

// Consumer Group 2: Caption Generator Service
kafka.subscribe('video-uploaded', 'caption-group', async (message) => {
    await generateCaptions(message.s3Url);
    // Same message, different processing
});

// Consumer Group 3: Metadata Extractor Service
kafka.subscribe('video-uploaded', 'metadata-group', async (message) => {
    await extractMetadata(message.s3Url);
    // Same message, yet another processing
});
```

### When to Use Message Brokers?

**Microservice Communication:**

```
✅ Use Message Broker when:
- Task is non-critical (can be delayed)
  Example: Sending emails, generating PDFs
  
- Task takes long time
  Example: Video processing, ML model training
  
- Need to decouple services
  Example: Order service → Payment service

❌ Use REST API when:
- Need immediate response
  Example: User login, search queries
  
- Synchronous flow required
  Example: Payment confirmation before order completion
```

### Apache Kafka Deep Dive

**Kafka = High-throughput Message Stream**

**Use Case: Uber Driver Location Tracking**

```javascript
// Problem: Tracking 10,000 drivers
// Update location every 2 seconds
// = 5,000 writes/second to database
// Database can't handle this load!

// Solution: Write to Kafka (high throughput)
setInterval(async () => {
    const driverLocations = await getAllDriverLocations();
    
    driverLocations.forEach(location => {
        kafka.produce('driver-locations', location);
    });
}, 2000);  // Every 2 seconds

// Consumer: Batch write to database every 10 minutes
kafka.subscribe('driver-locations', 'db-writer', async (messages) => {
    // Accumulate messages
    if (messages.length >= 30000) {  // 10 mins of data
        await database.batchInsert(messages);
    }
});
```

### Kafka Internals

**Core Components:**

```
Broker: Kafka server (stores data)
Topic: Category/feed name (like database table)
Partition: Subdivision of topic (like sharding)
Consumer Group: Set of consumers working together
```

**Visual:**

```
Topic: "video-uploaded"
├── Partition-0 [Messages 1-1000]
├── Partition-1 [Messages 1001-2000]
├── Partition-2 [Messages 2001-3000]
└── Partition-3 [Messages 3001-4000]
```

### Partitioning Strategy

```python
# Partition by region
def get_partition(video_data):
    if video_data['region'] == 'North':
        return 0
    elif video_data['region'] == 'South':
        return 1
    elif video_data['region'] == 'East':
        return 2
    else:
        return 3
```

### Consumer Groups & Rebalancing

**Scenario: 4 partitions, 3 consumers in one group**

```
Consumer-1 → Partition-0
Consumer-2 → Partition-1, Partition-2
Consumer-3 → Partition-3
```

**Rule:** 1 partition processed by only 1 consumer per group

**Multiple Consumer Groups (Different Processing):**

```
Topic: "video-uploaded" (4 partitions)

Consumer Group: "transcoder"
├── Consumer-1 → Partition-0, Partition-1
└── Consumer-2 → Partition-2, Partition-3

Consumer Group: "caption-generator"
├── Consumer-1 → Partition-0
├── Consumer-2 → Partition-1
└── Consumer-3 → Partition-2, Partition-3
```

**Code Example:**

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'video-processor',
    brokers: ['localhost:9092']
});

// Producer
const producer = kafka.producer();
await producer.connect();

await producer.send({
    topic: 'video-uploaded',
    messages: [
        { 
            key: 'video-123',  // Used for partitioning
            value: JSON.stringify({
                videoId: '123',
                s3Url: 's3://bucket/video.mp4',
                userId: 'user_456'
            })
        }
    ]
});

// Consumer
const consumer = kafka.consumer({ groupId: 'transcoder-group' });
await consumer.connect();
await consumer.subscribe({ topic: 'video-uploaded' });

await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
        const videoData = JSON.parse(message.value.toString());
        console.log(`Processing video ${videoData.videoId} from partition ${partition}`);
        await transcodeVideo(videoData);
    }
});
```

### Kafka Scaling Rule

**To scale consumers horizontally:**

```
Number of consumers ≤ Number of partitions

✅ Good: 4 partitions, 4 consumers (all utilized)
✅ Good: 4 partitions, 2 consumers (all utilized)
❌ Bad: 4 partitions, 6 consumers (2 consumers idle)
```

**To add more consumers, increase partitions first!**

---

## Real-time Pub/Sub

### Pub/Sub vs Message Broker

| Feature | Message Broker | Pub/Sub |
|---------|----------------|---------|
| **Message Pull/Push** | Consumer pulls | Broker pushes |
| **Storage** | Messages stored until consumed | No storage |
| **Delivery** | Guaranteed delivery | Fire-and-forget |
| **Use Case** | Background jobs | Real-time updates |

**Visual Comparison:**

```
Message Broker (Pull):
Producer → [Queue] → Consumer (polls for messages)

Pub/Sub (Push):
Publisher → [Broker] → Immediately pushes to all subscribers
```

### Redis Pub/Sub

```javascript
const Redis = require('ioredis');

// Publisher
const publisher = new Redis();
publisher.publish('notifications', JSON.stringify({
    userId: '123',
    message: 'New comment on your post'
}));

// Subscriber
const subscriber = new Redis();
subscriber.subscribe('notifications');

subscriber.on('message', (channel, message) => {
    console.log(`Received from ${channel}:`, message);
    // Message delivered immediately!
});
```

### Use Case: Real-Time Chat Application

**Problem: Horizontally scaled servers**

```
Client-1 → WebSocket → Server-1
Client-2 → WebSocket → Server-1
Client-3 → WebSocket → Server-2
Client-4 → WebSocket → Server-2
```

**Issue:** Client-1 sends message to Client-3
- Client-1 connected to Server-1
- Client-3 connected to Server-2
- Server-1 can't directly send to Client-3!

**Solution: Redis Pub/Sub**

```javascript
const express = require('express');
const WebSocket = require('ws');
const Redis = require('ioredis');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

const publisher = new Redis();
const subscriber = new Redis();

// Subscribe to chat channel
subscriber.subscribe('chat-messages');

// When Redis receives message, broadcast to all connected clients
subscriber.on('message', (channel, message) => {
    const data = JSON.parse(message);
    
    wss.clients.forEach(client => {
        if (client.userId === data.recipientId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
});

// Handle incoming WebSocket messages
wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        
        // Publish to Redis (all servers will receive)
        publisher.publish('chat-messages', JSON.stringify({
            senderId: data.senderId,
            recipientId: data.recipientId,
            message: data.message,
            timestamp: Date.now()
        }));
    });
});
```

**Flow:**

```
1. Client-1 (Server-1) sends message to Client-3
2. Server-1 publishes to Redis channel "chat-messages"
3. Redis pushes message to ALL subscribed servers (Server-1 & Server-2)
4. Server-2 receives message
5. Server-2 sends to Client-3 via WebSocket
```

---

## Event-Driven Architecture {#event-driven-architecture}

### Traditional vs Event-Driven

**Traditional (Synchronous):**

```javascript
// Order Service
app.post('/order', async (req, res) => {
    // 1. Create order
    const order = await createOrder(req.body);
    
    // 2. Process payment (waits for response)
    const payment = await paymentService.charge(order.amount);
    
    // 3. Update inventory (waits for response)
    await inventoryService.updateStock(order.items);
    
    // 4. Send notification (waits for response)
    await notificationService.sendEmail(order.userId);
    
    res.json({ orderId: order.id });  // Client waited for everything!
});
```

**Problems:**
- 🐌 Client waits for non-critical tasks (email)
- 💥 If notification service down → entire order fails
- 🔗 Tight coupling between services

**Event-Driven Architecture (Asynchronous):**

```javascript
// Order Service
app.post('/order', async (req, res) => {
    // 1. Create order
    const order = await createOrder(req.body);
    
    // 2. Process payment (critical - wait for this)
    const payment = await paymentService.charge(order.amount);
    
    if (payment.success) {
        // 3. Publish event (fire and forget)
        await eventBus.publish('order.completed', {
            orderId: order.id,
            userId: order.userId,
            items: order.items,
            timestamp: Date.now()
        });
        
        // 4. Immediate response to client
        res.json({ orderId: order.id, status: 'confirmed' });
    }
});

// Inventory Service (listens to events)
eventBus.subscribe('order.completed', async (event) => {
    await updateInventory(event.items);
});

// Notification Service (listens to events)
eventBus.subscribe('order.completed', async (event) => {
    await sendOrderConfirmationEmail(event.userId, event.orderId);
});
```

**Benefits:**
- ✅ **Decoupling:** Services don't know about each other
- ✅ **Resilience:** Notification service down? Order still succeeds
- ✅ **Scalability:** Each service scales independently

### EDA Patterns

#### 1. Simple Event Notification

**Publisher sends minimal info, consumers fetch details**

```javascript
// Order Service (Publisher)
await eventBus.publish('order.completed', {
    orderId: '12345',  // Just the ID
    timestamp: Date.now()
});

// Inventory Service (Consumer)
eventBus.subscribe('order.completed', async (event) => {
    // Fetch full order details from database
    const order = await database.orders.findById(event.orderId);
    await updateInventory(order.items);
});

// Notification Service (Consumer)
eventBus.subscribe('order.completed', async (event) => {
    // Fetch order details from database
    const order = await database.orders.findById(event.orderId);
    const user = await database.users.findById(order.userId);
    await sendEmail(user.email, order);
});
```

**Pros:** Lightweight events
**Cons:** Consumers make database calls (added latency)

#### 2. Event-Carried State Transfer

**Publisher sends ALL necessary data**

```javascript
// Order Service (Publisher)
await eventBus.publish('order.completed', {
    orderId: '12345',
    userId: 'user_789',
    userEmail: 'user@example.com',
    userName: 'John Doe',
    items: [
        { productId: 'prod_1', quantity: 2, price: 50 },
        { productId: 'prod_2', quantity: 1, price: 30 }
    ],
    totalAmount: 130,
    shippingAddress: '123 Main St, City',
    timestamp: Date.now()
});

// Inventory Service (Consumer)
eventBus.subscribe('order.completed', async (event) => {
    // All data in event - no database call needed!
    await updateInventory(event.items);
});

// Notification Service (Consumer)
eventBus.subscribe('order.completed', async (event) => {
    // All data in event - no database call needed!
    await sendEmail(event.userEmail, {
        userName: event.userName,
        orderId: event.orderId,
        items: event.items,
        total: event.totalAmount
    });
});
```

**Pros:** No extra database calls → Lower latency
**Cons:** Larger event size → Higher storage/bandwidth costs

### Complete E-commerce Example

```javascript
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'ecommerce-app',
    brokers: ['localhost:9092']
});

// ============= ORDER SERVICE =============
const orderProducer = kafka.producer();

app.post('/order', async (req, res) => {
    try {
        // 1. Validate and create order
        const order = await createOrder(req.body);
        
        // 2. Process payment
        const payment = await stripe.charges.create({
            amount: order.total * 100,
            currency: 'usd',
            source: req.body.paymentToken
        });
        
        if (payment.status === 'succeeded') {
            // 3. Publish event
            await orderProducer.send({
                topic: 'order-events',
                messages: [{
                    key: order.id,
                    value: JSON.stringify({
                        eventType: 'order.completed',
                        data: {
                            orderId: order.id,
                            userId: order.userId,
                            userEmail: order.userEmail,
                            items: order.items,
                            total: order.total,
                            timestamp: Date.now()
                        }
                    })
                }]
            });
            
            res.json({ 
                success: true,
                orderId: order.id,
                message: 'Order placed successfully'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Order failed' });
    }
});

// ============= INVENTORY SERVICE =============
const inventoryConsumer = kafka.consumer({ groupId: 'inventory-service' });

await inventoryConsumer.subscribe({ topic: 'order-events' });

await inventoryConsumer.run({
    eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());
        
        if (event.eventType === 'order.completed') {
            console.log('Updating inventory...');
            
            for (const item of event.data.items) {
                await database.products.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } }
                );
            }
            
            console.log('Inventory updated successfully');
        }
    }
});

// ============= NOTIFICATION SERVICE =============
const notificationConsumer = kafka.consumer({ groupId: 'notification-service' });

await notificationConsumer.subscribe({ topic: 'order-events' });

await notificationConsumer.run({
    eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());
        
        if (event.eventType === 'order.completed') {
            console.log('Sending notification...');
            
            await sendEmail({
                to: event.data.userEmail,
                subject: 'Order Confirmation',
                html: `
                    <h1>Order Confirmed!</h1>
                    <p>Order ID: ${event.data.orderId}</p>
                    <p>Total: $${event.data.total}</p>
                `
            });
            
            console.log('Notification sent successfully');
        }
    }
});

// ============= ANALYTICS SERVICE =============
const analyticsConsumer = kafka.consumer({ groupId: 'analytics-service' });

await analyticsConsumer.subscribe({ topic: 'order-events' });

await analyticsConsumer.run({
    eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString());
        
        if (event.eventType === 'order.completed') {
            console.log('Recording analytics...');
            
            await database.analytics.insert({
                eventType: 'purchase',
                userId: event.data.userId,
                revenue: event.data.total,
                itemCount: event.data.items.length,
                timestamp: event.data.timestamp
            });
            
            console.log('Analytics recorded');
        }
    }
});
```

**Benefits of this architecture:**
- Order Service responds in ~500ms (doesn't wait for inventory/email)
- If Notification Service down → Order still succeeds
- Easy to add new consumers (Analytics, Warehouse, Fraud Detection)
- Each service can be in different programming language

---

## Distributed Systems {#distributed-systems}

### What is a Distributed System?

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

### Leader-Follower Architecture

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

### Leader Election

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

### Auto-Recoverable System

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

### Real-World Example: Kubernetes

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

---

## Big Data Tools {#big-data-tools}

### When Single Machine Isn't Enough

**Scenario: Training ML Model on 1TB Dataset**

```python
# ❌ Single machine approach (will crash or take weeks)
import pandas as pd

# Load entire dataset into memory
df = pd.read_csv('massive_dataset.csv')  # 1TB - RAM overflow!
model.fit(df)  # Even if it fits, training takes forever
```

**Solution: Distributed Processing with Apache Spark**

```python
# ✅ Distributed approach
from pyspark.sql import SparkSession

# Initialize Spark
spark = SparkSession.builder \
    .appName("ML Training") \
    .master("spark://coordinator:7077") \
    .getOrCreate()

# Load data (automatically distributed across workers)
df = spark.read.csv('massive_dataset.csv')

# Transformations executed in parallel across workers
df_processed = df.filter(df['age'] > 18) \
                 .groupBy('country') \
                 .agg({'sales': 'sum'})

# Collect results
results = df_processed.collect()
```

### Apache Spark Architecture

```
           Driver (Coordinator)
          /      |       \
    Executor-1  Exec-2  Exec-3
    (Worker)   (Worker) (Worker)
        |         |        |
    [Partitions] [Part]  [Part]
```

**How it Works:**

1. **Driver** reads job code and divides data into partitions
2. **Executors** process partitions in parallel
3. **Driver** collects and combines results

### Use Cases

**1. ETL (Extract, Transform, Load)**

```python
# Read from multiple sources
user_data = spark.read.parquet('s3://users/')
transaction_data = spark.read.parquet('s3://transactions/')

# Transform (distributed operations)
joined = user_data.join(transaction_data, 'user_id')
aggregated = joined.groupBy('user_id').agg({
    'amount': 'sum',
    'transactions': 'count'
})

# Load to data warehouse
aggregated.write.parquet('s3://analytics/user_summary/')
```

**2. Real-Time Analytics**

```python
from pyspark.sql import functions as F
from pyspark.sql.types import *

# Stream processing
stream = spark.readStream \
    .format('kafka') \
    .option('kafka.bootstrap.servers', 'localhost:9092') \
    .option('subscribe', 'user-events') \
    .load()

# Process stream
events = stream.select(
    F.from_json(F.col('value').cast('string'), schema).alias('data')
).select('data.*')

# Aggregations on streaming data
metrics = events.groupBy(
    F.window('timestamp', '5 minutes'),
    'event_type'
).count()

# Write results
metrics.writeStream \
    .format('console') \
    .start() \
    .awaitTermination()
```

**3. Machine Learning at Scale**

```python
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.classification import RandomForestClassifier

# Prepare features (distributed)
assembler = VectorAssembler(
    inputCols=['age', 'income', 'credit_score'],
    outputCol='features'
)

df_features = assembler.transform(df)

# Train model (distributed across workers)
rf = RandomForestClassifier(
    featuresCol='features',
    labelCol='default',
    numTrees=100
)

model = rf.fit(df_features)  # Training parallelized

# Predictions (distributed)
predictions = model.transform(test_data)
```

### Coordinator Responsibilities

```python
class SparkCoordinator:
    def execute_job(self, data, transformation):
        # 1. Divide data into partitions
        partitions = self.partition_data(data, num_partitions=10)
        
        # 2. Assign to workers
        tasks = []
        for partition in partitions:
            worker = self.get_available_worker()
            task = worker.process(partition, transformation)
            tasks.append(task)
        
        # 3. Handle failures
        for task in tasks:
            if task.failed():
                # Reassign to different worker
                new_worker = self.get_available_worker()
                new_worker.process(task.partition, transformation)
        
        # 4. Collect results
        results = [task.result() for task in tasks]
        
        # 5. Combine
        final_result = self.combine_results(results)
        return final_result
    
    def get_available_worker(self):
        # Load balancing logic
        return min(self.workers, key=lambda w: w.current_load)
    
    def monitor_workers(self):
        # Health checks
        for worker in self.workers:
            if not worker.is_alive():
                self.restart_worker(worker)
```

### When to Use Big Data Tools

**Use When:**
- ✅ Data doesn't fit in single machine's memory
- ✅ Processing takes too long on single machine
- ✅ Need fault tolerance for long-running jobs
- ✅ Examples:
  - Training ML models on TBs of data
  - Processing billions of logs
  - Real-time analytics on streaming data
  - Social network analysis (millions of nodes)

**Don't Use When:**
- ❌ Data fits comfortably in memory (< 100GB)
- ❌ Simple transformations
- ❌ Low latency requirements (distributed has overhead)
- ❌ Small team without big data expertise

---

## Consistency Deep Dive {#consistency}

### Strong Consistency

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

### Eventual Consistency

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

### Achieving Strong Consistency

#### 1. Synchronous Replication

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

#### 2. Quorum-Based (W + R > N)

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

#### 3. Consensus Algorithms (Raft)

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

### Achieving Eventual Consistency

#### 1. Asynchronous Replication

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

#### 2. Gossip Protocol

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

#### 3. Conflict Resolution (Last Write Wins)

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

### Real-World Examples

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

## Consistent Hashing

### The Problem with Simple Hashing

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

### Consistent Hashing Solution

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

### Visual Representation

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

### Virtual Nodes (Improved Distribution)

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

### Benefits

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

## Data Redundancy and Recovery

### Why Make Databases Redundant?

**Risks:**
1. 🌊 Natural disasters (floods, earthquakes)
2. 💥 Hardware failure (disk corruption)
3. 🔥 Data center fire
4. 🐛 Software bugs causing data corruption

**Solution:** Store copies in multiple locations

### Backup Strategies

#### 1. Daily Backup

```python
import schedule
import time
from datetime import datetime

def daily_backup():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"backup_{timestamp}.sql"
    
    # Create database snapshot
    os.system(f"pg_dump mydb > /backups/{backup_name}")
    
    # Upload to S3
    os.system(f"aws s3 cp /backups/{backup_name} s3://my-backups/")
    
    print(f"Backup completed: {backup_name}")

# Schedule daily at 2 AM
schedule.every().day.at("02:00").do(daily_backup)

while True:
    schedule.run_pending()
    time.sleep(60)
```

#### 2. Weekly Backup

```python
def weekly_backup():
    timestamp = datetime.now().strftime("%Y%m%d")
    
    # Full database export
    os.system(f"pg_dump -Fc mydb > /backups/weekly_{timestamp}.dump")
    
    # Store in separate data center
    os.system(f"aws s3 cp /backups/weekly_{timestamp}.dump s3://backups-west/")

schedule.every().monday.at("03:00").do(weekly_backup)
```

**Recovery:**

```bash
# Restore from daily backup
pg_restore -d mydb /backups/backup_20251021_020000.sql

# Data loss: Everything between last backup and crash
```

### Continuous Redundancy (Modern Approach)

**Real-time replication to replica database**

```
    Primary DB
        ↓ (continuous replication)
    Replica DB
```

**Implementation (PostgreSQL):**

```sql
-- Primary Database Configuration (postgresql.conf)
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64

-- Create replication user
CREATE USER replicator REPLICATION LOGIN ENCRYPTED PASSWORD 'password';

-- Configure pg_hba.conf for replica access
host replication replicator replica_ip/32 md5
```

```sql
-- Replica Database Configuration
primary_conninfo = 'host=primary_ip port=5432 user=replicator password=password'
hot_standby = on
```

**Node.js Application with Failover:**

```javascript
const { Pool } = require('pg');

class DatabaseWithFailover {
    constructor() {
        this.primary = new Pool({
            host: 'primary-db.example.com',
            port: 5432,
            database: 'myapp',
            user: 'app_user',
            password: 'password',
            max: 20
        });
        
        this.replica = new Pool({
            host: 'replica-db.example.com',
            port: 5432,
            database: 'myapp',
            user: 'app_user',
            password: 'password',
            max: 20
        });
        
        this.primaryHealthy = true;
        this.monitorPrimaryHealth();
    }
    
    async monitorPrimaryHealth() {
        setInterval(async ()=> {
            try {
                await this.primary.query('SELECT 1');
                if (!this.primaryHealthy) {
                    console.log('✅ Primary database recovered');
                    this.primaryHealthy = true;
                }
            } catch (error) {
                console.error('❌ Primary database down:', error.message);
                this.primaryHealthy = false;
                await this.promoteReplica();
            }
        }, 5000);  // Check every 5 seconds
    }
    
    async promoteReplica() {
        console.log('🔄 Promoting replica to primary...');
        // In real scenario, trigger replica promotion command
        // pg_ctl promote -D /var/lib/postgresql/data
        
        // Swap connections
        const temp = this.primary;
        this.primary = this.replica;
        this.replica = temp;
        
        console.log('✅ Replica promoted to primary');
    }
    
    async write(query, params) {
        // All writes go to primary
        try {
            return await this.primary.query(query, params);
        } catch (error) {
            if (!this.primaryHealthy) {
                throw new Error('Primary database unavailable');
            }
            throw error;
        }
    }
    
    async read(query, params) {
        // Read from replica if available (reduce primary load)
        try {
            if (this.primaryHealthy) {
                return await this.replica.query(query, params);
            } else {
                return await this.primary.query(query, params);
            }
        } catch (error) {
            // Fallback to primary if replica fails
            return await this.primary.query(query, params);
        }
    }
}

// Usage
const db = new DatabaseWithFailover();

// Write operations
app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    
    const result = await db.write(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
    );
    
    res.json(result.rows[0]);
});

// Read operations
app.get('/users', async (req, res) => {
    const result = await db.read('SELECT * FROM users');
    res.json(result.rows);
});
```

### Synchronous vs Asynchronous Replication

#### Synchronous Replication

```javascript
// Primary waits for replica acknowledgment
async function syncWrite(data) {
    const startTime = Date.now();
    
    // Write to primary
    await primaryDB.write(data);
    
    // Wait for replica to confirm
    await replicaDB.confirm(data);
    
    const latency = Date.now() - startTime;
    console.log(`Write completed in ${latency}ms`);
    
    return { status: 'success', latency };
}

// Pros: Zero data loss (replica always in sync)
// Cons: Higher latency (~50-100ms added)
```

#### Asynchronous Replication

```javascript
// Primary doesn't wait for replica
async function asyncWrite(data) {
    const startTime = Date.now();
    
    // Write to primary
    await primaryDB.write(data);
    
    // Return immediately
    const latency = Date.now() - startTime;
    console.log(`Write completed in ${latency}ms`);
    
    // Replicate in background
    setImmediate(() => {
        replicaDB.write(data).catch(err => {
            console.error('Replication failed:', err);
            retryQueue.add(data);
        });
    });
    
    return { status: 'success', latency };
}

// Pros: Lower latency (~10-20ms)
// Cons: Potential data loss if primary crashes before replication
```

### Multi-Region Redundancy

```javascript
class MultiRegionDatabase {
    constructor() {
        this.regions = {
            'us-east': new Pool({ host: 'db-us-east.example.com' }),
            'eu-west': new Pool({ host: 'db-eu-west.example.com' }),
            'ap-south': new Pool({ host: 'db-ap-south.example.com' })
        };
    }
    
    async write(data) {
        // Write to primary region
        await this.regions['us-east'].query(
            'INSERT INTO users (name, email) VALUES ($1, $2)',
            [data.name, data.email]
        );
        
        // Asynchronously replicate to other regions
        const replicationPromises = [
            this.regions['eu-west'].query(
                'INSERT INTO users (name, email) VALUES ($1, $2)',
                [data.name, data.email]
            ),
            this.regions['ap-south'].query(
                'INSERT INTO users (name, email) VALUES ($1, $2)',
                [data.name, data.email]
            )
        ];
        
        // Don't wait for cross-region replication
        Promise.allSettled(replicationPromises).then(results => {
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Replication to region ${index} failed`);
                }
            });
        });
        
        return { status: 'success' };
    }
    
    async read(userRegion) {
        // Read from nearest region for low latency
        const region = this.getClosestRegion(userRegion);
        return await this.regions[region].query('SELECT * FROM users');
    }
    
    getClosestRegion(userRegion) {
        // Simple region mapping
        const regionMap = {
            'NA': 'us-east',
            'EU': 'eu-west',
            'ASIA': 'ap-south'
        };
        return regionMap[userRegion] || 'us-east';
    }
}
```

### Point-in-Time Recovery (PITR)

**Restore database to any point in time**

```python
import boto3
from datetime import datetime, timedelta

class DatabaseBackupManager:
    def __init__(self):
        self.rds = boto3.client('rds')
    
    def create_snapshot(self, db_instance_id):
        """Create manual snapshot"""
        snapshot_id = f"manual-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        
        response = self.rds.create_db_snapshot(
            DBSnapshotIdentifier=snapshot_id,
            DBInstanceIdentifier=db_instance_id
        )
        
        print(f"Snapshot created: {snapshot_id}")
        return snapshot_id
    
    def restore_to_point_in_time(self, source_db, target_db, restore_time):
        """Restore database to specific timestamp"""
        
        response = self.rds.restore_db_instance_to_point_in_time(
            SourceDBInstanceIdentifier=source_db,
            TargetDBInstanceIdentifier=target_db,
            RestoreTime=restore_time,
            UseLatestRestorableTime=False
        )
        
        print(f"Restoring to {restore_time}")
        return response
    
    def list_available_backups(self, db_instance_id):
        """List all available snapshots"""
        snapshots = self.rds.describe_db_snapshots(
            DBInstanceIdentifier=db_instance_id
        )
        
        for snapshot in snapshots['DBSnapshots']:
            print(f"Snapshot: {snapshot['DBSnapshotIdentifier']}")
            print(f"Created: {snapshot['SnapshotCreateTime']}")
            print(f"Size: {snapshot['AllocatedStorage']} GB")
            print("---")

# Usage
backup_mgr = DatabaseBackupManager()

# Create snapshot before risky operation
backup_mgr.create_snapshot('production-db')

# Oh no! Bad migration ran at 14:30
# Restore to 5 minutes before
restore_time = datetime(2025, 10, 21, 14, 25, 0)
backup_mgr.restore_to_point_in_time(
    source_db='production-db',
    target_db='production-db-restored',
    restore_time=restore_time
)
```

### Disaster Recovery Plan

```javascript
class DisasterRecoveryOrchestrator {
    constructor() {
        this.primary = 'us-east-1';
        this.failover = 'us-west-2';
        this.activeRegion = this.primary;
    }
    
    async detectDisaster() {
        const healthChecks = await Promise.allSettled([
            this.checkDatabaseHealth(this.primary),
            this.checkApplicationHealth(this.primary),
            this.checkNetworkHealth(this.primary)
        ]);
        
        const failures = healthChecks.filter(r => r.status === 'rejected');
        
        if (failures.length >= 2) {
            console.log('🚨 DISASTER DETECTED - Initiating failover');
            await this.initiateFailover();
        }
    }
    
    async initiateFailover() {
        console.log('Step 1: Updating DNS to point to failover region');
        await this.updateDNS(this.failover);
        
        console.log('Step 2: Promoting replica database in failover region');
        await this.promoteDatabase(this.failover);
        
        console.log('Step 3: Redirecting traffic');
        await this.updateLoadBalancer(this.failover);
        
        console.log('Step 4: Notifying team');
        await this.sendAlert('Failover completed to ' + this.failover);
        
        this.activeRegion = this.failover;
        
        console.log('✅ Failover complete - System operational in ' + this.failover);
    }
    
    async checkDatabaseHealth(region) {
        const db = this.getDatabaseConnection(region);
        await db.query('SELECT 1');
    }
    
    async updateDNS(targetRegion) {
        // Update Route53 DNS records
        const route53 = new AWS.Route53();
        await route53.changeResourceRecordSets({
            HostedZoneId: 'Z1234567890ABC',
            ChangeBatch: {
                Changes: [{
                    Action: 'UPSERT',
                    ResourceRecordSet: {
                        Name: 'api.example.com',
                        Type: 'A',
                        AliasTarget: {
                            HostedZoneId: this.getRegionHostedZone(targetRegion),
                            DNSName: this.getLoadBalancerDNS(targetRegion)
                        }
                    }
                }]
            }
        }).promise();
    }
}
```

### Recovery Time Objective (RTO) & Recovery Point Objective (RPO)

```javascript
class BackupStrategy {
    constructor(rto, rpo) {
        this.RTO = rto;  // How quickly to recover (e.g., 1 hour)
        this.RPO = rpo;  // How much data loss acceptable (e.g., 5 minutes)
    }
    
    getStrategy() {
        // RPO = 0 (zero data loss)
        if (this.RPO === 0) {
            return {
                replication: 'synchronous',
                backup: 'continuous',
                cost: 'high',
                description: 'Synchronous replication to multiple regions'
            };
        }
        
        // RPO < 5 minutes
        if (this.RPO < 5 * 60) {
            return {
                replication: 'asynchronous',
                backup: 'continuous',
                snapshot_frequency: '1 minute',
                cost: 'medium-high'
            };
        }
        
        // RPO = 1 hour
        if (this.RPO === 60 * 60) {
            return {
                replication: 'asynchronous',
                backup: 'hourly',
                cost: 'medium'
            };
        }
        
        // RPO = 24 hours
        return {
            replication: 'none',
            backup: 'daily',
            cost: 'low',
            description: 'Daily backups to S3'
        };
    }
}

// Example: Financial system
const financialSystem = new BackupStrategy(
    RTO = 5 * 60,    // 5 minutes recovery time
    RPO = 0          // Zero data loss
);
console.log(financialSystem.getStrategy());
// Output: Synchronous replication + Multi-region

// Example: Blog site
const blogSystem = new BackupStrategy(
    RTO = 60 * 60,   // 1 hour recovery time
    RPO = 24 * 60 * 60  // 24 hours data loss acceptable
);
console.log(blogSystem.getStrategy());
// Output: Daily backups
```

---

## Proxy Servers {#proxy-servers}

### Forward Proxy

**Acts on behalf of CLIENT**

```
Client → Forward Proxy → Server
         (hides client)
```

**Use Cases:**

1. **Accessing Blocked Content (VPN)**

```javascript
// Without VPN (Forward Proxy)
User in China → youtube.com ❌ (blocked by firewall)

// With VPN (Forward Proxy)
User in China → VPN Server (USA) → youtube.com ✅
                 (Server sees VPN IP, not user IP)
```

2. **Corporate Filtering**

```javascript
class ForwardProxy {
    constructor() {
        this.blockedSites = [
            'facebook.com',
            'twitter.com',
            'netflix.com'
        ];
    }
    
    async handleRequest(url) {
        // Check if site is blocked
        if (this.isBlocked(url)) {
            return {
                status: 403,
                message: 'Site blocked by company policy'
            };
        }
        
        // Forward request
        const response = await fetch(url);
        return response;
    }
    
    isBlocked(url) {
        return this.blockedSites.some(site => url.includes(site));
    }
}

// Employee tries to access Facebook
// Request → Forward Proxy → Blocked!
```

3. **Caching**

```javascript
class CachingForwardProxy {
    constructor() {
        this.cache = new Map();
    }
    
    async handleRequest(url) {
        // Check cache first
        if (this.cache.has(url)) {
            console.log('✅ Cache HIT');
            return this.cache.get(url);
        }
        
        console.log('❌ Cache MISS - Fetching from server');
        const response = await fetch(url);
        
        // Cache the response
        this.cache.set(url, response);
        
        return response;
    }
}
```

### Reverse Proxy

**Acts on behalf of SERVER**

```
Client → Reverse Proxy → Backend Servers
         (hides servers)
```

**Use Cases:**

1. **Load Balancing**

```javascript
class ReverseProxyLoadBalancer {
    constructor(servers) {
        this.servers = servers;
        this.currentIndex = 0;
    }
    
    async handleRequest(req) {
        // Get next server (round-robin)
        const server = this.servers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.servers.length;
        
        console.log(`Routing request to ${server.url}`);
        
        // Forward to backend server
        const response = await fetch(`${server.url}${req.path}`, {
            method: req.method,
            headers: req.headers,
            body: req.body
        });
        
        return response;
    }
}

// Client thinks it's talking to one server
// But reverse proxy distributes across many
const proxy = new ReverseProxyLoadBalancer([
    { url: 'http://backend-1:3000' },
    { url: 'http://backend-2:3000' },
    { url: 'http://backend-3:3000' }
]);
```

2. **SSL Termination**

```javascript
const https = require('https');
const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');

// Reverse proxy handles SSL/TLS
const proxy = httpProxy.createProxyServer({
    target: 'http://backend:3000',  // Backend uses plain HTTP
    secure: false
});

// HTTPS server (handles encryption)
const httpsServer = https.createServer({
    key: fs.readFileSync('private-key.pem'),
    cert: fs.readFileSync('certificate.pem')
}, (req, res) => {
    // Decrypt HTTPS request
    // Forward as HTTP to backend
    proxy.web(req, res);
});

httpsServer.listen(443, () => {
    console.log('Reverse proxy handling SSL on port 443');
});

// Backend servers don't need to handle SSL!
// Reverse proxy does all encryption/decryption
```

**Benefits:**
- Backend servers simpler (no SSL overhead)
- Single place to manage SSL certificates
- Better performance (SSL is CPU-intensive)

3. **Caching Static Assets**

```javascript
class ReverseProxywithCache {
    constructor(backendUrl) {
        this.backend = backendUrl;
        this.cache = new Map();
    }
    
    async handleRequest(req) {
        // Cache static assets
        if (this.isStaticAsset(req.path)) {
            const cacheKey = req.path;
            
            if (this.cache.has(cacheKey)) {
                console.log(`Cache HIT: ${req.path}`);
                return this.cache.get(cacheKey);
            }
            
            // Fetch from backend
            const response = await fetch(`${this.backend}${req.path}`);
            
            // Cache for 1 hour
            this.cache.set(cacheKey, response);
            setTimeout(() => this.cache.delete(cacheKey), 3600000);
            
            return response;
        }
        
        // Dynamic requests - always go to backend
        return await fetch(`${this.backend}${req.path}`);
    }
    
    isStaticAsset(path) {
        const staticExtensions = ['.jpg', '.png', '.css', '.js', '.pdf'];
        return staticExtensions.some(ext => path.endsWith(ext));
    }
}
```

4. **Security (Hide Backend Infrastructure)**

```javascript
// Client only knows: api.example.com
// Reverse proxy maps to internal servers

class SecureReverseProxy {
    constructor() {
        this.routes = {
            '/api/users': 'http://internal-user-service:5000',
            '/api/products': 'http://internal-product-service:6000',
            '/api/orders': 'http://internal-order-service:7000'
        };
    }
    
    async handleRequest(req) {
        // Rate limiting
        if (!this.checkRateLimit(req.ip)) {
            return { status: 429, message: 'Too many requests' };
        }
        
        // Authentication
        if (!this.validateToken(req.headers.authorization)) {
            return { status: 401, message: 'Unauthorized' };
        }
        
        // Route to internal service
        const targetService = this.routes[req.path];
        
        if (!targetService) {
            return { status: 404, message: 'Not found' };
        }
        
        // Internal services not exposed to internet
        const response = await fetch(targetService);
        return response;
    }
}

// Attackers can't directly access internal services
// Must go through reverse proxy security checks
```

### Building Your Own Reverse Proxy

**Complete working example:**

```javascript
const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy server
const proxy = httpProxy.createProxyServer();

// Backend services
const services = {
    '/api/users': 'http://localhost:5001',
    '/api/products': 'http://localhost:5002',
    '/api/orders': 'http://localhost:5003'
};

// Cache for static content
const cache = new Map();

// Reverse proxy server
const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // 1. Check cache for static assets
    if (req.url.match(/\.(js|css|png|jpg|jpeg|gif)$/)) {
        if (cache.has(req.url)) {
            console.log('✅ Cache HIT');
            res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
            res.end(cache.get(req.url));
            return;
        }
    }
    
    // 2. Rate limiting
    const clientIP = req.socket.remoteAddress;
    if (!checkRateLimit(clientIP)) {
        res.writeHead(429, { 'Content-Type': 'text/plain' });
        res.end('Too Many Requests');
        return;
    }
    
    // 3. Route to appropriate backend service
    let targetService = null;
    
    for (const [path, service] of Object.entries(services)) {
        if (req.url.startsWith(path)) {
            targetService = service;
            break;
        }
    }
    
    if (!targetService) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
        return;
    }
    
    // 4. Add custom headers
    req.headers['X-Forwarded-For'] = clientIP;
    req.headers['X-Proxy-By'] = 'Custom-Reverse-Proxy';
    
    // 5. Forward request to backend
    proxy.web(req, res, { target: targetService }, (error) => {
        console.error('Proxy error:', error.message);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
    });
    
    // 6. Cache response for static assets
    proxy.on('proxyRes', (proxyRes, req, res) => {
        if (req.url.match(/\.(js|css|png|jpg)$/)) {
            let body = [];
            proxyRes.on('data', (chunk) => body.push(chunk));
            proxyRes.on('end', () => {
                body = Buffer.concat(body);
                cache.set(req.url, body);
                console.log(`Cached: ${req.url}`);
            });
        }
    });
});

// Rate limiting implementation
const requestCounts = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, []);
    }
    
    const requests = requestCounts.get(ip);
    
    // Remove old requests outside window
    const recentRequests = requests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
    }
    
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    
    return true;
}

// Start reverse proxy
server.listen(8080, () => {
    console.log('Reverse proxy running on port 8080');
    console.log('Routes:');
    console.log('  /api/users → localhost:5001');
    console.log('  /api/products → localhost:5002');
    console.log('  /api/orders → localhost:5003');
});
```

**Testing the reverse proxy:**

```bash
# Terminal 1: Start reverse proxy
node reverse-proxy.js

# Terminal 2: Start backend services
# User service on port 5001
node user-service.js

# Terminal 3: Start product service on port 5002
node product-service.js

# Terminal 4: Make requests
curl http://localhost:8080/api/users
# Routed to localhost:5001

curl http://localhost:8080/api/products
# Routed to localhost:5002
```

**Backend service example:**

```javascript
// user-service.js (runs on port 5001)
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
    console.log('User service received request');
    console.log('Headers:', req.headers['x-forwarded-for']);
    
    res.json({
        service: 'user-service',
        users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ]
    });
});

app.listen(5001, () => {
    console.log('User service running on port 5001');
});
```

---

## How to Solve Any System Design Problem

### Step-by-Step Approach

#### Step 1: Understand Requirements (5-10 minutes)

```
Ask clarifying questions:
1. What are the core features?
2. What is the expected scale (users, data volume)?
3. What are the performance requirements?
4. Any specific constraints (budget, technology, region)?
```

**Example: Design Twitter**

```
Functional Requirements:
- Post tweets (280 characters)
- Follow/unfollow users
- View timeline (tweets from people you follow)
- Like/retweet tweets
- Search tweets

Non-Functional Requirements:
- 100 million DAU (Daily Active Users)
- Low latency (<200ms)
- High availability (99.9% uptime)
- Eventually consistent (acceptable for likes)
```

#### Step 2: Break Down Into Sub-Problems

```
Twitter = Multiple Sub-Systems:
1. Tweet Creation Service
2. Timeline Service
3. Follow/Unfollow Service
4. Search Service
5. Notification Service
```

#### Step 3: Design Each Sub-System

**For EACH sub-system, consider 4 things:**

```
1. DATABASE: What data to store? SQL or NoSQL?
2. CACHING: What to cache? Where?
3. SCALING: How to handle millions of requests?
4. COMMUNICATION: Sync or Async? REST or Message Queue?
```

### Example: Design Twitter (Complete Solution)

#### Sub-System 1: Tweet Creation

```javascript
// 1. DATABASE
// Choice: NoSQL (Cassandra) - high write throughput
// Schema:
{
    tweet_id: UUID,
    user_id: UUID,
    content: String,
    created_at: Timestamp,
    likes_count: Int,
    retweets_count: Int
}

// 2. CACHING
// Cache recent tweets of popular users in Redis
// TTL: 5 minutes

// 3. SCALING
// Horizontal scaling with load balancer
// Database sharding by user_id

// 4. COMMUNICATION
// Async: Publish event to Kafka after tweet creation
// Other services subscribe to "tweet.created" event

// Implementation
app.post('/tweet', async (req, res) => {
    const { user_id, content } = req.body;
    
    // Validate
    if (content.length > 280) {
        return res.status(400).json({ error: 'Tweet too long' });
    }
    
    // Store in database
    const tweet = {
        tweet_id: uuid(),
        user_id,
        content,
        created_at: Date.now()
    };
    
    await cassandraClient.execute(
        'INSERT INTO tweets (tweet_id, user_id, content, created_at) VALUES (?, ?, ?, ?)',
        [tweet.tweet_id, tweet.user_id, tweet.content, tweet.created_at]
    );
    
    // Publish event (async)
    await kafka.produce('tweet.created', tweet);
    
    // Return immediately
    res.json({ tweet_id: tweet.tweet_id, status: 'created' });
});
```

#### Sub-System 2: Timeline Service

```javascript
// 1. DATABASE
// Precomputed timelines stored in Redis
// Key: "timeline:user_id"
// Value: List of tweet_ids

// 2. CACHING
// Cache entire timeline (last 100 tweets) in Redis
// Cache user's followers list

// 3. SCALING
// Read-heavy: Master-Slave for timeline database
// CDN for media (images/videos in tweets)

// 4. COMMUNICATION
// Timeline consumer listens to "tweet.created" event
// Fans out tweet to all followers' timelines

// Fan-out service (runs async)
kafka.subscribe('tweet.created', async (tweetEvent) => {
    const { user_id, tweet_id } = tweetEvent;
    
    // Get all followers
    const followers = await getFollowers(user_id);
    
    // Add tweet to each follower's timeline
    const batchOperations = followers.map(follower_id => {
        return redis.lpush(`timeline:${follower_id}`, tweet_id);
    });
    
    await Promise.all(batchOperations);
    
    // Trim timeline to last 100 tweets
    followers.forEach(follower_id => {
        redis.ltrim(`timeline:${follower_id}`, 0, 99);
    });
});

// Get timeline endpoint
app.get('/timeline', async (req, res) => {
    const { user_id } = req.query;
    
    // Get from Redis (precomputed timeline)
    const tweet_ids = await redis.lrange(`timeline:${user_id}`, 0, 19);
    
    // Fetch tweet details (can be cached too)
    const tweets = await Promise.all(
        tweet_ids.map(id => getTweetDetails(id))
    );
    
    res.json({ tweets });
});
```

#### Sub-System 3: Search Service

```javascript
// 1. DATABASE
// Elasticsearch for full-text search
// Indexed fields: content, hashtags, mentions

// 2. CACHING
// Cache popular search queries
// Cache trending hashtags

// 3. SCALING
// Elasticsearch cluster (distributed search)
// Separate read replicas

// 4. COMMUNICATION
// Listen to "tweet.created" event
// Index tweets in Elasticsearch asynchronously

// Indexing service
kafka.subscribe('tweet.created', async (tweetEvent) => {
    await elasticsearchClient.index({
        index: 'tweets',
        id: tweetEvent.tweet_id,
        body: {
            user_id: tweetEvent.user_id,
            content: tweetEvent.content,
            created_at: tweetEvent.created_at,
            hashtags: extractHashtags(tweetEvent.content)
        }
    });
});

// Search endpoint
app.get('/search', async (req, res) => {
    const { query } = req.query;
    
    // Check cache
    const cacheKey = `search:${query}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    
    // Search Elasticsearch
    const results = await elasticsearchClient.search({
        index: 'tweets',
        body: {
            query: {
                match: { content: query }
            },
            size: 20
        }
    });
    
    // Cache results for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(results));
    
    res.json(results);
});
```

### Complete Architecture Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ↓
┌──────────────────┐
│   API Gateway    │
└──────┬───────────┘
       │
   ┌───┴────┐
   ↓        ↓
┌─────┐  ┌─────┐
│ LB  │  │ LB│
└──┬──┘  └──┬──┘
   │        │
   ↓        ↓
┌───────────────────────┐  ┌────────────────────────┐
│  Tweet Service (3x)   │  │  Timeline Service (3x) │
└───────┬───────────────┘  └────────┬───────────────┘
        │                           │
        ↓                           ↓
   ┌────────┐                  ┌─────────┐
   │ Kafka  │ ← Events ──────→ │  Redis  │
   └────┬───┘                  └─────────┘
        │                      (Timelines)
        ↓
┌───────────────────┐
│ Cassandra Cluster │
│   (Sharded by     │
│     user_id)      │
└───────────────────┘

Other Services:
- Search Service → Elasticsearch
- Media Service → S3 + CloudFront CDN
- Notification Service → Push notifications
```

### Detailed Sub-System 4: Follow/Unfollow Service

```javascript
// 1. DATABASE
// PostgreSQL (graph-like relationships)
// Tables:
//   - follows (follower_id, followee_id, created_at)
//   - user_followers_count (user_id, count)
//   - user_following_count (user_id, count)

// 2. CACHING
// Cache follower/following lists in Redis
// Cache follower counts

// 3. SCALING
// Read replicas for follow lists
// Write to master, read from slaves

// 4. COMMUNICATION
// Publish "user.followed" event for analytics

// Follow endpoint
app.post('/follow', async (req, res) => {
    const { follower_id, followee_id } = req.body;
    
    // Validate
    if (follower_id === followee_id) {
        return res.status(400).json({ error: 'Cannot follow yourself' });
    }
    
    // Start transaction
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Insert follow relationship
        await client.query(
            'INSERT INTO follows (follower_id, followee_id, created_at) VALUES ($1, $2, NOW())',
            [follower_id, followee_id]
        );
        
        // Update counts
        await client.query(
            'UPDATE user_following_count SET count = count + 1 WHERE user_id = $1',
            [follower_id]
        );
        
        await client.query(
            'UPDATE user_followers_count SET count = count + 1 WHERE user_id = $1',
            [followee_id]
        );
        
        await client.query('COMMIT');
        
        // Invalidate cache
        await redis.del(`followers:${followee_id}`);
        await redis.del(`following:${follower_id}`);
        
        // Publish event (async)
        await kafka.produce('user.followed', {
            follower_id,
            followee_id,
            timestamp: Date.now()
        });
        
        res.json({ status: 'success' });
        
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Follow failed' });
    } finally {
        client.release();
    }
});

// Get followers endpoint
app.get('/followers/:user_id', async (req, res) => {
    const { user_id } = req.params;
    
    // Check cache
    const cacheKey = `followers:${user_id}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    
    // Query database (read from replica)
    const result = await replicaDB.query(
        'SELECT follower_id FROM follows WHERE followee_id = $1 ORDER BY created_at DESC LIMIT 100',
        [user_id]
    );
    
    const followers = result.rows.map(row => row.follower_id);
    
    // Cache for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(followers));
    
    res.json({ followers });
});
```

### Sub-System 5: Notification Service

```javascript
// 1. DATABASE
// MongoDB (flexible schema for different notification types)
// Collection: notifications
{
    notification_id: UUID,
    user_id: UUID,
    type: String, // 'like', 'retweet', 'follow', 'mention'
    actor_id: UUID, // Who performed the action
    tweet_id: UUID, // If applicable
    read: Boolean,
    created_at: Timestamp
}

// 2. CACHING
// Cache unread notification count in Redis

// 3. SCALING
// Notification workers consume from Kafka
// Scale workers based on queue size

// 4. COMMUNICATION
// Subscribe to multiple events: tweet.liked, tweet.retweeted, user.followed

// Notification worker
const notificationWorker = kafka.consumer({ groupId: 'notification-service' });

await notificationWorker.subscribe({ topics: [
    'tweet.liked',
    'tweet.retweeted',
    'user.followed',
    'user.mentioned'
]});

await notificationWorker.run({
    eachMessage: async ({ topic, message }) => {
        const event = JSON.parse(message.value.toString());
        
        switch(topic) {
            case 'tweet.liked':
                await handleLikeNotification(event);
                break;
            case 'tweet.retweeted':
                await handleRetweetNotification(event);
                break;
            case 'user.followed':
                await handleFollowNotification(event);
                break;
            case 'user.mentioned':
                await handleMentionNotification(event);
                break;
        }
    }
});

async function handleLikeNotification(event) {
    const { tweet_id, liker_id } = event;
    
    // Get tweet author
    const tweet = await getTweet(tweet_id);
    
    // Don't notify if user liked their own tweet
    if (tweet.user_id === liker_id) return;
    
    // Create notification
    const notification = {
        notification_id: uuid(),
        user_id: tweet.user_id,
        type: 'like',
        actor_id: liker_id,
        tweet_id: tweet_id,
        read: false,
        created_at: Date.now()
    };
    
    await mongodb.collection('notifications').insertOne(notification);
    
    // Increment unread count in cache
    await redis.incr(`unread_notifications:${tweet.user_id}`);
    
    // Send push notification
    await sendPushNotification(tweet.user_id, {
        title: 'New like!',
        body: `${await getUserName(liker_id)} liked your tweet`
    });
}

// Get notifications endpoint
app.get('/notifications', async (req, res) => {
    const { user_id } = req.query;
    
    const notifications = await mongodb.collection('notifications')
        .find({ user_id })
        .sort({ created_at: -1 })
        .limit(20)
        .toArray();
    
    // Enrich with user details
    const enriched = await Promise.all(
        notifications.map(async (notif) => ({
            ...notif,
            actor: await getUserDetails(notif.actor_id),
            tweet: notif.tweet_id ? await getTweetDetails(notif.tweet_id) : null
        }))
    );
    
    res.json({ notifications: enriched });
});

// Mark as read
app.post('/notifications/read', async (req, res) => {
    const { user_id, notification_ids } = req.body;
    
    await mongodb.collection('notifications').updateMany(
        { notification_id: { $in: notification_ids } },
        { $set: { read: true } }
    );
    
    // Update unread count
    const unreadCount = await mongodb.collection('notifications')
        .countDocuments({ user_id, read: false });
    
    await redis.set(`unread_notifications:${user_id}`, unreadCount);
    
    res.json({ status: 'success' });
});
```

### Capacity Planning & Numbers

```javascript
// Twitter scale estimates

// USERS
const DAU = 100_000_000; // Daily Active Users
const MAU = 300_000_000; // Monthly Active Users

// TWEETS
const tweetsPerDay = DAU * 10; // 1 billion tweets/day
const tweetsPerSecond = tweetsPerDay / 86400; // ~11,500 TPS

// TIMELINE READS
const timelineReadsPerDay = DAU * 100; // 10 billion reads/day
const timelineReadsPerSecond = timelineReadsPerDay / 86400; // ~115,000 RPS

// STORAGE
const avgTweetSize = 500; // bytes (text only)
const tweetsWithMedia = tweetsPerDay * 0.1; // 10% have media
const avgMediaSize = 2 * 1024 * 1024; // 2 MB per media

const dailyStorage = 
    (tweetsPerDay * avgTweetSize) + 
    (tweetsWithMedia * avgMediaSize);
// ≈ 200 TB/day

// SERVERS NEEDED
const requestsPerSecond = 115000; // Peak RPS
const requestsPerServerPerSecond = 1000;
const serversNeeded = requestsPerSecond / requestsPerServerPerSecond;
// ≈ 115 servers (minimum)

// With redundancy and headroom
const totalServers = serversNeeded * 3; // ≈ 345 servers

console.log('Infrastructure Requirements:');
console.log(`- Application Servers: ${totalServers}`);
console.log(`- Daily Storage: ${Math.round(dailyStorage / 1024 / 1024 / 1024)} GB`);
console.log(`- Peak RPS: ${requestsPerSecond}`);
console.log(`- Write TPS: ${Math.round(tweetsPerSecond)}`);
```

### Trade-offs & Design Decisions

```javascript
// Decision Matrix

const designDecisions = {
    
    // 1. Fan-out on write vs Fan-out on read
    fanout: {
        choice: 'Fan-out on write (with hybrid)',
        reasoning: `
            - Pre-compute timelines for most users
            - For celebrities (>1M followers), fan-out on read
            - Reduces timeline fetch latency from 500ms to 50ms
        `,
        tradeoff: 'Higher write cost, but better read performance'
    },
    
    // 2. SQL vs NoSQL for tweets
    database: {
        choice: 'NoSQL (Cassandra)',
        reasoning: `
            - High write throughput (11,500 TPS)
            - Simple key-value access pattern
            - Easy horizontal scaling
        `,
        tradeoff: 'Less flexible querying, eventual consistency'
    },
    
    // 3. Cache everything vs selective caching
    caching: {
        choice: 'Selective caching',
        reasoning: `
            - Cache: Timelines, follower lists, trending topics
            - Don't cache: Individual tweets (too many, low reuse)
        `,
        tradeoff: 'Balance between cache hit rate and memory cost'
    },
    
    // 4. Sync vs Async processing
    communication: {
        choice: 'Hybrid',
        reasoning: `
            - Sync: Tweet creation (immediate feedback)
            - Async: Timeline fan-out, notifications, indexing
        `,
        tradeoff: 'Complexity vs scalability'
    },
    
    // 5. Strong vs Eventual consistency
    consistency: {
        choice: 'Eventual consistency',
        reasoning: `
            - Like counts can be slightly stale
            - Timeline order can have minor delays
            - Not critical for user experience
        `,
        tradeoff: 'May show inconsistent data briefly'
    }
};
```

### Monitoring & Observability

```javascript
// Key metrics to monitor

const metrics = {
    
    // Application metrics
    application: {
        'Request Latency (p95)': '< 200ms',
        'Request Latency (p99)': '< 500ms',
        'Error Rate': '< 0.1%',
        'Requests Per Second': 'Track peak and average'
    },
    
    // Infrastructure metrics
    infrastructure: {
        'CPU Usage': '< 70% average',
        'Memory Usage': '< 80%',
        'Disk Usage': '< 85%',
        'Network Bandwidth': 'Monitor for bottlenecks'
    },
    
    // Database metrics
    database: {
        'Query Latency': '< 50ms (p95)',
        'Connection Pool': 'Monitor utilization',
        'Replication Lag': '< 1 second',
        'Deadlocks': 'Alert on any occurrence'
    },
    
    // Cache metrics
    cache: {
        'Hit Rate': '> 90%',
        'Memory Usage': '< 80%',
        'Eviction Rate': 'Monitor trends',
        'Connection Errors': 'Alert immediately'
    },
    
    // Business metrics
    business: {
        'Daily Active Users': 'Track growth',
        'Tweets Per Day': 'Monitor trends',
        'Timeline Load Time': '< 100ms',
        'Search Response Time': '< 300ms'
    }
};

// Alert configuration
const alerts = {
    critical: [
        'Error rate > 1%',
        'API latency p99 > 1 second',
        'Database replication lag > 10 seconds',
        'Cache hit rate < 70%'
    ],
    warning: [
        'CPU usage > 80%',
        'Memory usage > 85%',
        'Disk usage > 90%',
        'Unusual traffic patterns'
    ]
};

// Logging strategy
const loggingStrategy = {
    levels: ['ERROR', 'WARN', 'INFO', 'DEBUG'],
    
    ERROR: 'All errors with full stack traces',
    WARN: 'Degraded performance, retries, fallbacks',
    INFO: 'Important business events (tweet created, user followed)',
    DEBUG: 'Detailed debugging (only in non-prod)',
    
    structure: {
        timestamp: 'ISO 8601',
        level: 'ERROR|WARN|INFO|DEBUG',
        service: 'tweet-service',
        traceId: 'For distributed tracing',
        userId: 'For user-specific issues',
        message: 'Human readable',
        metadata: 'Additional context'
    }
};
```

### Summary Checklist

**When solving ANY system design problem:**

```
✅ 1. CLARIFY REQUIREMENTS
   - Functional requirements (what features?)
   - Non-functional requirements (scale, performance?)
   - Constraints (budget, technology, compliance?)

✅ 2. ESTIMATE SCALE
   - Users: DAU, MAU
   - Data: Writes/day, Reads/day, Storage
   - Resources: Servers needed, Bandwidth

✅ 3. DEFINE API
   - RESTful endpoints
   - Request/response formats
   - Authentication/authorization

✅ 4. DATABASE DESIGN
   - Schema design
   - SQL vs NoSQL choice
   - Indexing strategy
   - Partitioning/sharding if needed

✅ 5. HIGH-LEVEL DESIGN
   - Draw component diagram
   - Show data flow
   - Identify bottlenecks

✅ 6. DEEP DIVE
   For each component:
   - Database choice & schema
   - Caching strategy
   - Scaling approach
   - Communication pattern

✅ 7. TRADE-OFFS
   - Consistency vs Availability
   - Latency vs Throughput
   - Complexity vs Maintainability
   - Cost vs Performance

✅ 8. BOTTLENECKS & SOLUTIONS
   - Identify single points of failure
   - Plan for failures
   - Discuss monitoring

✅ 9. OPTIONAL ENHANCEMENTS
   - Analytics
   - A/B testing
   - Feature flags
   - Multi-region deployment
```

---

## Final Tips

### Interview-Specific Advice

```javascript
// DO's
const interviewDos = [
    'Ask clarifying questions upfront',
    'Think out loud - explain your reasoning',
    'Start with a simple design, then iterate',
    'Draw diagrams - visual helps interviewer follow',
    'Discuss trade-offs explicitly',
    'Consider edge cases and failures',
    'Be honest if you don\'t know something',
    'Show breadth AND depth'
];

// DON'Ts
const interviewDonts = [
    'Don\'t jump to solutions without clarifying',
    'Don\'t over-engineer for stated requirements',
    'Don\'t ignore interviewer hints/questions',
    'Don\'t get stuck on minor details',
    'Don\'t forget about non-functional requirements',
    'Don\'t assume infinite resources/budget'
];
```

### Common Patterns

```javascript
// Pattern library to remember

const commonPatterns = {
    
    'Read Heavy System': {
        solutions: [
            'Master-Slave architecture',
            'Aggressive caching (Redis)',
            'CDN for static content',
            'Read replicas geographically distributed'
        ],
        examples: ['Social media feeds', 'News sites', 'E-commerce product catalogs']
    },
    
    'Write Heavy System': {
        solutions: [
            'Database sharding',
            'Write-optimized NoSQL (Cassandra)',
            'Async processing with message queues',
            'Batch writes'
        ],
        examples: ['Analytics', 'Logging systems', 'IoT data ingestion']
    },
    
    'Low Latency Requirements': {
        solutions: [
            'In-memory databases (Redis)',
            'Edge computing/CDN',
            'Pre-computation',
            'WebSockets for real-time'
        ],
        examples: ['Gaming', 'Trading platforms', 'Real-time chat']
    },
    
    'High Availability Required': {
        solutions: [
            'Multi-region deployment',
            'Redundant systems',
            'Automatic failover',
            'Circuit breakers'
        ],
        examples: ['Payment systems', 'Healthcare', 'Critical infrastructure']
    }
};
```

---

**You now have everything you need to ace system design interviews and build scalable systems in the real world!** 

**Key Takeaways:**
1. Always start simple, then scale based on actual needs
2. Every design decision is a trade-off - understand and articulate them
3. Practice drawing diagrams and explaining your thinking
4. Build real projects to internalize these concepts
5. Stay curious and keep learning from production systems

**Next Steps:**
- Practice with real interview questions (Design YouTube, Uber, WhatsApp, etc.)
- Build a project implementing these concepts
- Read about how real companies solve these problems (engineering blogs)
- Code your own versions of Redis, Load Balancer, etc. for deep understanding

Good luck! 🚀