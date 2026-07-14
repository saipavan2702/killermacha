> [!summary]
> Microservices trade operational complexity for independent deployment, ownership, and scaling.

Map: [[Upskill/SysDes/System Design|System Design]]

## Monolith vs Microservices

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

## Why Microservices?

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

## API Gateway Pattern

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

## When to Use Microservices?

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

## Related

- [[Upskill/SysDes/HLD/Distributed Systems|Distributed Systems]]
- [[Upskill/SysDes/HLD/Event-Driven Architecture|Event-Driven Architecture]]
