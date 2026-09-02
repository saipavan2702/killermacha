Tags: #sysdes
Map: [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]], [[Upskill/SysDes/HLD/Database Sharding|Database Sharding]], [[Upskill/SysDes/LLD/LRU and LFU Cache|LRU & LFU Cache]]

# Caching & Redis — Complete Notes

## 1. What is Caching?

A **cache** is a fast, temporary storage layer that stores frequently accessed data so future requests are served much faster. It sits between a client/application and a slower data source (database, disk, remote service).

```
Client → Cache → Database
```

**Without caching:**
```
Client Request → Backend (100ms) → Database (500ms) → Response
Total: 600ms
```

**With caching:**
```
Client Request → Backend → Redis (10ms) → Response
Total: 110ms (on cache hit)
```

### Key Idea
> Cache is not about *where* data is stored — cache is about *how fast* the data can be accessed.

Caching can mean:
- Storing data on faster hardware
- Storing data closer to where it's needed
- Storing data in a format optimized for fast access

### Core Benefits

| Benefit | Description |
|---|---|
| ⚡ **Lower Latency** | Data served from fast storage, closer to where it's needed |
| 💰 **Cost Efficiency** | Less database load = lower infra costs |
| 📈 **Higher Throughput** | More concurrent requests handled with the same resources |
| 🔋 **Reduced Backend Load** | Database and origin servers do less work |
| 🌍 **Scalability** | Enables horizontal scaling by distributing read load |

---

## 2. Types of Cache

### A) Hardware Cache (CPU-Level)
Inside the processor, managed entirely by CPU hardware.

| Level | Location | Speed | Latency | Size |
|---|---|---|---|---|
| L1 | Inside CPU core | Fastest | ~1 ns | 32–64 KB |
| L2 | Near CPU core | Very fast | ~3 ns | 256–512 KB |
| L3 | Shared across cores | Fast | ~12 ns | 2–32 MB |

These figures are illustrative, not fixed specifications. Cache size and latency vary considerably across CPU architectures and generations.

### B) Client-Side Cache
Lives on the user's device (browser, mobile app).

- Browser HTTP cache, Service Worker cache
- Mobile app cache (NSCache, DiskLruCache)
- LocalStorage / IndexedDB

**Used for:** static assets, API responses, offline-first functionality

**Benefits:** zero network latency, reduces server load, enables offline access

### C) Edge Cache (CDN)
Globally distributed edge locations near users — e.g. Cloudflare, Akamai, AWS CloudFront, Fastly.

**Used for:** static assets, public API responses, dynamic content via edge computing

**Benefits:** global low latency, offloads origin servers, DDoS protection

### D) Application Server Cache (Local)

**1. In-Memory Application Cache** — HashMap/Dictionary, Caffeine, Guava, `lru-cache` (Node.js), `sync.Map` (Go)

Ultra-fast (nanoseconds), volatile (lost on restart), process-local. This is what most people mean by "application cache."

**2. Local Persistent Cache (Disk/SSD)** — RocksDB, LevelDB, SQLite, DiskLruCache (Android)

Slower than RAM (µs–ms), survives restarts, larger capacity, still local to one server.

### E) Global Cache (Distributed Cache)
Shared storage accessible by all application servers — **Redis, Memcached, Aerospike**.

**Used for:** sessions, user profiles, product catalogs, API responses

**Benefits:** shared across services and horizontally scalable; high availability requires replication and failover to be configured

### F) Database Cache
Built into the database engine itself, transparent to the application — MySQL buffer pool, PostgreSQL shared buffers, MongoDB WiredTiger cache.

**Used for:** index pages, frequently accessed rows, query execution plans

### Consolidated Comparison

| Type | Location | Use Case | Example |
|---|---|---|---|
| Client-Side | User's browser/device | Static assets, offline data | HTML, CSS, JS, LocalStorage |
| CDN / Edge | Edge servers globally | Static + dynamic content | Cloudflare, CloudFront |
| Application-Level | Within app process | Computed results | In-memory HashMap, Caffeine |
| Global / Distributed | Separate cache layer | Query results, sessions | Redis, Memcached |
| Database Cache | Inside DB engine | Index pages, hot rows | Buffer pool, shared buffers |

