Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/LLD/LRU and LFU Cache|LRU and LFU Cache]], [[Upskill/SysDes/HLD/Caching|Caching]]

Let's say a in a twitch stream with many viewers and one is spamming a lot, without a rate limiter he can easily dominate the stream. So we rate limit his messages so that each user get's fair chance & attention.

That's why a rate limiter is needed to control traffic for our service APIs. There are many type of rate limiters:
- Fixed windows
- Sliding windows
- Token buckets

Before going into the details, let's think how production handles usage of rate limiters and how we can explain it

First we can introduce a fixed counter for api hit, but will this work in production? yes and no as it fails in distributed systems since the counter is not shared each client can hit multiple serves and we don't know which server it hit and therefore traffic explodes. So we take a shared counter(prominently redis) to track the number of requests made by a client and all servers share the same redis counter for a single user.

So, Now moving to types of rate limiters:
## Fixed windows
A set number of requests are allowed to be made within a predefined time window. Requests counter resets to zero at the start of each window.

Pros
- Simple and easy to implement
- Predictable reset times for users

Cons
- Boundary burst (2x) at edge of window (100 at 11:59:59 and 100 at 12:00:01) and also not a controlled burst
- Less accurate under bursty traffic than sliding window
- Weak long term average rate - basically "how many requests per second can you keep making forever"

## Sliding window Log
Here a window keeps track of the number of requests made and instead of refreshing the capacity all at once, window refills it one request at a time. The window continuously adds the requests for the user to use based on the refill rate.

Pros
- Exact, accurate count — no approximation
- Fair to users since it's based on actual timestamps, not estimates
- Smooths the distribution of request traffic
- Well-suited for high loads

Cons
- Storing a timestamp per request is expensive for memory
- Summing timestamps across a distributed cluster is computationally costly
- Doesn't scale well for large traffic bursts

## Sliding window counter

