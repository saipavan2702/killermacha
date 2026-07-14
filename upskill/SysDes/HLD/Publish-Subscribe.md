> [!summary]
> Publish-subscribe distributes real-time events to interested subscribers without tightly coupling producers and consumers.

Map: [[Upskill/SysDes/System Design|System Design]]

## Pub/Sub vs Message Broker

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

## Redis Pub/Sub

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

## Use Case: Real-Time Chat Application

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


// The above is pub/sub across multiple servers
// For in-memory we do it similar to the below

const pubSub = {
    uniqueId: 1,
    subscriber: {},
    subscribe: function(event, cb) {
        this.uniqueId = this.uniqueId + 1;
        const uId = this.uniqueId;
        const subscriber = this.subscriber;
        if (!subscriber[event]) {
            subscriber[event] = {}
        }
        subscriber[event] = {
            ...subscriber[event],
            [uId]: cb
        }
        return {
            unsubscribe() {
                delete subscriber[event][uId]
            },
        }
    },
    publish: function(event, data) {
        if (!this.subscriber[event]) {
            return;
        }
        for (let key in this.subscriber[event]) {
            this.subscriber[event][key](data)
        }
    }
}


u = pubSub.subscribe('test', () => { console.log('cb called 1') })
v = pubSub.subscribe('test', () => { console.log('cb called 2') })
w = pubSub.subscribe('test', () => { console.log('cb called 3') })
pubSub.publish('test')

v.unsubscribe()
pubSub.publish('test')
w.unsubscribe()
pubSub.publish('test’)
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

## Related

- [[Upskill/SysDes/HLD/Event-Driven Architecture|Event-Driven Architecture]]
- [[Upskill/SysDes/HLD/Message Queues|Message Queues]]
