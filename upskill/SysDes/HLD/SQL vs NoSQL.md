# SQL vs NoSQL

> [!summary]
> Choose a database from data shape, consistency needs, query patterns, and scale rather than from popularity.

## SQL Databases

**Structure:** Tables with predefined schema

```sql
-- Schema MUST be defined first
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    created_at TIMESTAMP
);

-- Then insert data
INSERT INTO users VALUES (1, 'Alice', 'alice@email.com', NOW());
```

**Properties:**
- ✅ ACID compliance (data integrity)
- ✅ Strong consistency
- ✅ Complex queries with JOINs
- ❌ Primarily vertical scaling

**Examples:** MySQL, PostgreSQL, Oracle, SQL Server

## NoSQL Databases

**Four Types:**

### 1. Document-Based (MongoDB)
```javascript
// Flexible schema - add fields anytime
db.users.insertOne({
    id: 1,
    name: "Alice",
    email: "alice@email.com",
    // Can add new field not in "schema"
    preferences: { theme: "dark", language: "en" }
});
```

### 2. Key-Value (Redis, DynamoDB)
```python
# Simple key-value pairs
cache.set("user:1", {"name": "Alice", "email": "alice@email.com"})
cache.get("user:1")  # Returns the object
```

### 3. Column-Family (Cassandra)
```
Row Key: user_1
Columns: name="Alice", email="alice@email.com", age=30
```

### 4. Graph (Neo4j)
```cypher
// Perfect for relationships
CREATE (alice:Person {name: 'Alice'})
CREATE (bob:Person {name: 'Bob'})
CREATE (alice)-[:FRIENDS_WITH]->(bob)
```

**Properties:**
- ✅ Flexible schema
- ✅ Horizontal scaling (sharding)
- ✅ High availability
- ❌ Eventual consistency (usually)
- ❌ Limited JOIN support

## When to Use Which?

| Use Case | Database Type | Example |
|----------|---------------|---------|
| Structured data with fixed schema | SQL | Customer accounts, invoices |
| Unstructured/flexible data | NoSQL | Product reviews, recommendations |
| Data integrity critical | SQL | Banking transactions, payments |
| High availability & scalability | NoSQL | Social media posts, real-time data |
| Complex queries & analytics | SQL | Business reports, data warehousing |
| Large data volumes (petabytes) | NoSQL | IoT sensor data, logs |

**Real E-commerce Example:**

```python
# SQL for critical data
customer_accounts → PostgreSQL
orders → PostgreSQL
payments → PostgreSQL

# NoSQL for flexible/high-volume data
product_reviews → MongoDB
product_recommendations → MongoDB
user_sessions → Redis
real_time_inventory_tracking → Cassandra
```

---
