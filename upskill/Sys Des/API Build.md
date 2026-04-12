---
title: api theory
date: 2026-01-03
tags:
  - "#sysdes"
  - "#ref"
---
## gRPC Overview

The video provides a comprehensive breakdown of gRPC (Google Remote Procedure Call), a high-performance framework designed for efficient communication between distributed systems. It explains how gRPC leverages **Protocol Buffers** and **HTTP/2** to outperform traditional REST APIs.

### **Core Concepts**

* **Protocol Buffers (Protobuf):** A language-neutral mechanism for serialising structured data. Unlike JSON (text-based), Protobuf is binary, making it much smaller and faster to process.
* **HTTP/2 Foundation:** gRPC uses HTTP/2 to enable features like **Multiplexing** (multiple requests over one connection), **Header Compression**, **Binary Framing**, and **Full Duplex** communication.
* **Language Agnostic:** It allows services written in different languages (e.g., a Go backend and a Python AI service) to communicate as if they were calling local functions.

### **The Four gRPC Communication Protocols**

#### **1. Unary RPC**
The simplest form, mirroring the traditional REST request-response model. The client sends a single request and gets a single response.
* **Example:** A client sends a request to a "Math Service" with two numbers (`5` and `10`), and the server returns the sum (`15`).

#### **2. Server Streaming RPC**
The client sends one request, and the server returns a continuous stream of messages.
* **Example:** A "Live Sports Score" service. You send one request for a specific match, and the server pushes updates (score changes, cards) to you in real-time as they happen.

#### **3. Client Streaming RPC**
The client sends a stream of multiple messages, and the server processes them and returns a single consolidated response at the end.
* **Example:** Large file uploads or telemetry data. An IoT device streams thousands of sensor readings to a server, which then responds once with a "Success" or a summary report.

#### **4. Bidirectional Streaming RPC**
Both the client and server send a stream of messages simultaneously over a single persistent connection.
* **Example:** A Chat Application. Both users can send and receive messages at the same time without waiting for the other to finish, or a financial trading platform streaming live stock ticks while accepting trade orders.

### **Why use gRPC over REST?**

* **Efficiency:** Binary serialisation is much more compact than JSON.
* **Type Safety:** You define your data structures in `.proto` files, which prevents runtime errors by ensuring both client and server follow the same "contract."
* **Performance:** Multiplexing reduces the overhead of opening multiple TCP connections, significantly lowering latency in microservices.

## Pagination

Pagination = dividing large data into small, loadable chunks so apps don't freeze and servers stay stable.
Two approaches: **Offset** (simple) and **Cursor** (smart).
### 1. Offset Pagination

Tell the DB how many rows to **skip**, then return the next batch.

```sql
SELECT * FROM items LIMIT 10 OFFSET 20
-- skip first 20, return rows 21–30
```

```ts
async function getItems(page: number, limit: number) {
  const offset = (page - 1) * limit;
  return db.query(`SELECT * FROM items LIMIT $1 OFFSET $2`, [limit, offset]);
}
```

### Problems
- **Slow at scale** — DB still scans all skipped rows before returning results
- **Unstable** — new inserts shift data → duplicates or missing rows

> ✅ Use when: data is **small or static**

---
### 2. Cursor Pagination

Use the **last seen ID** as a bookmark. DB jumps directly to it via index — no scanning. Two type: `key-based` & `time-based`

```ts
async function getItems(limit: number, cursor?: number) {
  const where = cursor ? `WHERE id > ${cursor}` : '';
  const rows = await db.query(
    `SELECT * FROM items ${where} ORDER BY id ASC LIMIT $1`, [limit]
  );
  const nextCursor = rows.at(-1)?.id ?? null;
  return { rows, nextCursor };
}

// First page
const p1 = await getItems(10);
// → { rows: [...], nextCursor: 162 }

// Next page — pass the cursor
const p2 = await getItems(10, p1.nextCursor);
// → starts after id = 162
```

### Benefits
- **Always fast** — no skipped row scanning
- **Stable** — live data won't cause duplicates or gaps
- Built for **infinite scroll** (Twitter, Instagram, etc.)
> [!tip]
> 
> Offset says *"skip N rows"* — DB scans all of them.  
> Cursor says *"start after this ID"* — DB jumps directly via index.