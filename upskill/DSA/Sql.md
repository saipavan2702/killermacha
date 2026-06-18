**Basics**

```SQL
-- Knowing structure of table --
Describe table_name;

-- Naming output columns similar to AS --
select last_name "Surname" from employee;

-- Join column data using characters --
select last_name || ', ' || job_id from employee;

-- Searching for values in a set using IN --
select last_name from employee where job_id in (20,50);

-- Querying through dates --
select first_name from Employee where hire_date>='01-JAN-10' and hire_date<'01-JAN-11';

-- Wildcards in sql --
select last_name from employees where last_name like '__a%';

-- Some single row functions --
round(),initcap(),length()

-- Some group functions --
max(),min(),sum(),avg(),count(*)

-- Distinct ones --
SELECT COUNT(DISTINCT manager_id) "Number of Managers" FROM employees;

--  --

```

**Intermediate**

```SQL
-- Taking prompt from user using & --
SELECT last_name, salary FROM employees WHERE salary > &sal_amt;

-- Substitution in case of null --
SELECT NVL (Value, Substitute) FROM table;

-- Some setting value cases --
SET @EnterID := 2;
select Book_Title, Auth_ID from book where Auth_ID = @EnterID;

-- Case & When instances --
update Salary set sex= case when sex='m' then 'f' else 'm' end;

-- Having clause --
SELECT manager_id, MIN(salary) FROM employees WHERE manager_id IS NOT NULL GROUP BY manager_id HAVING MIN(salary) > 6000 ORDER BY MIN(salary) DESC;

--  --
```

---

> [!ERROR] Mistake
> Running a `DELETE` statement without a `WHERE` clause in a production environment.
> ```sql
> DELETE FROM employees; -- Deletes EVERY record
> 
> ```
> 
> 

> [!CHECK] Best Practice
> Always wrap destructive operations in a **Transaction** to verify the row count before finalizing.
> ```sql
> BEGIN TRANSACTION;
> DELETE FROM employees
> WHERE employee_id = 101;
> -- Check: SELECT count(*) FROM employees;
> -- If safe: COMMIT;
> -- If error: ROLLBACK;
> ```
> 

> [!ERROR] Mistake
> Using functions on indexed columns, which prevents the database from using the index (Index Suppression).
> ```sql
> -- ❌ SLOW: Index cannot be used
> SELECT * FROM orders 
> WHERE YEAR(order_date) = 2025; 
> 
> ```
> 
> 

> [!SUCCESS] Best Practice
> Keep the indexed column "bare" so the query engine can perform an **Index Seek**.
> ```sql
> -- ✅ FAST: Index Seek enabled
> SELECT * FROM orders 
> WHERE order_date >= '2025-01-01' AND order_date < '2026-01-01';
> 
> ```
> 
> 

> [!WARNING] Mistake
> **Over-indexing**: Adding too many indexes to optimize a single query, which inadvertently slows down `INSERT`, `UPDATE`, and `DELETE` operations across the database.

> [!INFO] Practice
> Indexes are a trade-off. While they speed up `SELECT` statements, the database must update every index whenever data changes. Only index columns used frequently in:
> * `JOIN` conditions
> * `WHERE` filters
> * `ORDER BY` clauses
> 
> 

> [!TIP] The Solution
> Repeatedly Googling `LEFT` vs `RIGHT` joins. The best practice is to stick to **LEFT JOIN** consistently to keep the mental model of "Left table = Primary source".


- **Notes**
    
    % Represents zero or more characters  
    _ Represents a single character  
    [] Represents any single character within the brackets 
    ^ Represents any character not in the brackets 
    {} Represents any escaped character 


## SQL Optimization — 3 Steps

### 1. See What's Happening

```sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN users u ON u.id = o.user_id;
```
Look for: `SEQ SCAN`, `Hash Join`, temp tables → signs of ignored indexes or missing ones.

### 2. Fix the DB Layer

```sql
-- Don't do this
SELECT * FROM orders;

-- Do this
SELECT id, user_id, total FROM orders WHERE status = 'paid';
```
- Index columns used in `WHERE`, `JOIN`, `ORDER BY`
- Use **composite indexes** that match your actual filter patterns
- Don't over-index — every index slows down writes

### 3. Fix Queries & App Layer

```sql
-- Bad: query inside a loop (N+1)
SELECT * FROM users WHERE id = 1;
SELECT * FROM users WHERE id = 2; -- ...repeats

-- Good: batch it
SELECT * FROM users WHERE id IN (1, 2, 3, ...);
```
- **Eager load** associations you know you'll need
- **Heavy reads** → replica | **Writes** → primary
- Keep analytics off your primary DB




