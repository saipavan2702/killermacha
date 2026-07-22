Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/LLD/Rate Limiter|Rate Limiter LLD]], [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]], [[Upskill/SysDes/HLD/Caching|Caching]]

## What It Does

Rate limiting protects a system by controlling how many requests a user, IP, client, or service can make in a time window.

## Why It Matters

- Prevents abuse and accidental overload
- Protects expensive APIs and downstream services
- Keeps traffic fair between users
- Gives predictable failure instead of full system collapse

## Common Algorithms

- **Fixed Window:** simple counter per window, but can spike at boundaries.
- **Sliding Window:** smoother than fixed window, more accurate.
- **Token Bucket:** allows bursts while enforcing average rate.
- **Leaky Bucket:** smooths requests at a constant drain rate.

## Where It Lives

- API Gateway
- Reverse Proxy
- Load Balancer
- Application middleware
- Edge/CDN layer
