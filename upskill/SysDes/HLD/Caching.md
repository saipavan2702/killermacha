# Caching

Map: [[Upskill/SysDes/System Design|System Design]]

Related: [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]] · [[Upskill/SysDes/HLD/Database Sharding|Database Sharding]] · [[Upskill/SysDes/LLD/LRU and LFU Cache|LRU & LFU Cache]] · [[QoL/Refs/SysDes|SysDes Refs]]

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
