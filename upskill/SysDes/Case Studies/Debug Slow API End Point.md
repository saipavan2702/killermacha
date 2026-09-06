**Core loop: Measure → Isolate → Fix.**
Never skip straight to a fix — half the "fixes" people reach for (add a cache, add a server) just hide the real bug.

---

## Step 0 — Define "slow"

Before touching anything, answer three questions. Write the answers down — they decide which step you go to next.

1. **How slow, exactly?** 500ms slow and 5s slow are different bugs. Get a real p95/p99 number, not a feeling.
2. **All endpoints, or just some?** All endpoints pointing slow usually means infra/network/DB-wide issue. One endpoint slow means it's local to that code path.
3. **Always slow, or sometimes slow?** Always = structural (bad query, bad algorithm). Sometimes = data-shape dependent (one tenant/user has 100x the data) or load dependent (only slow under traffic).

> If you can't answer these three yet, that *is* your first task — reproduce the call with a specific user/payload and get a number before guessing.

---

## Step 1 — Look at your metrics/APM first

Don't dive into code — check **Datadog / Grafana / New Relic / Sentry** (whatever you have) for the endpoint's trace. It usually tells you outright which layer is eating the time:

- Mostly DB time → go to Step 2
- Mostly app/CPU time → go to Step 3
- Mostly waiting on another service → go to Step 4
- Mostly network/transfer time → go to Step 5
- Nothing looks wrong but it's still slow under load → go to Step 6

If you don't have APM, get the same signal manually:

| Goal | Java / Spring Boot | Node.js | Go |
|---|---|---|---|
| Per-request timing breakdown | Spring Boot Actuator + Micrometer (`/actuator/metrics`, `/actuator/httptrace`) | `clinic.js doctor` | `net/http/pprof` |
| CPU flamegraph | **async-profiler** or Java Flight Recorder (`JFR`), viewed in **JProfiler**/VisualVM | `0x` or `clinic flame` | `pprof` (`go tool pprof`) |
| SQL query log / count | `spring.jpa.show-sql=true`, or **p6spy** / **datasource-proxy** for a clean log with timings | `debug` flag on your ORM (e.g. Prisma/Sequelize query log) | `sqlx` logging or a query-logging middleware |

This replaces the Ruby `rack-mini-profiler` step from the original article — same idea, JVM tooling.

---

## Step 2 — Database (usually the culprit, 60–90% of the time)

Two separate problems, two separate fixes:

