# SysDes

## Start Here

- [[Upskill/SysDes/Core|Core]]
- [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]]
- [[Upskill/SysDes/HLD/Caching|Caching]]
- [[Upskill/SysDes/HLD/Message Queues|Message Queues]]
- [[Upskill/SysDes/HLD/Database Sharding|Database Sharding]]
- [[Upskill/SysDes/HLD/Rate Limiting|Rate Limiting]]
- [[Upskill/SysDes/Core#How to Solve Any System Design Problem|How to Solve Any System Design Problem]]
- [[Upskill/SysDes/LLD/Rate Limiter|Rate Limiter]]
- [[Upskill/SysDes/LLD/LRU & LFU cache|LRU & LFU Cache]]

## Core Topics To Split Later

- Blob Storage & CDN
- Pub/Sub
- Event-Driven Architecture
- Distributed Systems
- Proxy Servers

## Recently Updated

```dataview
TABLE WITHOUT ID
  file.link AS Note,
  file.folder AS Area,
  dateformat(file.mtime, "MMM d") AS Updated
FROM "Upskill/SysDes"
WHERE file.name != "Index"
SORT file.mtime DESC
LIMIT 12
```

---

## References

> [!info] Source trail
> Broad system-design maps and courses that support the whole section.

- [Karan Pratap Singh System Design](https://www.karanpratapsingh.com/courses/system-design) - System design course.
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - Broad HLD reference.
- [System Design Ultimatum](https://github.com/Prakash-sa/system-design-ultimatum) - Broad HLD reference.