### Typical Real-World Cache Stack

```
Users → Browser Cache → CDN Cache → Application Cache → Global Cache → Database Cache → Durable Storage
```

---

## 3. Redis Deep Dive

**Redis = an in-memory data-structure store.**

**Why Redis is fast:**
- The active dataset is served primarily from memory
- Commands and data structures are optimized for low overhead
- Pipelining can reduce network round trips

Raw memory is orders of magnitude faster than storage, but an end-to-end Redis request still includes networking, serialization, queuing, and command execution. Benchmark the real workload instead of assuming a fixed speed-up over a database.

**Why not use Redis for everything?**
- RAM is expensive and limited in capacity
- Persistence, replication, and failover must be configured deliberately
- Some acknowledged writes can still be lost depending on those durability settings

### Redis Data Types & Commands

#### String
```bash
SET user:1:name "Alice"                 # Set a key-value pair
GET user:1:name                         # → "Alice"
SET user:2:email "bob@email.com" NX     # Set only if key doesn't exist
MGET user:1:name user:2:email           # → ["Alice", "bob@email.com"]
SETEX user:3:session 3600 "token_xyz"   # Set with 1-hour TTL
```

#### List
```bash
LPUSH queue:emails "email1@example.com"  # Add to left (head)
LPUSH queue:emails "email2@example.com"
RPUSH queue:emails "email3@example.com"  # Add to right (tail)
LLEN queue:emails                        # → 3
LPOP queue:emails                        # Pop from left
RPOP queue:emails                        # Pop from right
```

- **Queue (FIFO):** `LPUSH` to enqueue, `RPOP` to dequeue
- **Stack (LIFO):** `LPUSH` to push, `LPOP` to pop

#### Hash
```bash
HSET user:1 name "Alice" email "alice@email.com" age 30
HGET user:1 name         # → "Alice"
HGETALL user:1           # → {name: "Alice", email: "alice@email.com", age: 30}
HINCRBY user:1 age 1     # age is now 31
```

#### Set
```bash
SADD tags:post:1 "technology" "programming" "tutorial"
SISMEMBER tags:post:1 "technology"       # → 1 (true)
SMEMBERS tags:post:1                     # → ["technology", "programming", "tutorial"]

SADD tags:post:2 "technology" "ai" "machinelearning"
SINTER tags:post:1 tags:post:2           # → ["technology"] (intersection)
```

#### Sorted Set
```bash
ZADD leaderboard 100 "Alice"
ZADD leaderboard 200 "Bob"
ZADD leaderboard 150 "Charlie"

ZREVRANGE leaderboard 0 2 WITHSCORES     # Top 3 → ["Bob",200,"Charlie",150,"Alice",100]
ZRANK leaderboard "Alice"                # → 0 (lowest rank)
```

### Practical Example: Blog API with Redis Caching

This example uses **cache-aside (lazy loading)**: the application checks Redis, loads from the database after a miss, and then populates Redis.

