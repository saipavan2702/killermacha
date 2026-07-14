> [!summary]
> A worked system-design example covering tweet creation, timelines, search, follows, notifications, capacity, and observability.

Map: [[Upskill/SysDes/System Design|System Design]]

## Sub-System 1: Tweet Creation

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

## Sub-System 2: Timeline Service

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

## Sub-System 3: Search Service

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

## Complete Architecture Diagram

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

## Detailed Sub-System 4: Follow/Unfollow Service

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

## Sub-System 5: Notification Service

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

## Capacity Planning & Numbers

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

## Trade-offs & Design Decisions

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

## Monitoring & Observability

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

## Related

- [[Upskill/SysDes/System Design Process|System Design Process]]
