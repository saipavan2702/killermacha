Tags: #computer-science #postgresql
Map: [[upskill/CS Topics/Databases/PostgreSQL|PostgreSQL]], [[upskill/CS Topics/Databases/SQL|SQL]]

# Postgres: The Universal Tech Stack Alternative

## 1. Introduction: The Strategic Logic of Database Consolidation

Modern infrastructure has reached a point of staggering complexity where "Total Cost of Ownership" (TCO) is no longer just a financial metric — it's a cognitive one. Launching even a modest service often means stitching together 20 different specialized tools, creating a sprawling infrastructure footprint that drains engineering velocity through constant context switching and state-synchronization headaches.

To counter this, senior architects are increasingly adopting the **"poor man's web stack"** — a strategy that prioritizes architectural simplicity and operational efficiency.

At the center of this strategy is **PostgreSQL**. With 30 years of development history and a mature plugin ecosystem, Postgres has evolved far beyond a relational storage engine. It now serves as a robust platform capable of replacing several specialized external services entirely. By internalizing these functions, teams eliminate the "distributed systems tax" — reducing both latency and the number of moving parts in production.

The transition typically begins with the most common performance bottleneck: the caching layer.

---

## 2. Distributed Caching → Replacing Redis / Memcached with `UNLOGGED` Tables

Caching is often the first point of failure in high-traffic apps. Distributed caches like Redis or Memcached are the default choice, but they add operational complexity and network hops. For apps scaling toward their first few hundred thousand users, cutting the external cache dependency can meaningfully simplify the stack.

### How it works

Postgres offers a native high-performance alternative: **`UNLOGGED` tables**.

