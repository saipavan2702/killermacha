> [!summary]
> Start with a simple client-server-database architecture, then scale only when traffic, reliability, or latency requires it.

Map: [[Upskill/SysDes/System Design|System Design]]

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
## What is a Server?

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

## Latency vs Throughput

| Metric         | Definition                            | Measurement               | Goal             |
| -------------- | ------------------------------------- | ------------------------- | ---------------- |
| **Latency**    | Time for ONE request to complete      | Milliseconds (ms)         | Lower is better  |
| **Throughput** | Number of requests handled per second | RPS (Requests Per Second) | Higher is better |

**Real-World Example:**
- **Latency**: Time for one car to travel from A to B (10 minutes)
- **Throughput**: Number of cars on highway per hour (1,000 cars)

**Ideal System**: Low latency + High throughput

---
## 1. Vertical Scaling (Scale Up/Down)

**Increase specs of the SAME machine** (more RAM, CPU, storage)

```
Before: 4GB RAM, 2 CPU cores
After:  16GB RAM, 8 CPU cores
```

**Use Cases:**
- SQL databases (easier to maintain ACID properties)
- Stateful applications

**Limitation:** You hit a ceiling - can't infinitely increase hardware specs.

## 2. Horizontal Scaling (Scale Out/In)

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

## 3. Auto Scaling

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

## Related

- [[Upskill/SysDes/HLD/Capacity Estimation|Capacity Estimation]]