## Indexes

Here an Index is a separate data structure that maps users email values directly to the physical location of the row on disk.

```sql
-- without index: sequential scan, reads every row
SELECT * FROM users WHERE email = 'ali@example.com';
 
-- create the index
CREATE INDEX idx_users_email ON users(email);
 
-- same query now: index lookup, jumps directly to the row
SELECT * FROM users WHERE email = 'ali@example.com';

```

- Before Indexing it uses parallel sequential scan to fetch the rows.
- After Indexing it uses index lookup to fetch the rows.

Before Indexing we need to ask ourselves 4 questions:

### Is this column queried in WHERE, JOIN, or ORDER BY?

```sql
-- login
SELECT id, password_hash FROM users WHERE email = $1;
 
-- duplicate check on signup
SELECT id FROM users WHERE email = $1;
 
-- password reset
SELECT id, reset_token FROM users WHERE email = $1;
```

Email appears many times when `WHERE` is used; If the column rarely appears in filter index on it is not optimal.

### Does the column have high cardinality?

>Cardinality means column contains many unique values.

So for Email cardinality is as high as it gets coz it is unique for each user. Indexes work best  on the columns with high cardinality as each lookup  returns few rows.
Compare this to a low-cardinality column like `is_active` (boolean). Half the table is true, half is false. An index on `is_active` is nearly useless — Postgres often ignores it and does a sequential scan anyway because reading a huge chunk of the table through an index is slower than just scanning sequentially.


### Is the table large enough to benefit from an index?

At 1,000 rows a sequential scan is fast. 
At 1,000,000 rows it becomes a problem. 
At 10,000,000 rows it is a serious problem.

The rule of thumb: tables under ~10,000 rows rarely need manual indexes beyond primary key and unique constraints. 
Tables over 100,000 rows where slow queries exist — run `EXPLAIN ANALYZE` and look.


### Does a unique constraint already exist?

If you defined `email VARCHAR UNIQUE`, Postgres already created a unique index on that column automatically. We need to be careful before adding a redundant one.
```sql
-- check existing indexes on the users table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';
```


## The Write Tax

An Index is not one time cost. It occurs on every `INSERT, UPDATE, DELETE`. So when we insert a row, Postgres writes to every index that covers any column on that row. Ten Indexes on a table = ten index structures updated on every insert.

```sql
-- this one INSERT touches all indexes on the users table
INSERT INTO users (id, email, name, status, country, created_at, ...)
VALUES (...);
```


For a read-heavy table like users, this is fine trade-off. But for high-write tables like event logs, audit trails, metrics, message queues excessive indexes can degrade throughput.

>`UPDATE` is worse than `INSERT` in some cases. If we update something Postgres removes old entry and inserts a new one. Two index operations per updated row. That's double the write tax.


### Storage Bloat

Each index is a separate on-disk structure. For large tables, indexes are not small.
Let's say a user table with 10 million rows and a `VARCHAR (255)` email column - the index on email alone can cost several hundred megabytes. If we add 8 more indexes we will be compromising on gigabytes of storage.

>Indexes that fit in memory(PostgresSQL's `shared_buffers`) are fast. Indexes that do not fit in memory  need disk reads - which will cause I/O bottlenecks.

```sql
-- check how much space your indexes are actually using
SELECT
  schemaname,
  relname AS table_name,
  indexrelname AS index_name,
  idx_scan AS times_used,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND relname = 'users'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Other factors

Find unused indexes and remove them. Make sure before measuring the DB & Server has been running long enough for the stats to be meaningful. 
```sql
-- check when stats were last reset
SELECT stats_reset FROM pg_stat_bgwriter;
```

Keep the index set clean. Rather than redundant indexes on different columns we can created composite indexes that can cover multiple columns. This is better in cases where having multiple partial-overlapping indexes which causes planner to make suboptimal choices.
```sql
-- if queries commonly filter on both status AND created_at together:
-- bad: two separate indexes
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created ON users(created_at);
 
-- better: one composite index that covers the combined filter
CREATE INDEX idx_users_status_created ON users(status, created_at);
```


### Decision rule

```sql
EXPLAIN ANALYZE the slow query
  → identify Seq Scan + high rows removed
    → create a targeted index
      → EXPLAIN ANALYZE again to confirm index is used
        → monitor pg_stat_user_indexes over time
          → drop indexes with times_used near zero
```

> Measure first. Index second. Audit regularly.




##### References
https://sharafath.hashnode.dev/my-postgresql-query-went-from-57ms-to-1-4ms-on-a-1-million-row-table-i-didn-t-change-the-query-here-s-what-i-did

#ref 

#tips #sql