```javascript
const express = require('express');
const Redis = require('ioredis');
const app = express();

const redis = new Redis({ host: 'localhost', port: 6379 });

// Simulated slow database call
async function getBlogsFromDB() {
    await new Promise(resolve => setTimeout(resolve, 800)); // 800ms query
    return [
        { id: 1, title: 'First Blog', content: 'Content 1' },
        { id: 2, title: 'Second Blog', content: 'Content 2' }
    ];
}

// Cache middleware
async function cacheMiddleware(req, res, next) {
    const cacheKey = 'blogs:all';
    try {
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log('✅ Cache HIT');
            return res.json({ source: 'cache', data: JSON.parse(cachedData), responseTime: '20ms' });
        }
        console.log('❌ Cache MISS');
        next();
    } catch (error) {
        console.error('Redis error:', error);
        next();
    }
}

// GET /blogs
app.get('/blogs', cacheMiddleware, async (req, res) => {
    const blogs = await getBlogsFromDB();
    await redis.setex('blogs:all', 86400, JSON.stringify(blogs)); // cache for 24h
    res.json({ source: 'database', data: blogs, responseTime: '800ms' });
});

// POST /blogs — invalidate cache on new blog
app.post('/blogs', async (req, res) => {
    const newBlog = { id: 3, title: 'New Blog', content: 'New content' };
    await redis.del('blogs:all');
    console.log('🗑️ Cache invalidated');
    res.json({ message: 'Blog created', data: newBlog });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

**Flow:**
```
1st Request:        Client → /blogs → Cache MISS → DB (800ms) → Store in Redis → Response
Later Requests:      Client → /blogs → Cache HIT → Redis (20ms) → Response
New Blog Created:    Client → POST /blogs → Delete cache key → Response
Next Request:        Client → /blogs → Cache MISS → DB → Store in Redis → Response
```

---

## 4. Cache Write Strategies

How the cache and database stay in sync when data is written.

### Write-Through Cache
The cache or a coordinated data-access layer updates the backing database synchronously before acknowledging success.
```
App → Write-Through Layer → Cache + Database → Acknowledge
```
```javascript
async function updateUser(userId, data) {
    // Conceptual API: put resolves only after the backing store succeeds.
    await writeThroughStore.put(`user:${userId}`, data);
}
```
- **Pros:** successful coordinated writes leave the cache fresh; simpler read-consistency model
- **Cons:** higher write latency, more DB load, not ideal for write-heavy workloads
- **Use for:** read-heavy data where fresh cached reads matter and synchronous write cost is acceptable
- **Important:** two independent calls such as `database.update()` followed by `redis.set()` are a non-atomic dual write. The durable database must still enforce financial, inventory, and authorization correctness.

### Write-Back (Write-Behind) Cache
Writes go **only to the cache** first; the database is updated asynchronously/in batches.
```
App → Cache (dirty)
Cache → Database (later)
```
```javascript
async function updateUser(userId, data) {
    await redis.set(`user:${userId}`, JSON.stringify(data));
    await durableQueue.add({ userId, data }); // DB update queued for later
}
```
- **Pros:** fastest writes, high throughput, reduced DB write load
- **Cons:** risk of data loss if cache fails before persisting, complex failure handling
- **Use for:** real-time gaming leaderboards, IoT sensor ingestion, like/view counters, analytics
- **Example:** a social-media like counter, where losing a few likes is an acceptable trade-off

### Write-Around Cache
Writes go **directly to the database**, bypassing cache population. Any existing cache key should be invalidated so a later read repopulates it.
```
App → Database → Invalidate old cache key
```
- **Pros:** prevents cache pollution, efficient use of limited cache memory, simple write path
- **Cons:** slower first read after a write; omitting invalidation can expose stale data
- **Use for:** large file uploads, logging systems, streaming ingestion, batch outputs, archival storage
- **Example:** log ingestion pipelines — written constantly, rarely queried in real time

### Strategy Comparison

| Strategy | Write Speed | Read Speed | Consistency | Risk |
|---|---|---|---|---|
| Write-Through | Slow | Fast | Fresh after coordinated success | Partial failure if implemented as naïve dual writes |
| Write-Back | Fastest | Fast | Eventual | Medium–High |
| Write-Around | Fast | Slow (first read) | DB authoritative | Stale key if invalidation is omitted |

---

## 5. Cache Eviction Strategies

Determines which data gets removed when the cache is full. Critical for hit rate, latency, and stability.

### LRU — Least Recently Used
Evicts data untouched for the longest time. Assumes temporal locality: recently used data will likely be used again.
- **Best for:** web APIs, user sessions, CMS, general-purpose caching
- **Example:** API gateways caching recently accessed endpoints
- **Risk:** sequential access can pollute the cache

### LFU — Least Frequently Used
Evicts data with the fewest accesses over time. Prioritizes frequency over recency.
- **Best for:** power-law/skewed traffic — trending products, popular videos, recommendation systems
- **Example:** video platforms where a small % of content gets most views
- **Risk:** new items can starve before building up frequency

### MRU — Most Recently Used
Evicts the *most* recently accessed item — the opposite of LRU. Assumes recently used data won't be reused soon.
- **Best for:** sequential/one-time access — streaming workloads, large file scans, ETL jobs
- **Example:** batch analytics scanning a large dataset once
- **Risk:** poor fit for general-purpose caching

### FIFO — First In, First Out
Evicts the oldest inserted item regardless of usage. No access tracking, very simple.
- **Best for:** simplicity over performance, queue-like workloads
- **Example:** simple buffering systems or queues
- **Risk:** can evict hot/frequently used data

### Eviction Comparison

| Strategy | Evicts | Best For | Risk |
|---|---|---|---|
| LRU | Least recently used | Most applications | Sequential pollution |
| LFU | Least frequently used | Hot-key workloads | New item starvation |
| MRU | Most recently used | Sequential scans | Poor general use |
| FIFO | Oldest entry | Simple queues | Evicts hot data |

---

## 6. Cache Invalidation Strategies

Stale data — where the source changes but the cache doesn't — is one of caching's hardest problems.

### 1. TTL (Time To Live)
Expiration policy (not a write strategy) — data auto-expires after a set duration.
```javascript
await redis.setex('key', 3600, 'value'); // expires in 1 hour
```
```
user:123 → TTL = 300s → auto-expires after 300 seconds
```
**Purpose:** prevent stale data, automatic cleanup, memory management, eventual consistency

### 2. Explicit Invalidation
Explicitly deletes the cache key the moment underlying data changes.
```
Update DB → Delete cache key
```
```javascript
async function updateUser(userId, data) {
    await database.update(userId, data);
    await redis.del(`user:${userId}`); // clear stale cache
}
```

### 3. Write-Through Update
Cache and database are updated through a coordinated synchronous layer, so a successful write leaves the cache current (see §4).

### 4. Event-Driven Sync
Uses a message queue (e.g. Kafka) to propagate DB changes to cache asynchronously.
```
DB commit → Outbox/Event → Kafka → Cache update or invalidation
```

Consumers should tolerate duplicate, delayed, or out-of-order events; this approach is normally eventually consistent.

---

## 7. Caching Pitfalls & Fundamentals

### Cache Warming
Pre-loading data into the cache *before* real users request it, instead of waiting for cache misses to populate it.
- **Example:** after a deploy, pre-load top products, trending posts, homepage data into Redis so it's already "hot"
- **Prevents:** cold-start latency, DB traffic spikes, slow first requests

### Cache Miss
Requested data isn't in the cache → system falls back to DB/API/disk, then stores the result for next time.
```
GET /user/123 → cache lookup fails → DB query → store in cache → return response
```
- **Impact:** higher latency, more DB load, reduced throughput

### Cache Stampede (Thundering Herd)
Many requests miss the cache simultaneously and overwhelm the database — typically when a hot key expires, cache is flushed, or servers restart.
- **Example:** a popular feed cache expires at noon; 100,000 users hit it at once → all miss → DB overload
- **Prevention:** request coalescing (one request fetches, others wait), stale-while-revalidate, per-key locking, randomized TTLs

### Cache Pollution
Cache fills up with rarely-reused data, pushing out useful (hot) data.
- **Impact:** higher cache-miss rate, higher latency, DB/load spikes, cache becomes ineffective

### Pitfalls Summary

| Term | Meaning | Main effect |
|---|---|---|
| Cache warming | Preloading cache | Cold start avoided |
| Cache miss | Data not in cache | Higher latency |
| Cache stampede | Many misses at once | DB overload |
| Cache pollution | Cache filled with cold data | Hot data evicted |
| Cache invalidation | Removing stale cache | Stale data bugs if mishandled |