### A. Too many queries (N+1)
**Symptom:** one API call fires dozens/hundreds of near-identical queries.
**Find it:**
- Turn on SQL logging (`spring.jpa.show-sql=true` + `hibernate.generate_statistics=true`) and count queries per request.
- Or use **Hibernate's statement counter** in a test: assert query count doesn't exceed N for a given endpoint (same idea as Ruby's `bullet` gem, just done as an assertion instead of a live watcher).

**Fix:** eager-fetch the association instead of lazy-loading it in a loop.
```java
// Before — N+1: one query per order to fetch its customer
List<Order> orders = orderRepository.findAll();

// After — one query with a JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.customer JOIN FETCH o.lineItems")
List<Order> findAllWithDetails();
```

### B. One query is just slow
**Find it:** copy the slow query into your DB client and run:
```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT ...
```
Read four things:
- Top operation: `Seq Scan` on a big table = red flag, `Index Scan` = good.
- Estimated vs actual row count — big divergence = stale stats or bad plan.
- `Buffers: shared read=...` — high read = not hitting cache.
- Total execution time at the bottom.

**Common causes & fixes:**
- Missing index on a filtered/joined column → add index.
- `SELECT *` pulling columns you don't need → project only needed columns (`SELECT o.id, o.total FROM ...` or a DTO projection in JPA).
- Filtering on a function result (`LOWER(email) = ?`) with no matching index → add a functional index, or store a pre-lowercased column.
- Connection pool exhausted → tune HikariCP (`maximum-pool-size`, `connection-timeout`) and check for leaked/unclosed connections.

**Find the worst offenders system-wide:** if you don't know *which* endpoint is slow yet, query `pg_stat_statements` (Postgres) — it ranks every query by total time actually spent, which beats guessing:
```sql
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

---

## Step 3 — Backend code (if DB is fine but CPU/app time is high)

Look at the flamegraph from Step 1. Usual suspects:

- **Heavy in-memory loops** — `.stream().map().filter()` chains over thousands of objects where a DB query/projection should've done the filtering.
- **Over-eager serialization** — a JSON response mapper walking a huge object graph. Fix: leaner DTO, narrower scope, exclude unused fields.
- **Blocking I/O on the request thread** — a call that blocks a thread pool worker unnecessarily.
- **Synchronous long-running work** on the request path (report generation, image processing, etc.)

**Fixes:**
- Move CPU-heavy or slow work off the request thread: `@Async`, a dedicated `ExecutorService`, or a real background job (Spring Batch, a queue consumer via Kafka/RabbitMQ/SQS).
- For I/O-bound code at scale, consider non-blocking (Spring WebFlux / reactive) — but only if profiling actually shows thread starvation, not by default.

---

## Step 4 — External API calls (if you're waiting on another service)

**Symptom:** your endpoint's floor time roughly matches a downstream service's latency.

**Fixes:**
- **Take it off the critical path** — same trick as the DB fix, just for a third-party call:
```java
// Before — blocks the response on the payment gateway
@PostMapping
public ResponseEntity<Order> create(@RequestBody OrderRequest req) {
    Order order = orderService.create(req);
    paymentGateway.charge(order);      // ~400ms, sometimes flaky
    return ResponseEntity.status(201).body(order);
}

// After — queue it, return immediately
@PostMapping
public ResponseEntity<Order> create(@RequestBody OrderRequest req) {
    Order order = orderService.create(req);
    chargeQueue.send(new ChargeOrderMessage(order.getId()));
    return ResponseEntity.accepted().body(order);
}
```
- **Parallelize independent calls** instead of chaining them sequentially — `CompletableFuture.allOf(...)` in Java, `Promise.all` in Node, goroutines + a `WaitGroup`/`errgroup` in Go.
- **Cache the response** if the data doesn't change often.
- **Set explicit timeouts + retries + circuit breaker** so one slow dependency can't take your whole service down (Resilience4j in Java, similar libs elsewhere).

---

## Step 5 — Network & payload shape

**Symptom:** server-side timing looks fine, but the client still measures it as slow.

- **Compress responses** — gzip/Brotli, usually a one-line config change. Turns a 500 KB body into 50–80 KB.
- **Paginate** — "return all 10,000 orders" will never be fast no matter how good the query is. Add a page size + cursor.
- **Cut round trips** — batch requests, avoid chatty back-and-forth, use HTTP/2 where possible.
- **CDN + caching headers** (`Cache-Control`, `ETag`) for anything that doesn't change per-request.

---

## Step 6 — Infrastructure

Only relevant if the above are all clean and it's *still* slow, usually under load specifically:

- Maxed-out server capacity → autoscaling / more instances.
- Hitting connection limits (DB pool, thread pool, file descriptors) → raise limits or tune pool sizes properly.
- Misconfigured resource limits (CPU/memory requests too low in k8s, etc.) → tune configs.

This is rarely step one — chasing infra before ruling out a bad query/N+1 is the classic time-waster.

---

## Step 7 — Only now, caching

Caching is the *last* resort, not the first instinct. A cache in front of a broken or wrong query just serves the wrong answer faster.

- Same-request reuse → plain memoization (a local variable/field), not a real cache.
- Cross-request reuse → cache the **expensive derivation**, keyed by its inputs — not the raw HTTP response. Response-level caching gets messy fast with auth, feature flags, per-user data.
- Use Redis/Caffeine with a sane TTL and a clear invalidation story — "when does this go stale, and how do we know?"

---

## The whole thing, as one flow

```
Define "slow" (how much / which endpoints / how often)
        │
        ▼
Check APM / metrics → which layer is eating the time?
        │
   ┌────┼────────┬────────────┬─────────────┐
   ▼         ▼            ▼               ▼
  DB        Backend      External call    Network/payload
(N+1, no    (loops,      (blocking wait,  (big response,
 index,     bad          no timeout)      no pagination,
 select *)  serializer)                   no compression)
   │         │            │               │
   └─────────┴────────────┴───────────────┘
                    │
            Still slow under load only?
                    ▼
                 Infra (scale, pool limits)
                    │
                    ▼
        Only then: add caching (if the
        uncached path is already correct)
                    │
                    ▼
        Write down the root cause.
        (This is what stops it coming back.)
```

## Quick-reference: what causes most slow endpoints

Ranked roughly by how often each one turns out to be the actual cause:

1. N+1 queries
2. Missing index / bad query plan
3. Fetching more data than needed (`SELECT *`, no pagination)
4. Synchronous external call on the request path
5. Heavy in-app loop or oversized serialization
6. Network/payload (uncompressed, chatty, large response)

Notably *not* usually the cause: not enough servers, wrong runtime version, GC pauses. These happen, but they're rare compared to the six above — don't start there.

## After the fix

- Write the root cause down in the PR/incident notes. The documented bug is the one that doesn't come back.
- Add a regression check: an assertion on query count for the endpoint (catches N+1 regressions), or a load test if it was a scaling issue.