# Event-Driven Architecture

> [!summary]
> Event-driven systems communicate through facts that have happened, improving decoupling while introducing delivery and consistency trade-offs.

## Traditional vs Event-Driven

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

## EDA Patterns

### 1. Simple Event Notification

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

### 2. Event-Carried State Transfer

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

## Complete E-commerce Example

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
