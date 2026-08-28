Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/Proxy Servers|Proxy Servers]], [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]], [[Upskill/SysDes/HLD/Microservices|Microservices]]

> [!summary]
> A reverse proxy hides and routes to backends, a load balancer spreads traffic, and an API gateway manages client-facing policy for services.

## Why people confuse these three

All three sit between the client and your backend, receive a request, and forward it somewhere. That's where the similarity ends. As an app grows from a single server to a full microservices setup, three different problems show up, and each of these tools solves one of them:

1. Hiding and protecting backend servers
2. Distributing heavy traffic across multiple servers
3. Giving multiple microservices a single, managed entry point

---

## 1. Reverse Proxy

**Problem it solves:** Hides your backend servers from the internet. Clients never talk to your servers directly, they only talk to the reverse proxy.

**Analogy:** The front desk of an apartment building. Visitors go to the front desk, not directly to someone's door. They don't even know how many apartments exist or where they are.

**What it does:**
- Hides backend server identity
- Terminates HTTPS/SSL
- Caches responses
- Compresses data
- Routes requests to the right service

**Popular tools:** Nginx, Apache, Traefik

**Example - Nginx reverse proxy config:**
```nginx
server {
    listen 80;
    server_name myapp.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
This forwards every request coming to `myapp.com` to your backend running on port 3000. The client only ever sees `myapp.com`.

---

## 2. Load Balancer

**Problem it solves:** One server can't handle all the traffic anymore. Distributes incoming requests across multiple identical servers so no single one gets overloaded. If a server goes down, traffic shifts to the healthy ones.

**Analogy:** A supermarket with multiple checkout counters instead of one long line for a single cashier.

**Popular tools:** AWS ELB, Azure Load Balancer, HAProxy

**Example - HAProxy config:**
```haproxy
frontend http_front
    bind *:80
    default_backend app_servers

backend app_servers
    balance roundrobin
    server server1 192.168.1.10:3000 check
    server server2 192.168.1.11:3000 check
    server server3 192.168.1.12:3000 check
```
Requests coming in on port 80 get spread across three backend servers in round-robin order. The `check` keyword enables health checks, so a dead server is automatically taken out of rotation.

---

## 3. API Gateway

**Problem it solves:** Manages complexity in a microservices setup. Instead of the client knowing the URLs of the user service, order service, payment service, etc., and handling auth for each one separately, it talks to one gateway that routes and secures everything.

**Analogy:** An airport check-in counter. It doesn't just point you to your gate, it verifies your identity, ticket, and baggage before letting you through.

**What it does:**
- Authentication and permission checks
- Request validation
- Rate limiting
- Routes requests to the correct microservice

**Popular tools:** Kong, AWS API Gateway, Azure API Management, Apigee

**Example - simple gateway logic (Express.js style):**
```javascript
app.use('/users', authenticate, rateLimit, proxy('http://user-service:4001'));
app.use('/orders', authenticate, rateLimit, proxy('http://order-service:4002'));
app.use('/payments', authenticate, rateLimit, proxy('http://payment-service:4003'));
```
Every request first passes through `authenticate` and `rateLimit`, then gets routed to the correct microservice based on the path.

---

## How they work together

These aren't competing tools, real systems use all three together. A typical request flow looks like this:

```
Client
  -> Reverse Proxy      (SSL termination, hides servers)
  -> Load Balancer      (spreads traffic across servers)
  -> API Gateway         (auth, rate limiting, routing to microservice)
  -> Target Microservice
```

---
