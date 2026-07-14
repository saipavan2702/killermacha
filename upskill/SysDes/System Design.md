> [!summary]
> Design systems by starting with requirements and scale, then choosing data, communication, and reliability patterns whose trade-offs fit the problem.

## Start Here

- [[Upskill/SysDes/HLD/Scaling Fundamentals|Scaling Fundamentals]]
- [[Upskill/SysDes/HLD/Capacity Estimation|Capacity Estimation]]
- [[Upskill/SysDes/System Design Process|System Design Process]]
- [[Upskill/SysDes/Case Studies/Designing Twitter|Designing Twitter]]

## Scale and Reliability

- [[Upskill/SysDes/HLD/Load Balancing|Load Balancing]]
- [[Upskill/SysDes/HLD/Caching|Caching]]
- [[Upskill/SysDes/HLD/Consistent Hashing|Consistent Hashing]]
- [[Upskill/SysDes/HLD/Replication and Recovery|Replication and Recovery]]
- [[Upskill/SysDes/HLD/Proxy Servers|Proxy Servers]]
- [[Upskill/SysDes/HLD/Blob Storage and CDN|Blob Storage and CDN]]
- [[Upskill/SysDes/HLD/Rate Limiting|Rate Limiting]]

## Data and Consistency

- [[Upskill/SysDes/HLD/CAP Theorem|CAP Theorem]]
- [[Upskill/SysDes/HLD/Consistency Models|Consistency Models]]
- [[Upskill/SysDes/HLD/Database Scaling|Database Scaling]]
- [[Upskill/SysDes/HLD/Database Sharding|Database Sharding]]
- [[Upskill/SysDes/HLD/SQL vs NoSQL|SQL vs NoSQL]]

## Services and Communication

- [[Upskill/SysDes/HLD/Microservices|Microservices]]
- [[Upskill/SysDes/HLD/Message Queues|Message Queues]]
- [[Upskill/SysDes/HLD/Publish-Subscribe|Publish-Subscribe]]
- [[Upskill/SysDes/HLD/Event-Driven Architecture|Event-Driven Architecture]]
- [[Upskill/SysDes/HLD/Distributed Systems|Distributed Systems]]
- [[Upskill/SysDes/HLD/Big Data Systems|Big Data Systems]]

## APIs

- [[Upskill/SysDes/HLD/API Build/Auth Methods/Authentication Overview|Authentication Methods]]
- [[Upskill/SysDes/HLD/API Build/Error Handling/Error Handling|Error Handling]]
- [[Upskill/SysDes/HLD/API Build/Pagination|Pagination]]
- [[Upskill/SysDes/HLD/API Build/gRPC vs REST vs GraphQL vs SOAP|API Styles]]

## Low-Level Design

- [[Upskill/SysDes/LLD/Object-Oriented Programming|Object-Oriented Programming]]
- [[Upskill/SysDes/LLD/SOLID Principles|SOLID Principles]]
- [[Upskill/SysDes/LLD/Inheritance vs Composition|Inheritance vs Composition]]
- [[Upskill/SysDes/LLD/Design Patterns/Design Patterns|Design Patterns]]
- [[Upskill/SysDes/LLD/Examples|LLD Examples]]
- [[Upskill/SysDes/LLD/Rate Limiter|Rate Limiter]]
- [[Upskill/SysDes/LLD/LRU and LFU Cache|LRU & LFU Cache]]

## Recently Updated

```dataview
TABLE WITHOUT ID
  file.link AS Note,
  file.folder AS Area,
  dateformat(file.mtime, "MMM d") AS Updated
FROM "Upskill/SysDes"
WHERE file.path != this.file.path
SORT file.mtime DESC
LIMIT 12
```

---

## References

- [Karan Pratap Singh System Design](https://www.karanpratapsingh.com/courses/system-design) - System design course.
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - Broad HLD reference.
- [System Design Ultimatum](https://github.com/Prakash-sa/system-design-ultimatum) - Broad HLD reference.
