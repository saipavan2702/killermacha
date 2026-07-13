# Rate Limiter

Let's say a in a twitch stream with many viewers and one is spamming a lot, without a rate limiter he can easily dominate the stream. So we rate limit his messages so that each user get's fair chance & attention.

That's why a rate limiter is needed to control traffic for our service APIs. There are many type of rate limiters:
- Fixed windows
- Sliding windows
- Token buckets

Let's go through each one,
### Fixed windows
A set number of requests are allowed to be made within a predefined time window. Requests counter resets to zero at the start of each window.

Pros
- Simple and easy to implement
Cons
- Boundary burst(2x) at the end of window (100 at 11:59:59 plus 100 at 12:00:01)

```java

```



## Sliding windows
Here a window keeps track of the number of requests made and instead of refreshing the capacity all at once, window refills it one request at a time.

Pros
- Smooths the distribution of request traffic
- Well-suited for high loads
Cons
- Storing time stamps for each request is expensive for memory.

```java

```