This is a memory optimized version of the [[#Sliding window Log|Sliding window log]] method:
```
count = (prevWindowCount * prevWindowWeight) + currentWindowCount

count = 100 * 0.8 + 15 = 95 requests

100 - number of requests in the previous fixed window
0.8 - weight of the previous window (since the sliding window covers 20%
      of the current fixed window and 80% of the previous one)
15  - number of requests in the current fixed window
```

**Pros**
- Smooths request traffic, unlike fixed window (no 2x boundary burst)
- Far cheaper in memory/compute than **sliding window log** (2 counters vs. storing every timestamp)
- Scales better across distributed clusters than **sliding window log**
- More real-time adaptive than **fixed window**
- Avoids starvation issue seen in **leaky bucket** by weighting recent activity more
- More strict/consistent within any rolling window than **token bucket**, which allows deliberate bursts

**Cons**
- Only approximate, unlike **sliding window log** (assumes even spread of previous window's requests)
- More complex to implement/debug than **fixed window**
- Less predictable reset behavior for users than **fixed window**
- Needs careful time-sync handling in distributed systems, same concern as **sliding window log**
- Doesn't support controlled traffic bursts the way **token bucket** does (no burst allowance beyond the limit)

## Token Bucket

This method uses a bucket which has some set of tokens to use/allow requests, once it runs out of tokens, it can't process requests.
Tokens are added at a consistent rate, and their count never exceeds the bucket’s capacity.

Pros
- Allows controlled bursts (up to bucket size) while enforcing a long-term average rate
- More flexible for users than fixed window — supports traffic spikes within a set range
- One mechanism handles both burst capacity and average rate (no need for two separate limiters)
- Can mimic fixed window or sliding window behavior by tuning refill rate/interval

Cons
- Harder to convey limits and refill times to users than fixed window
- Needs tuning of two parameters (bucket size + refill rate) to get right
- Still needs a shared store (Redis) in distributed systems, same as the others


>[!tip] 
>The controlled bursts are useful in case of heavy-sync of whatsapp messages after some 1hr of inactivity or any other syncing which needs some reasonable amount of api requests to be made.

## Rate Limiting Algorithms — Comparison

| Attribute                    | Fixed Window                       | Sliding Window Log            | Sliding Window Counter                     | Token Bucket                                          |
| ---------------------------- | ---------------------------------- | ----------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| **Tracking method**          | Single counter, reset per interval | Timestamp per request (deque) | Current + previous window counts, weighted | Token count + last refill timestamp                   |
| **Memory cost**              | O(1)                               | O(n) per user                 | O(1)                                       | O(1)                                                  |
| **Boundary/burst issue**     | Bad (2x limit possible at edges)   | None (exact)                  | Small approximation error (~0.003%)        | N/A — bursts allowed by design                        |
| **Controlled bursts**        | No                                 | No                            | No                                         | Yes (core feature)                                    |
| **Long-term rate guarantee** | Weak                               | Strong (exact)                | Strong (near-exact)                        | Strong                                                |
| **Compute cost/request**     | Trivial                            | Expensive                     | Cheap                                      | Cheap                                                 |
| **Distributed system fit**   | Needs shared counter (Redis)       | Poor at scale                 | Good — scales well                         | Good — small fixed state, Redis + Lua friendly        |
| **Predictability for user**  | High                               | Low                           | Medium-low                                 | Low-medium                                            |
| **Real-world example**       | GitHub API (5000/hr)               | Rarely used in prod as-is     | Cloudflare                                 | Stripe (500 burst, 100/s sustained), OpenAI free tier |


## Cross questions

### 1. Redis Implementation — How do you implement Token Bucket in Redis?

The interviewer's point: Redis gives you two things you need — shared state (all servers see the same counter) and atomic operations (so concurrent requests don't corrupt it).

Store per user:
```
key: rate_limit:{userId}
tokensRemaining: <float>
lastRefillTimestamp: <epoch ms>
```

On each request:
1. Calculate how many tokens should've been added since `lastRefillTimestamp` (elapsed time × refill rate)
2. Add those tokens to the bucket (capped at max capacity)
3. If ≥1 token available → consume one, allow request
4. Else → reject

**Lua script (runs atomically inside Redis):**
```lua
-- KEYS[1] = rate_limit:{userId}
-- ARGV[1] = capacity, ARGV[2] = refillRate (tokens/sec), ARGV[3] = now (ms)

local tokens_key = KEYS[1] .. ":tokens"
local ts_key = KEYS[1] .. ":ts"

local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local tokens = tonumber(redis.call("GET", tokens_key)) or capacity
local last_ts = tonumber(redis.call("GET", ts_key)) or now

-- refill based on elapsed time
local elapsed = math.max(0, now - last_ts) / 1000
tokens = math.min(capacity, tokens + elapsed * refill_rate)

if tokens < 1 then
    redis.call("SET", tokens_key, tokens)
    redis.call("SET", ts_key, now)
    return 0  -- rejected
else
    tokens = tokens - 1
    redis.call("SET", tokens_key, tokens)
    redis.call("SET", ts_key, now)
    return 1  -- allowed
end
```

Java side, calling it via Jedis/Lettuce:
```java
Long allowed = (Long) jedis.eval(luaScript,
    Collections.singletonList("rate_limit:" + userId),
    Arrays.asList(String.valueOf(capacity), String.valueOf(refillRate), String.valueOf(now)));

boolean isAllowed = allowed == 1;
```

### 2. Why Lua?

Without a Lua script, a naive implementation would do three separate round trips:
```
GET tokens
compute new value
SET tokens
```
This is a read-modify-write with a race condition: two concurrent requests can both read the same `tokensRemaining`, both decide "yes, allow," and both write back the same decremented value — effectively letting one extra request through per race.

Wrapping it in a Lua script forces Redis to execute the entire read-compute-write as a single atomic step, since Redis runs Lua scripts single-threaded to completion — no other command interleaves.

### 3. The Hot Key Problem

If one API key/user generates 50,000 req/sec, every single request hits the *same Redis key*. Even though Redis is fast, one key becomes a serialization point — all those requests queue up on that one key, and Redis (or that shard, if clustered) becomes the bottleneck.

Mitigations mentioned:

- **Sharding** — split one logical counter into N sub-keys (e.g. `rate_limit:{userId}:0` … `:N-1`), route each request to `hash(requestId) % N`, and check against `limit/N` per shard. Reduces contention on any single key.
- **Local token caches** — each app server keeps a small local token allowance (e.g., a mini bucket of 10 tokens) refilled periodically from Redis in batch, instead of hitting Redis on every request. Trades some precision for far fewer Redis calls.
```java
// simplified local cache idea
class LocalTokenCache {
    private final AtomicInteger localTokens = new AtomicInteger(0);

    boolean tryConsume() {
        if (localTokens.get() > 0) {
            return localTokens.decrementAndGet() >= 0;
        }
        // fall back to Redis to refill local batch, e.g. +20 tokens
        return refillFromRedisAndConsume();
    }
}
```
- **Hierarchical rate limiting** — enforce a coarse limit locally per server first (cheap, approximate), and a precise limit centrally in Redis as backstop.
- **Gateway-level enforcement** — see next point; stopping the traffic before it fans out reduces how many places generate load on Redis.

### 4. Where Should Rate Limiting Live?

Question: should every microservice enforce its own rate limit, or should it be centralized?

Recommendation: enforce at the **API Gateway** (the edge), not in each downstream microservice.

Why:
- Abusive/over-limit traffic gets rejected before it consumes any internal compute, DB connections, or bandwidth
- One place to configure/monitor limits instead of N services each reinventing it
- Downstream services don't need to know about rate-limiting logic at all

```
Client → [API Gateway: rate limiter here] → Service A
                                          → Service B
                                          → Service C
```
If a request is over the limit, the gateway returns `429 Too Many Requests` immediately — Services A/B/C never even see it.

### 5. Multi-Tenant Limits

Question: different pricing tiers need different limits (Free: 100/min, Pro: 1000/min, Enterprise: unlimited). How do you support that without rewriting the algorithm per tier?

Answer: keep the same algorithm, just parameterize bucket config per plan and look it up per user.

```java
record PlanConfig(int capacity, double refillRatePerSec) {}

Map<String, PlanConfig> planConfigs = Map.of(
    "FREE",       new PlanConfig(100, 100.0 / 60),   // 100 req/min
    "PRO",        new PlanConfig(1000, 1000.0 / 60),  // 1000 req/min
    "ENTERPRISE", new PlanConfig(Integer.MAX_VALUE, Double.MAX_VALUE)
);

PlanConfig config = planConfigs.get(user.getPlan());
boolean allowed = tokenBucketCheck(user.getId(), config.capacity(), config.refillRatePerSec());
```
The Lua script from earlier already takes `capacity` and `refillRate` as arguments — so this is just a lookup before the call, no algorithm change needed.

### 6. Redis Failure — Fail Open vs Fail Closed

Question: what happens to your rate limiter when Redis itself is down/unreachable?

Two options:

**Fail closed** — reject all requests when Redis is unreachable. Protects backend systems from unlimited traffic, but takes your API down entirely during a Redis outage (availability hit).

**Fail open** — allow all requests through when Redis is unreachable. Keeps the API available, but temporarily removes protection against abuse.

The recommendation for customer-facing APIs: fail open for a short period — reasoning being that an outage caused by the rate limiter itself is usually worse than temporarily allowing extra traffic through.

```java
boolean allowed;
try {
    allowed = tokenBucketCheck(userId, capacity, refillRate); // Redis call
} catch (RedisConnectionException e) {
    log.warn("Redis unavailable, failing open for rate limiter");
    allowed = true; // fail open
}
```

### 7. Multi-Region Challenge

Question: with servers in US-East, Europe, and Asia, how does the rate limiter stay accurate?

This is a consistency-vs-latency tradeoff:

- **Global counter** (single Redis instance/cluster all regions call) → perfectly accurate limit, but every request pays cross-region network latency to check/update it.
- **Regional counters** (each region has its own Redis, own local counter) → fast, low latency, but a user could get up to `limit × number_of_regions` total requests if they spread traffic across regions, since each region's counter is unaware of the others.

The stated tradeoff: many systems accept slight inaccuracies in exchange for lower latency — i.e., most production systems pick regional counters and accept the imprecision rather than pay the latency cost of a single global source of truth.

```
Option A: Global Redis
Client (any region) → Global Redis Cluster (accurate, high latency)

Option B: Regional Redis
Client (US) → US Redis (fast, but blind to EU/Asia traffic from same user)
Client (EU) → EU Redis
Client (Asia) → Asia Redis
```

Some systems compromise with periodic async reconciliation (regional counters sync/merge in the background) — approximate in real time, self-correcting over time — though the article doesn't go into that implementation detail.


>[!tip]
>From bot protection we can use the following techniques:
>
>- Honeypot (adding hidden attributes so that only bots can/will fill and can easily reject the submission; For  Example: 
>  `<input id="email" name="email" size="40" class="honeypot" tabindex="-1" aria-hidden="true" autocomplete="off">` )
>- Captcha (I prefer Cloudflare Turnstile)
>- Timer (set the timer which takes minimum time by a human to fill out form)

---

## References
https://github.com/saipavan2702/LLD
https://www.youtube.com/watch?v=7y0KWxaUn-E&list=PLYPO3T7Sl63u7uLLpiKCMXnRjeFIhUAvk
https://crackingwalnuts.com/low-level-design/rate-limiter
https://rdiachenko.com/series/rate-limiting/
https://freedium-mirror.cfd/https://codefarm0.medium.com/system-design-interview-how-would-you-implement-an-api-rate-limiter-in-a-distributed-environment-6a79f9208305
https://blog.cloudflare.com/counting-things-a-lot-of-different-things/
