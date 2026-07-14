> [!summary]
> Estimate traffic, storage, bandwidth, and compute with quick orders of magnitude before choosing architecture.

Map: [[Upskill/SysDes/System Design|System Design]]

Quick approximations for system requirements. **Don't spend more than 5 minutes on this in interviews.**

## Memory Conversion Table (MUST MEMORIZE)

| Power of 2 | Approximate Value | Power of 10 | Name | Short |
|------------|-------------------|-------------|------|-------|
| 10 | 1 Thousand | 3 | Kilobyte | KB |
| 20 | 1 Million | 6 | Megabyte | MB |
| 30 | 1 Billion | 9 | Gigabyte | GB |
| 40 | 1 Trillion | 12 | Terabyte | TB |
| 50 | 1 Quadrillion | 15 | Petabyte | PB |

## Example: Twitter Estimation

**Given:**
- 100 million Daily Active Users (DAU)
- 10 tweets per user per day
- 1 user reads 1,000 tweets per day

### 1. Load Estimation

**Writes (Tweet creation):**
```
100M users × 10 tweets = 1 billion tweets/day
```

**Reads (Tweet viewing):**
```
100M users × 1,000 tweets = 100 billion reads/day
```

### 2. Storage Estimation

**Assumptions:**
- 10% of tweets have photos
- 1 tweet = 200 characters × 2 bytes = 400 bytes ≈ 500 bytes
- 1 photo = 2 MB

**Tweets with photos:**
```
10% of 1 billion = 100 million tweets with photos
```

**Daily storage:**
```
Text:   500 bytes × 1 billion = 500 GB ≈ 1 TB
Photos: 2 MB × 100 million = 200 TB ≈ 1 PB

Total: ~1 PB/day (ignoring 1TB as negligible)
```

### 3. Resource Estimation

**Assumptions:**
- 10,000 requests/second
- Each request takes 10ms CPU time

**CPU time needed:**
```
10,000 rps × 10ms = 100,000 ms/second of CPU time
```

**CPU cores required:**
```
Each core handles 1,000 ms/second
Total cores needed: 100,000 ÷ 1,000 = 100 cores
```

**Servers needed:**
```
Each server has 4 cores
Total servers: 100 ÷ 4 = 25 servers
```

---

## Related

- [[Upskill/SysDes/HLD/Scaling Fundamentals|Scaling Fundamentals]]
- [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]]
