Map: [[Upskill/SysDes/System Design|System Design]]

Related: [[Upskill/SysDes/HLD/Rate Limiting|Rate Limiting]] · [[Upskill/SysDes/HLD/Caching|Caching]] · [[Upskill/SysDes/HLD/Event-Driven Architecture|Event-Driven Architecture]] · [[Upskill/SysDes/System Design|System Design]]

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

## Related

- [[Upskill/SysDes/HLD/Distributed Systems Papers/Apache Kafka Architecture|Apache Kafka Architecture]]
- [[Upskill/SysDes/HLD/Event-Driven Architecture|Event-Driven Architecture]]
- [[Upskill/SysDes/HLD/Publish-Subscribe|Publish-Subscribe]]