In a standard table, every transaction is recorded in the **Write-Ahead Log (WAL)** — the mechanism used for crash recovery and replication. `UNLOGGED` tables skip the WAL entirely. By removing that disk I/O overhead, write performance becomes comparable to an in-memory store, while read performance stays identical to a normal table (Postgres's indexing and buffer cache handle that just fine).

### Trade-offs

- **Not crash-safe** — the table is truncated automatically after a server crash or unclean shutdown.
- **Not replicated** — `UNLOGGED` tables don't propagate to standby servers in an HA cluster.

Both of these would be disqualifying for primary data, but they're perfectly fine — even desirable — for a cache. Ephemeral data shouldn't bloat the WAL or add replication lag.

### Example

```sql
-- Create a high-performance, ephemeral cache table
CREATE UNLOGGED TABLE app_cache (
    key        TEXT PRIMARY KEY,
    value      JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rapid insert (bypasses WAL for max throughput)
INSERT INTO app_cache (key, value)
VALUES ('user_session_123', '{"status": "active", "theme": "dark"}');

-- High-speed retrieval via standard B-tree index
SELECT value FROM app_cache WHERE key = 'user_session_123';
```

---

## 3. Vector Search → Replacing Pinecone / Qdrant with `pgvector`

With LLMs everywhere, many teams default to a dedicated vector database like Pinecone. But keeping embeddings and relational data in the same ACID-compliant store has a real advantage: **context-aware search**, where you can join metadata with vector similarity scores in a single query — no external sync required.

### The `pgvector` workflow

Using the `pgvector` extension, you can build a full Retrieval-Augmented Generation (RAG) pipeline: chunk your source text, convert the chunks into embeddings, and store them alongside the text itself. At query time, the user's question is vectorized and matched against nearest neighbors.

### Example

```sql
-- Enable the extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for knowledge chunks + embeddings
CREATE TABLE knowledge_base (
    id        SERIAL PRIMARY KEY,
    content   TEXT,
    embedding VECTOR(1536)  -- 1536 = OpenAI text-embedding-3-small
);

-- Insert a chunk
INSERT INTO knowledge_base (content, embedding)
VALUES ('Postgres has supported vector search since pgvector 0.4.0...', '[0.12, -0.05, 0.22, ...]');

-- Similarity search using cosine distance (<=>)
SELECT content FROM knowledge_base
ORDER BY embedding <=> '[0.11, -0.04, 0.21, ...]'
LIMIT 5;
```

---

## 4. Full-Text Search → Replacing Elasticsearch with `TSVECTOR` + GIN

External search engines like Elasticsearch are often overkill, adding real maintenance and licensing overhead. Postgres handles sophisticated linguistic search natively via the `TSVECTOR` / `TSQUERY` types.

### How text gets processed

- **Stop words** — high-frequency, low-value words ("the", "were", "over") get dropped.
- **Stemming** — words are reduced to their root ("jumping" → "jump", "foxes" → "fox").

For example, `"The quick brown foxes were jumping over the lazy dogs"` becomes the token set:
`brown, dog, fox, jump, lazy, quick`

Postgres also stores positional data for each token, so it can rank results by word proximity.

### Indexing

A **GIN (Generalized Inverted Index)** maps tokens back to the rows containing them, keeping search sub-millisecond even across millions of rows.

### Example

```sql
-- Table with a generated search column
CREATE TABLE posts (
    id   SERIAL PRIMARY KEY,
    body TEXT,
    tsv  TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

-- GIN index for fast token lookup
CREATE INDEX tsv_idx ON posts USING GIN (tsv);

-- Sample data
INSERT INTO posts (body) VALUES ('The quick brown foxes were jumping over the lazy dogs');

-- Search using websearch syntax
SELECT body FROM posts
WHERE tsv @@ websearch_to_tsquery('english', 'jumping foxes');
```

---

## 5. Geospatial Data → Replacing GIS Services with PostGIS

Apps needing spatial awareness — logistics, flood zones, proximity search — can reach for **PostGIS**, the industry-standard extension that turns Postgres into a full spatial database.

### Key concept

PostGIS introduces the `geography` type, based on the **WGS 84 (SRID 4326)** coordinate system used by GPS. Unlike plain `geometry`, `geography` accounts for the curvature of the earth, so distance calculations come out correct in meters without manual trigonometry.

### ⚠️ The classic gotcha

PostGIS expects **longitude first, then latitude** (X, Y). Reversing this is the single most common cause of broken spatial queries.

### Example

```sql
-- Enable the extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table for points of interest / zones
CREATE TABLE spatial_assets (
    id       SERIAL PRIMARY KEY,
    name     TEXT,
    location GEOGRAPHY(POINT, 4326),
    boundary GEOGRAPHY(POLYGON, 4326)  -- optional shape/zone support
);

-- Spatial index
CREATE INDEX assets_spatial_idx ON spatial_assets USING GIST (location);

-- Insert data — longitude comes FIRST
INSERT INTO spatial_assets (name, location)
VALUES ('Central Park', ST_MakePoint(-73.9654, 40.7829));

-- Proximity query: assets within 500 meters
SELECT name FROM spatial_assets
WHERE ST_DWithin(location, ST_MakePoint(-73.9654, 40.7829), 500)
ORDER BY location <-> ST_MakePoint(-73.9654, 40.7829);
```

---

## 6. Task Scheduling → Replacing Cron Services with `pg_cron`

Most apps need recurring maintenance — log rotation, nightly reports, cleanup jobs. Instead of managing external cron or a third-party scheduler, **`pg_cron`** lets you schedule SQL jobs directly inside the database.

### Why it's better

`pg_cron` logs job history to internal tables (`cron.job_run_details`), so if a job fails at 3 AM, you can trace it with a normal SQL query — no digging through disparate system logs.

### Example

```sql
-- Enable the extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule a nightly cleanup at 3:00 AM
SELECT cron.schedule(
    'nightly-cleanup',
    '0 3 * * *',
    $$DELETE FROM app_logs WHERE created_at < now() - interval '30 days'$$
);

-- Check job history
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 5;

-- Remove a scheduled job
SELECT cron.unschedule('nightly-cleanup');
```

---

## 7. Document Storage → Replacing MongoDB with `JSONB`

Unstructured data often pushes teams toward NoSQL options like MongoDB. But Postgres's `JSONB` type (the "B" is for **Binary**) is a strong alternative — the data is stored in a decomposed, indexable format rather than plain text.

### Why it competes with MongoDB

`JSONB` supports **GIN indexing**, so querying inside nested documents stays fast at scale. If you need strict MongoDB API compatibility, the **DocumentDB extension** provides a MongoDB-compatible layer built directly on Postgres.

### Example

```sql
-- Table for unstructured document storage
CREATE TABLE profiles (
    id       SERIAL PRIMARY KEY,
    metadata JSONB
);

-- GIN index for fast lookups inside the JSON
CREATE INDEX idx_metadata ON profiles USING GIN (metadata);

-- Insert nested data
INSERT INTO profiles (metadata)
VALUES ('{"user": "Alice", "preferences": {"theme": "dark", "alerts": true}}');

-- Containment query (@>)
SELECT * FROM profiles
WHERE metadata @> '{"preferences": {"theme": "dark"}}';

-- Key-existence check (?)
SELECT * FROM profiles WHERE metadata ? 'user';
```

---

## 8. Conclusion: Implementation Thresholds

Consolidating six functions — **caching, vector search, full-text search, GIS, scheduling, and document storage** — into Postgres significantly cuts operational complexity. For most applications, this isn't just a "poor man's" workaround; it's an architecturally cleaner choice that minimizes data movement and infrastructure overhead.

That said, know the scaling ceiling: if you're targeting hundreds of thousands of concurrent users or petabyte-scale vector search, specialized third-party tools may eventually become necessary. For the vast majority of projects, though, **Postgres is the most versatile tool in the modern stack**.

---

### Source

Better Stack. *"I replaced my entire tech stack with Postgres."* YouTube. [https://www.youtube.com/watch?v=3S3itF7unX8](https://www.youtube.com/watch?v=3S3itF7unX8)
