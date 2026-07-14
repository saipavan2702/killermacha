> [!summary]
> A repeatable interview and architecture process: clarify requirements, estimate scale, divide the system, explain trade-offs, and validate operations.

Map: [[Upskill/SysDes/System Design|System Design]]

## Step-by-Step Approach

### Step 1: Understand Requirements (5-10 minutes)

```
Ask clarifying questions:
1. What are the core features?
2. What is the expected scale (users, data volume)?
3. What are the performance requirements?
4. Any specific constraints (budget, technology, region)?
```

**Example: Design Twitter**

```
Functional Requirements:
- Post tweets (280 characters)
- Follow/unfollow users
- View timeline (tweets from people you follow)
- Like/retweet tweets
- Search tweets

Non-Functional Requirements:
- 100 million DAU (Daily Active Users)
- Low latency (<200ms)
- High availability (99.9% uptime)
- Eventually consistent (acceptable for likes)
```

### Step 2: Break Down Into Sub-Problems

```
Twitter = Multiple Sub-Systems:
1. Tweet Creation Service
2. Timeline Service
3. Follow/Unfollow Service
4. Search Service
5. Notification Service
```

### Step 3: Design Each Sub-System

**For EACH sub-system, consider 4 things:**

```
1. DATABASE: What data to store? SQL or NoSQL?
2. CACHING: What to cache? Where?
3. SCALING: How to handle millions of requests?
4. COMMUNICATION: Sync or Async? REST or Message Queue?
```

## Checklist

**When solving ANY system design problem:**

```
✅ 1. CLARIFY REQUIREMENTS
   - Functional requirements (what features?)
   - Non-functional requirements (scale, performance?)
   - Constraints (budget, technology, compliance?)

✅ 2. ESTIMATE SCALE
   - Users: DAU, MAU
   - Data: Writes/day, Reads/day, Storage
   - Resources: Servers needed, Bandwidth

✅ 3. DEFINE API
   - RESTful endpoints
   - Request/response formats
   - Authentication/authorization

✅ 4. DATABASE DESIGN
   - Schema design
   - SQL vs NoSQL choice
   - Indexing strategy
   - Partitioning/sharding if needed

✅ 5. HIGH-LEVEL DESIGN
   - Draw component diagram
   - Show data flow
   - Identify bottlenecks

✅ 6. DEEP DIVE
   For each component:
   - Database choice & schema
   - Caching strategy
   - Scaling approach
   - Communication pattern

✅ 7. TRADE-OFFS
   - Consistency vs Availability
   - Latency vs Throughput
   - Complexity vs Maintainability
   - Cost vs Performance

✅ 8. BOTTLENECKS & SOLUTIONS
   - Identify single points of failure
   - Plan for failures
   - Discuss monitoring

✅ 9. OPTIONAL ENHANCEMENTS
   - Analytics
   - A/B testing
   - Feature flags
   - Multi-region deployment
```

---

## Final Tips

## Interview-Specific Advice

```javascript
// DO's
const interviewDos = [
    'Ask clarifying questions upfront',
    'Think out loud - explain your reasoning',
    'Start with a simple design, then iterate',
    'Draw diagrams - visual helps interviewer follow',
    'Discuss trade-offs explicitly',
    'Consider edge cases and failures',
    'Be honest if you don\'t know something',
    'Show breadth AND depth'
];

// DON'Ts
const interviewDonts = [
    'Don\'t jump to solutions without clarifying',
    'Don\'t over-engineer for stated requirements',
    'Don\'t ignore interviewer hints/questions',
    'Don\'t get stuck on minor details',
    'Don\'t forget about non-functional requirements',
    'Don\'t assume infinite resources/budget'
];
```

## Common Patterns

```javascript
// Pattern library to remember

const commonPatterns = {

    'Read Heavy System': {
        solutions: [
            'Master-Slave architecture',
            'Aggressive caching (Redis)',
            'CDN for static content',
            'Read replicas geographically distributed'
        ],
        examples: ['Social media feeds', 'News sites', 'E-commerce product catalogs']
    },

    'Write Heavy System': {
        solutions: [
            'Database sharding',
            'Write-optimized NoSQL (Cassandra)',
            'Async processing with message queues',
            'Batch writes'
        ],
        examples: ['Analytics', 'Logging systems', 'IoT data ingestion']
    },

    'Low Latency Requirements': {
        solutions: [
            'In-memory databases (Redis)',
            'Edge computing/CDN',
            'Pre-computation',
            'WebSockets for real-time'
        ],
        examples: ['Gaming', 'Trading platforms', 'Real-time chat']
    },

    'High Availability Required': {
        solutions: [
            'Multi-region deployment',
            'Redundant systems',
            'Automatic failover',
            'Circuit breakers'
        ],
        examples: ['Payment systems', 'Healthcare', 'Critical infrastructure']
    }
};
```

---

**Key Takeaways:**
1. Always start simple, then scale based on actual needs
2. Every design decision is a trade-off - understand and articulate them
3. Practice drawing diagrams and explaining your thinking
4. Build real projects to internalize these concepts
5. Stay curious and keep learning from production systems

**Next Steps:**
- Practice with real interview questions (Design YouTube, Uber, WhatsApp, etc.)
- Build a project implementing these concepts
- Read about how real companies solve these problems (engineering blogs)
- Code your own versions of Redis, Load Balancer, etc. for deep understanding


>[!info]
>### BackPressure
This is a common pattern where a system needs to handle more requests than the receiving system can process in real-time.
In software engineering it is a mechanism where a consumer signals a producer to slow down data transmission when the system is overwhelmed.
This can be mitigated or tackled by doing intelligent buffer management.
>
>### Thundering Herd
This occurs when multiple consumers try to access a resource at the same time from DB when cache/server gets expires/crashes. DB cannot handle such large requests coming at once.
This can be addressed by using
>- cache stampede prevention
>- probabilistic early expiration
>- request coalescing
>
>### Temporal Coupling
This happens when two systems are dependent on each other in a way and things should happen in a specific order but nothing in the code enforces it.
So we need to design API in such a way that it cannot call things out of order if called properly handled.
>
>### Essential Complexity vs. Accidental Complexity
Essential Complexity is inherent to the problem. In Building payment system we handle failed transactions, retrying, reconciliation.
But Accidental Complexity is everything else sometimes you add code to the already existing 500-lines of code instead of refactoring it and optimising it.


>[!tip]
>
>How data communication happens in different steps
>![[Pasted image 20260601002039.png|713]]

## Related

- [[Upskill/SysDes/Case Studies/Designing Twitter|Designing Twitter]]
