Tags: #sysdes
Map: [[Upskill/SysDes/HLD/Publish-Subscribe|Publish-Subscribe]], [[Upskill/SysDes/HLD/Blob Storage and CDN|Blob Storage and CDN]], [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]], [[Upskill/SysDes/HLD/Message Queues|Message Queues]]

> [!summary]
> Fan out a time-sensitive notification through push topics, then protect the sale path with caching, rate limits, queues, and controlled admission.

## Flash Sale Notification to 50 Million Users

**Problem with polling:**
If every client keeps asking the server every 30 minutes "is the sale live?", that means 50M requests hitting the server again and again, and most of the time the answer is just "No". This wastes server resources, and on the client side, running a background service to keep polling drains the battery.

**Better approach - Push notifications:**
Instead of the client asking the server, the server tells the client when the sale goes live. We use APNS (Apple Push Notification Service) for iOS and FCM (Firebase Cloud Messaging) for Android. On Android, devices maintain a long-lived connection with Google Play Services, and that same channel is used to deliver push notifications.

**Problem with sending 50M individual push calls:**
Even in batches, this becomes millions/thousands of API calls, which is not efficient.

**Solution - Pub/Sub model:**
Instead of sending to each user one by one, clients subscribe to a "flash sale" topic. When the sale goes live, the server just publishes one message to that topic, and it gets fanned out to all subscribed devices. This avoids the server having to loop through 50M users individually.

**Delivery is not guaranteed:**
Push notifications only work if the device is online at that moment. If the client is offline, the message won't be delivered. Also, since a flash sale notification is useless after the sale ends, we set a TTL (time to live) on the message. If it can't be delivered within that time, it just expires instead of showing up late.

**Follow-up: What if all 50M users tap the notification and hit the sale page at once?**

This is a sudden massive traffic spike, so we need to protect the backend:

- **CDN + static caching**: Serve the sale page (images, banners, static content) from a CDN so it doesn't hit our origin servers at all.
- **Rate limiting / throttling**: Limit how many requests a single user or IP can send in a short window to prevent abuse and overload.
- **Queueing / virtual waiting room**: If traffic is too high for the backend to handle at once, put users in a queue (like a virtual waiting room) and let them into the actual purchase flow gradually instead of all at once.
- **Auto-scaling**: Scale up backend services (stateless services, containers) automatically based on load so we have enough compute to handle the spike.
- **Caching product/inventory data**: Use a fast cache (like Redis) for product details and inventory counts instead of hitting the database directly for every read, since the DB will become the bottleneck otherwise.
- **Load balancer**: Distribute incoming traffic evenly across multiple servers so no single server gets overwhelmed.
- **Async processing for order placement**: For the actual "buy" action, push the order request into a queue (like Kafka) and process it asynchronously, so we don't lose orders even under heavy load, and the system stays responsive.
