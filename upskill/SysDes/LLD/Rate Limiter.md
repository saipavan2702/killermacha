Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/LLD/LRU and LFU Cache|LRU and LFU Cache]], [[Upskill/SysDes/HLD/Caching|Caching]]

Let's say a in a twitch stream with many viewers and one is spamming a lot, without a rate limiter he can easily dominate the stream. So we rate limit his messages so that each user get's fair chance & attention.

That's why a rate limiter is needed to control traffic for our service APIs. There are many type of rate limiters:
- Fixed windows
- Sliding windows
- Token buckets

Before going into the details, let's think how production handles usage of rate limiters and how we can explain it

First we can introduce a fixed counter for api hit, but will this work in production? yes and no as it fails in distributed systems since the counter is not shared each client can hit multiple serves and we don't know which server it hit and therefore traffic explodes. So we take a shared counter(prominently redis) to track the number of requests made by a client and all servers share the same redis counter fofr a single user.

So, Now moving to types of rate limiters:
## Fixed windows
A set number of requests are allowed to be made within a predefined time window. Requests counter resets to zero at the start of each window.

Pros
- Simple and easy to implement
- Predictable reset times for users

Cons
- Boundary burst (2x) at edge of window (100 at 11:59:59 and 100 at 12:00:01)
- Less accurate under bursty traffic than sliding window

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


---

## References
https://www.youtube.com/watch?v=7y0KWxaUn-E&list=PLYPO3T7Sl63u7uLLpiKCMXnRjeFIhUAvk
https://crackingwalnuts.com/low-level-design/rate-limiter
https://rdiachenko.com/series/rate-limiting/
https://freedium-mirror.cfd/https://codefarm0.medium.com/system-design-interview-how-would-you-implement-an-api-rate-limiter-in-a-distributed-environment-6a79f9208305
https://blog.cloudflare.com/counting-things-a-lot-of-different-things/
