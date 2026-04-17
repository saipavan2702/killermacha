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


## Auth types

```dataviewjs
const tabs = [
  {
    label: "Basic Auth",
    tag: "Legacy",
    color: "#E74C3C",
    content: [
      '<div class="cs-pill" style="background:#E74C3C22;color:#E74C3C">Legacy</div>',
      '<div class="cs-title">Basic Authentication</div>',
      '<div class="cs-sub">The simplest method — encodes <b>username:password</b> in Base64 and sends it in every request header. Base64 is <b>not encryption</b> — anyone can decode it. Safe only when used over HTTPS. Rarely used in modern production.</div>',
      '<div class="cs-lbl">How it works</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Step</th><th>Who</th><th>What happens</th></tr></thead><tbody>',
      '<tr><td>1</td><td>Client</td><td>Encodes <code>username:password</code> in Base64 → sends as <code>Authorization: Basic dXNlcjpwYXNz</code></td></tr>',
      '<tr><td>2</td><td>Server</td><td>Decodes the header, checks credentials against DB/store</td></tr>',
      '<tr><td>3</td><td>Server</td><td>Returns 200 (match) or 401 (mismatch)</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Key characteristics</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>',
      '<tr><td>State</td><td>Stateless</td></tr>',
      '<tr><td>Security</td><td><span class="cs-badge cs-badge-bad">Low — credentials travel every request</span></td></tr>',
      '<tr><td>Use today?</td><td><span class="cs-badge cs-badge-ok">Rarely — internal tools / simple scripts only</span></td></tr>',
      '<tr><td>Identifies</td><td>User</td></tr>',
      '<tr><td>Requires</td><td>HTTPS (mandatory)</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Express.js — verify basic auth</div>',
      '<div class="cs-code"><span class="cs-cm">// Client sends: Authorization: Basic dXNlcjpwYXNz</span>\n<span class="cs-kw">const</span> authHeader = req.headers[<span class="cs-st">\'authorization\'</span>];\n<span class="cs-kw">const</span> base64 = authHeader.split(<span class="cs-st">\' \'</span>)[<span class="cs-num">1</span>];\n<span class="cs-kw">const</span> [user, pass] = Buffer.<span class="cs-fn">from</span>(base64, <span class="cs-st">\'base64\'</span>)\n  .toString().split(<span class="cs-st">\':\'</span>);\n\n<span class="cs-kw">if</span> (user === <span class="cs-st">\'admin\'</span> &amp;&amp; pass === <span class="cs-st">\'secret\'</span>) {\n  res.<span class="cs-fn">send</span>(<span class="cs-st">\'Access granted\'</span>);\n} <span class="cs-kw">else</span> {\n  res.status(<span class="cs-num">401</span>).<span class="cs-fn">send</span>(<span class="cs-st">\'Unauthorized\'</span>);\n}</div>',
      '<div class="cs-insight" style="border-color:#E74C3C"><span class="cs-icon" style="color:#E74C3C">→</span><div>Basic Auth sends credentials on <b>every single request</b>. If HTTPS ever lapses, all credentials are exposed. Use only for internal tools, CLI scripts, or quick prototypes — never for production user-facing APIs.</div></div>'
    ].join("")
  },
  {
    label: "Digest Auth",
    tag: "Legacy",
    color: "#E67E22",
    content: [
      '<div class="cs-pill" style="background:#E67E2222;color:#E67E22">Legacy</div>',
      '<div class="cs-title">Digest Authentication</div>',
      '<div class="cs-sub">A challenge-response evolution of Basic Auth. The server sends a random <b>nonce</b>, the client hashes the password + nonce and sends the result — the plain password <b>never travels</b> over the network. Still mostly replaced by TLS + tokens today.</div>',
      '<div class="cs-lbl">The challenge-response flow</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Step</th><th>Who</th><th>What happens</th></tr></thead><tbody>',
      '<tr><td>1</td><td>Client</td><td>Requests the resource — no credentials yet</td></tr>',
      '<tr><td>2</td><td>Server</td><td>Returns 401 + <code>WWW-Authenticate: Digest realm="api", nonce="abc123"</code></td></tr>',
      '<tr><td>3</td><td>Client</td><td>Computes MD5(username:realm:password) + MD5(method:uri) → combines with nonce</td></tr>',
      '<tr><td>4</td><td>Client</td><td>Sends hashed response in Authorization header</td></tr>',
      '<tr><td>5</td><td>Server</td><td>Recomputes same hash server-side, compares — grants or denies</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Key characteristics</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>',
      '<tr><td>State</td><td>Semi-stateful (server stores nonce)</td></tr>',
      '<tr><td>Security</td><td><span class="cs-badge cs-badge-ok">Medium — no plain password, but MD5 is weak</span></td></tr>',
      '<tr><td>Use today?</td><td><span class="cs-badge cs-badge-bad">Rarely — superseded by token-based auth</span></td></tr>',
      '<tr><td>Weakness</td><td>Vulnerable to MITM + replay if nonce reused</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Node.js — digest auth flow (simplified)</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> crypto = <span class="cs-fn">require</span>(<span class="cs-st">\'crypto\'</span>);\n<span class="cs-kw">const</span> <span class="cs-fn">md5</span> = str =&gt; crypto.<span class="cs-fn">createHash</span>(<span class="cs-st">\'md5\'</span>).<span class="cs-fn">update</span>(str).<span class="cs-fn">digest</span>(<span class="cs-st">\'hex\'</span>);\n\n<span class="cs-cm">// Server issues nonce challenge</span>\n<span class="cs-kw">const</span> nonce = crypto.<span class="cs-fn">randomBytes</span>(<span class="cs-num">16</span>).<span class="cs-fn">toString</span>(<span class="cs-st">\'hex\'</span>);\nres.<span class="cs-fn">set</span>(<span class="cs-st">\'WWW-Authenticate\'</span>, <span class="cs-st">\'Digest realm="api", nonce="\'</span> + nonce + <span class="cs-st">\'"\'</span>);\nres.status(<span class="cs-num">401</span>).<span class="cs-fn">send</span>();\n\n<span class="cs-cm">// Client computes response</span>\n<span class="cs-kw">const</span> ha1      = <span class="cs-fn">md5</span>(user + <span class="cs-st">\':api:\'</span> + password);\n<span class="cs-kw">const</span> ha2      = <span class="cs-fn">md5</span>(method + <span class="cs-st">\':\'</span> + uri);\n<span class="cs-kw">const</span> response = <span class="cs-fn">md5</span>(ha1 + <span class="cs-st">\':\'</span> + nonce + <span class="cs-st">\':\'</span> + ha2);\n\n<span class="cs-cm">// Server verifies by recomputing</span>\n<span class="cs-kw">const</span> expected = <span class="cs-fn">md5</span>(storedHA1 + <span class="cs-st">\':\'</span> + nonce + <span class="cs-st">\':\'</span> + ha2);\n<span class="cs-kw">if</span> (response === expected) res.<span class="cs-fn">send</span>(<span class="cs-st">\'OK\'</span>);</div>',
      '<div class="cs-insight" style="border-color:#E67E22"><span class="cs-icon" style="color:#E67E22">→</span><div>Digest Auth is better than Basic (password never travels plain) but still weak — MD5 is broken. If you are already on HTTPS you get the same benefit with no added complexity. Use JWT or OAuth instead.</div></div>'
    ].join("")
  },
  {
    label: "Session Auth",
    tag: "Browser",
    color: "#9B59B6",
    content: [
      '<div class="cs-pill" style="background:#9B59B622;color:#9B59B6">Browser</div>',
      '<div class="cs-title">Session Authentication</div>',
      '<div class="cs-sub">The classic web login pattern. On login the server creates a session record and sends a <b>session ID</b> via a cookie. The browser auto-attaches that cookie to every request. Downside: all servers must share the session store — hard to scale.</div>',
      '<div class="cs-lbl">Session lifecycle</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Step</th><th>Who</th><th>What happens</th></tr></thead><tbody>',
      '<tr><td>1</td><td>Client</td><td>POST /login with username + password</td></tr>',
      '<tr><td>2</td><td>Server</td><td>Verifies credentials → creates session record in DB/Redis → generates session ID</td></tr>',
      '<tr><td>3</td><td>Server</td><td>Sends <code>Set-Cookie: sessionId=abc123; HttpOnly; Secure</code></td></tr>',
      '<tr><td>4</td><td>Browser</td><td>Stores cookie, auto-sends on every subsequent request</td></tr>',
      '<tr><td>5</td><td>Server</td><td>Looks up sessionId in store → identifies user → responds</td></tr>',
      '<tr><td>6</td><td>Server</td><td>DELETE /logout → destroys session record → cookie becomes invalid</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Key characteristics</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>',
      '<tr><td>State</td><td><span class="cs-badge cs-badge-bad">Stateful — server must store all sessions</span></td></tr>',
      '<tr><td>Security</td><td><span class="cs-badge cs-badge-ok">Good if HttpOnly + Secure + CSRF protection</span></td></tr>',
      '<tr><td>Scalability</td><td><span class="cs-badge cs-badge-bad">Hard — all servers need shared session store (Redis)</span></td></tr>',
      '<tr><td>Revocation</td><td><span class="cs-badge cs-badge-ok">Easy — delete the session record instantly</span></td></tr>',
      '<tr><td>Best for</td><td>Traditional server-rendered web apps</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Express.js — session login with Redis</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> session    = <span class="cs-fn">require</span>(<span class="cs-st">\'express-session\'</span>);\n<span class="cs-kw">const</span> RedisStore = <span class="cs-fn">require</span>(<span class="cs-st">\'connect-redis\'</span>)(session);\n\napp.<span class="cs-fn">use</span>(<span class="cs-fn">session</span>({\n  store:             <span class="cs-kw">new</span> <span class="cs-fn">RedisStore</span>({ client: redisClient }),\n  secret:            process.env.SESSION_SECRET,\n  resave:            <span class="cs-kw">false</span>,\n  saveUninitialized: <span class="cs-kw">false</span>,\n  cookie: { httpOnly: <span class="cs-kw">true</span>, secure: <span class="cs-kw">true</span>, maxAge: <span class="cs-num">3600000</span> }\n}));\n\napp.<span class="cs-fn">post</span>(<span class="cs-st">\'/login\'</span>, <span class="cs-kw">async</span> (req, res) => {\n  <span class="cs-kw">const</span> user = <span class="cs-kw">await</span> User.<span class="cs-fn">verify</span>(req.body);\n  <span class="cs-kw">if</span> (!user) <span class="cs-kw">return</span> res.status(<span class="cs-num">401</span>).<span class="cs-fn">send</span>();\n  req.session.userId = user.id;\n  res.<span class="cs-fn">redirect</span>(<span class="cs-st">\'/dashboard\'</span>);\n});\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/dashboard\'</span>, (req, res) => {\n  <span class="cs-kw">if</span> (!req.session.userId) <span class="cs-kw">return</span> res.<span class="cs-fn">redirect</span>(<span class="cs-st">\'/login\'</span>);\n  res.<span class="cs-fn">send</span>(<span class="cs-st">\'Welcome back!\'</span>);\n});\n\napp.<span class="cs-fn">post</span>(<span class="cs-st">\'/logout\'</span>, (req, res) => {\n  req.session.<span class="cs-fn">destroy</span>();\n  res.<span class="cs-fn">redirect</span>(<span class="cs-st">\'/login\'</span>);\n});</div>',
      '<div class="cs-insight" style="border-color:#9B59B6"><span class="cs-icon" style="color:#9B59B6">→</span><div>Sessions are easy to revoke (delete the record), which is a big advantage over JWTs. The tradeoff is every server needs access to the same session store (Redis). Perfect for single-server web apps — painful for distributed microservices.</div></div>'
    ].join("")
  },
  {
    label: "API Keys",
    tag: "App Identity",
    color: "#16A085",
    content: [
      '<div class="cs-pill" style="background:#16A08522;color:#16A085">App Identity</div>',
      '<div class="cs-title">API Keys</div>',
      '<div class="cs-sub">A unique random string assigned per application. It identifies <b>which app</b> is calling your API — not which user. No expiry by default. Easy to set up, easy to leak. Ubiquitous in public APIs (Stripe, OpenAI, Google Maps).</div>',
      '<div class="cs-lbl">Request flow</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Step</th><th>Who</th><th>What happens</th></tr></thead><tbody>',
      '<tr><td>1</td><td>Developer</td><td>Generates a key from dashboard (e.g. <code>sk_live_abc123</code>)</td></tr>',
      '<tr><td>2</td><td>Client</td><td>Sends key in header: <code>x-api-key: sk_live_abc123</code></td></tr>',
      '<tr><td>3</td><td>Server</td><td>Looks up key in DB → finds associated app / permissions</td></tr>',
      '<tr><td>4</td><td>Server</td><td>Applies rate limits per key → responds or rejects</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Key characteristics</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>',
      '<tr><td>State</td><td>Stateless</td></tr>',
      '<tr><td>Security</td><td><span class="cs-badge cs-badge-ok">Medium — static, long-lived, no auto-expiry</span></td></tr>',
      '<tr><td>Granularity</td><td>App-level (not per-user)</td></tr>',
      '<tr><td>Revocation</td><td><span class="cs-badge cs-badge-ok">Easy — delete or rotate the key</span></td></tr>',
      '<tr><td>Best for</td><td>Machine-to-machine, public APIs, developer access</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Express.js — API key middleware</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> crypto = <span class="cs-fn">require</span>(<span class="cs-st">\'crypto\'</span>);\n\n<span class="cs-cm">// Generate a secure key (run once, store hashed in DB)</span>\n<span class="cs-kw">const</span> <span class="cs-fn">generateKey</span> = () =>\n  <span class="cs-st">\'sk_live_\'</span> + crypto.<span class="cs-fn">randomBytes</span>(<span class="cs-num">24</span>).<span class="cs-fn">toString</span>(<span class="cs-st">\'hex\'</span>);\n\n<span class="cs-cm">// Middleware to validate key on every request</span>\n<span class="cs-kw">async function</span> <span class="cs-fn">requireApiKey</span>(req, res, next) {\n  <span class="cs-kw">const</span> key = req.headers[<span class="cs-st">\'x-api-key\'</span>]\n             || req.query.api_key;\n\n  <span class="cs-kw">if</span> (!key)\n    <span class="cs-kw">return</span> res.status(<span class="cs-num">401</span>).<span class="cs-fn">json</span>({ error: <span class="cs-st">\'API key required\'</span> });\n\n  <span class="cs-kw">const</span> app = <span class="cs-kw">await</span> ApiKey.<span class="cs-fn">findOne</span>({ key, active: <span class="cs-kw">true</span> });\n  <span class="cs-kw">if</span> (!app)\n    <span class="cs-kw">return</span> res.status(<span class="cs-num">401</span>).<span class="cs-fn">json</span>({ error: <span class="cs-st">\'Invalid or revoked key\'</span> });\n\n  req.app = app;\n  <span class="cs-fn">next</span>();\n}\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/v1/data\'</span>, requireApiKey, (req, res) => {\n  res.<span class="cs-fn">json</span>({ data: <span class="cs-st">\'protected\'</span>, app: req.app.name });\n});</div>',
      '<div class="cs-insight" style="border-color:#16A085"><span class="cs-icon" style="color:#16A085">→</span><div>Store API keys <b>hashed</b> in your DB (like passwords) — only the developer sees the plain key once. Use <code>crypto.timingSafeEqual</code> for comparison to prevent timing attacks. Always rotate keys when team members leave.</div></div>'
    ].join("")
  },
  {
    label: "Bearer Tokens",
    tag: "Stateless",
    color: "#2980B9",
    content: [
      '<div class="cs-pill" style="background:#2980B922;color:#2980B9">Stateless</div>',
      '<div class="cs-title">Bearer Tokens</div>',
      '<div class="cs-sub">A broad category — "bearer" means <b>whoever holds this token gets access</b>. The server does not track who it was issued to. Lightweight and stateless, but if stolen an attacker has full access until expiry. JWTs are the most common bearer token format.</div>',
      '<div class="cs-lbl">Request flow</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Step</th><th>Who</th><th>What happens</th></tr></thead><tbody>',
      '<tr><td>1</td><td>Client</td><td>Authenticates → receives an opaque token string</td></tr>',
      '<tr><td>2</td><td>Client</td><td>Sends <code>Authorization: Bearer eyJhbGci...</code> on every request</td></tr>',
      '<tr><td>3</td><td>Server</td><td>Validates token (signature check or DB lookup) → grants access</td></tr>',
      '<tr><td>4</td><td>Server</td><td>No session stored — token is the only proof of identity</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Key characteristics</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>',
      '<tr><td>State</td><td><span class="cs-badge cs-badge-ok">Stateless — no server session needed</span></td></tr>',
      '<tr><td>Security</td><td><span class="cs-badge cs-badge-ok">Good — but token theft = full access until expiry</span></td></tr>',
      '<tr><td>Revocation</td><td><span class="cs-badge cs-badge-bad">Hard — must wait for expiry or use blocklist</span></td></tr>',
      '<tr><td>Best for</td><td>REST APIs, mobile apps, microservices</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Express.js — extract and validate bearer token</div>',
      '<div class="cs-code"><span class="cs-cm">// Middleware: extract bearer from header</span>\n<span class="cs-kw">function</span> <span class="cs-fn">requireBearer</span>(req, res, next) {\n  <span class="cs-kw">const</span> header = req.headers[<span class="cs-st">\'authorization\'</span>] || <span class="cs-st">\'\'</span>;\n\n  <span class="cs-kw">if</span> (!header.<span class="cs-fn">startsWith</span>(<span class="cs-st">\'Bearer \'</span>))\n    <span class="cs-kw">return</span> res.status(<span class="cs-num">401</span>).<span class="cs-fn">json</span>({ error: <span class="cs-st">\'Bearer token required\'</span> });\n\n  req.token = header.<span class="cs-fn">slice</span>(<span class="cs-num">7</span>);\n  <span class="cs-fn">next</span>();\n}\n\n<span class="cs-cm">// Opaque token — lookup in DB</span>\n<span class="cs-kw">async function</span> <span class="cs-fn">validateToken</span>(req, res, next) {\n  <span class="cs-kw">const</span> record = <span class="cs-kw">await</span> Token.<span class="cs-fn">findOne</span>({\n    token: req.token,\n    expiresAt: { $gt: <span class="cs-kw">new</span> Date() }\n  });\n  <span class="cs-kw">if</span> (!record)\n    <span class="cs-kw">return</span> res.status(<span class="cs-num">401</span>).<span class="cs-fn">json</span>({ error: <span class="cs-st">\'Invalid token\'</span> });\n\n  req.userId = record.userId;\n  <span class="cs-fn">next</span>();\n}\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/profile\'</span>, requireBearer, validateToken,\n  (req, res) => res.<span class="cs-fn">json</span>({ userId: req.userId }));</div>',
      '<div class="cs-insight" style="border-color:#2980B9"><span class="cs-icon" style="color:#2980B9">→</span><div>Bearer token = possession = access. Store them like passwords — never in localStorage (XSS risk). Use <code>httpOnly</code> cookies or secure memory. Keep expiry short. Add a refresh token strategy for production apps.</div></div>'
    ].join("")
  },
  {
    label: "JWT",
    tag: "Self-contained",
    color: "#8E44AD",
    content: [
      '<div class="cs-pill" style="background:#8E44AD22;color:#8E44AD">Self-contained</div>',
      '<div class="cs-title">JSON Web Tokens (JWT)</div>',
      '<div class="cs-sub">Not a protocol — a <b>token format</b>. Three Base64 parts: <code>header.payload.signature</code>. The server signs the payload with a secret. Any server that knows the secret can verify it <b>without a DB lookup</b> — that is what makes it powerful for microservices.</div>',
      '<div class="cs-lbl">JWT anatomy</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Part</th><th>Contains</th><th>Example</th></tr></thead><tbody>',
      '<tr><td><b>Header</b></td><td>Token type + algorithm</td><td><code>{"alg":"HS256","typ":"JWT"}</code></td></tr>',
      '<tr><td><b>Payload</b></td><td>Claims (userId, role, exp, iat)</td><td><code>{"userId":"123","role":"admin","exp":1234567}</code></td></tr>',
      '<tr><td><b>Signature</b></td><td>HMAC of header+payload with secret</td><td><code>HMACSHA256(base64(hdr)+"."+base64(pld), secret)</code></td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Key characteristics</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Property</th><th>Value</th></tr></thead><tbody>',
      '<tr><td>State</td><td><span class="cs-badge cs-badge-ok">Fully stateless — no DB hit per request</span></td></tr>',
      '<tr><td>Self-contained</td><td><span class="cs-badge cs-badge-ok">Yes — user info lives in the token itself</span></td></tr>',
      '<tr><td>Revocation</td><td><span class="cs-badge cs-badge-bad">Hard — must expire or maintain a blocklist</span></td></tr>',
      '<tr><td>Pitfall</td><td>Payload is Base64-encoded, NOT encrypted — readable by anyone</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Bad vs good signing pattern</div>',
      '<div class="cs-two-col">',
      '<div><div class="cs-code-label cs-bad-label">🔴 weak secret + long TTL</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> token = jwt.<span class="cs-fn">sign</span>(\n  { userId: user.id },\n  <span class="cs-st">\'secret\'</span>,\n  { expiresIn: <span class="cs-st">\'7d\'</span> }\n);</div></div>',
      '<div><div class="cs-code-label cs-good-label">✅ strong secret + short TTL</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> token = jwt.<span class="cs-fn">sign</span>(\n  { userId: user.id, role: user.role },\n  process.env.JWT_SECRET,\n  { expiresIn: <span class="cs-st">\'15m\'</span> }\n);</div></div>',
      '</div>',
      '<div class="cs-lbl">Node.js — full sign and verify flow</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> jwt    = <span class="cs-fn">require</span>(<span class="cs-st">\'jsonwebtoken\'</span>);\n<span class="cs-kw">const</span> SECRET = process.env.JWT_SECRET;\n\napp.<span class="cs-fn">post</span>(<span class="cs-st">\'/login\'</span>, <span class="cs-kw">async</span> (req, res) => {\n  <span class="cs-kw">const</span> user = <span class="cs-kw">await</span> User.<span class="cs-fn">verify</span>(req.body);\n  <span class="cs-kw">if</span> (!user) <span class="cs-kw">return</span> res.status(<span class="cs-num">401</span>).<span class="cs-fn">send</span>();\n\n  <span class="cs-kw">const</span> token = jwt.<span class="cs-fn">sign</span>(\n    { userId: user.id, role: user.role },\n    SECRET,\n    { expiresIn: <span class="cs-st">\'15m\'</span>, issuer: <span class="cs-st">\'myapp\'</span> }\n  );\n  res.<span class="cs-fn">json</span>({ token });\n});\n\n<span class="cs-kw">function</span> <span class="cs-fn">auth</span>(req, res, next) {\n  <span class="cs-kw">try</span> {\n    <span class="cs-kw">const</span> token = req.headers.authorization.<span class="cs-fn">split</span>(<span class="cs-st">\' \'</span>)[<span class="cs-num">1</span>];\n    req.user = jwt.<span class="cs-fn">verify</span>(token, SECRET, { issuer: <span class="cs-st">\'myapp\'</span> });\n    <span class="cs-fn">next</span>();\n  } <span class="cs-kw">catch</span> (err) {\n    res.status(<span class="cs-num">401</span>).<span class="cs-fn">json</span>({ error: err.message });\n  }\n}\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/me\'</span>, auth, (req, res) =>\n  res.<span class="cs-fn">json</span>({ userId: req.user.userId }));</div>',
      '<div class="cs-insight" style="border-color:#8E44AD"><span class="cs-icon" style="color:#8E44AD">→</span><div>The payload is readable by anyone — <b>never put secrets in a JWT</b>. Keep expiry short (15m). If you need longer sessions, pair it with a refresh token. Use <code>RS256</code> (asymmetric) when multiple services verify the token.</div></div>'
    ].join("")
  },
  {
    label: "Access + Refresh",
    tag: "Best Practice",
    color: "#27AE60",
    content: [
      '<div class="cs-pill" style="background:#27AE6022;color:#27AE60">Best Practice</div>',
      '<div class="cs-title">Access + Refresh Tokens</div>',
      '<div class="cs-sub">Real production systems split tokens into two: a <b>short-lived access token</b> used for API calls, and a <b>long-lived refresh token</b> used only to obtain new access tokens — so users rarely need to log in again.</div>',
      '<div class="cs-lbl">The two-token design</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Token</th><th>Lifespan</th><th>Where stored</th><th>Purpose</th></tr></thead><tbody>',
      '<tr><td><b>Access token</b></td><td>15 min</td><td>Memory / httpOnly cookie</td><td>Sent with every API call</td></tr>',
      '<tr><td><b>Refresh token</b></td><td>30 days</td><td>httpOnly cookie / DB</td><td>Only sent to /refresh endpoint</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Full lifecycle</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Step</th><th>Who</th><th>What happens</th></tr></thead><tbody>',
      '<tr><td>1</td><td>Client</td><td>POST /login → receives both tokens</td></tr>',
      '<tr><td>2</td><td>Client</td><td>Uses access token for every API call</td></tr>',
      '<tr><td>3</td><td>Client</td><td>Access token expires → API returns 401</td></tr>',
      '<tr><td>4</td><td>Client</td><td>Silently sends refresh token to POST /refresh</td></tr>',
      '<tr><td>5</td><td>Server</td><td>Validates refresh → issues new access token + rotates refresh</td></tr>',
      '<tr><td>6</td><td>Client</td><td>Retries original request — user notices nothing</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Express.js — full dual-token implementation</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> ACCESS_SECRET  = process.env.ACCESS_SECRET;\n<span class="cs-kw">const</span> REFRESH_SECRET = process.env.REFRESH_SECRET;\n<span class="cs-kw">const</span> ACCESS_TTL     = <span class="cs-st">\'15m\'</span>;\n<span class="cs-kw">const</span> REFRESH_TTL    = <span class="cs-st">\'30d\'</span>;\n\napp.<span class="cs-fn">post</span>(<span class="cs-st">\'/login\'</span>, <span class="cs-kw">async</span> (req, res) => {\n  <span class="cs-kw">const</span> user = <span class="cs-kw">await</span> User.<span class="cs-fn">verify</span>(req.body);\n  <span class="cs-kw">if</span> (!user) <span class="cs-kw">return</span> res.status(<span class="cs-num">401</span>).<span class="cs-fn">send</span>();\n\n  <span class="cs-kw">const</span> accessToken  = jwt.<span class="cs-fn">sign</span>({ userId: user.id }, ACCESS_SECRET,  { expiresIn: ACCESS_TTL });\n  <span class="cs-kw">const</span> refreshToken = jwt.<span class="cs-fn">sign</span>({ userId: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });\n\n  <span class="cs-kw">await</span> RefreshToken.<span class="cs-fn">create</span>({\n    userId:    user.id,\n    tokenHash: <span class="cs-fn">hash</span>(refreshToken),\n    expiresAt: <span class="cs-kw">new</span> Date(Date.now() + <span class="cs-num">30</span> * <span class="cs-num">24</span> * <span class="cs-num">3600000</span>)\n  });\n\n  res.<span class="cs-fn">json</span>({ accessToken, refreshToken });\n});\n\napp.<span class="cs-fn">post</span>(<span class="cs-st">\'/refresh\'</span>, <span class="cs-kw">async</span> (req, res) => {\n  <span class="cs-kw">try</span> {\n    <span class="cs-kw">const</span> { userId } = jwt.<span class="cs-fn">verify</span>(req.body.refreshToken, REFRESH_SECRET);\n    <span class="cs-kw">const</span> stored = <span class="cs-kw">await</span> RefreshToken.<span class="cs-fn">findOne</span>({ userId });\n    <span class="cs-kw">if</span> (!stored) <span class="cs-kw">throw new</span> Error(<span class="cs-st">\'Revoked\'</span>);\n\n    <span class="cs-kw">const</span> newAccess = jwt.<span class="cs-fn">sign</span>({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });\n    res.<span class="cs-fn">json</span>({ accessToken: newAccess });\n  } <span class="cs-kw">catch</span> {\n    res.status(<span class="cs-num">401</span>).<span class="cs-fn">json</span>({ error: <span class="cs-st">\'Re-login required\'</span> });\n  }\n});</div>',
      '<div class="cs-insight" style="border-color:#27AE60"><span class="cs-icon" style="color:#27AE60">→</span><div>Rotate the refresh token on every use — issue a new one, invalidate the old. This makes a stolen refresh token single-use. Store refresh tokens hashed in the DB so you can revoke individual sessions without logging the user out everywhere.</div></div>'
    ].join("")
  },
  {
    label: "OAuth 2.0",
    tag: "Authorisation",
    color: "#E67E22",
    content: [
      '<div class="cs-pill" style="background:#E67E2222;color:#E67E22">Authorisation</div>',
      '<div class="cs-title">OAuth 2.0</div>',
      '<div class="cs-sub">An <b>authorisation framework</b> — not an authentication protocol. It lets a third-party app access your resources (Google Drive, GitHub repos) <b>without ever seeing your password</b>. Focused on <i>what you can do</i>, not <i>who you are</i>.</div>',
      '<div class="cs-lbl">The four grant types</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Grant</th><th>Use when</th><th>Security</th></tr></thead><tbody>',
      '<tr><td><b>Authorization Code</b></td><td>Web apps with a backend (most common)</td><td><span class="cs-badge cs-badge-ok">Best — code never exposed to browser</span></td></tr>',
      '<tr><td><b>Auth Code + PKCE</b></td><td>SPAs, mobile apps (no backend)</td><td><span class="cs-badge cs-badge-ok">Best for public clients</span></td></tr>',
      '<tr><td><b>Client Credentials</b></td><td>Machine-to-machine, no user involved</td><td><span class="cs-badge cs-badge-ok">Good for server-to-server</span></td></tr>',
      '<tr><td><b>Implicit (deprecated)</b></td><td>Old SPAs — do not use</td><td><span class="cs-badge cs-badge-bad">Insecure — token in URL fragment</span></td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Authorization Code flow — step by step</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Step</th><th>Who</th><th>What happens</th></tr></thead><tbody>',
      '<tr><td>1</td><td>Your app</td><td>Redirects user to auth server with <code>client_id</code>, <code>scope</code>, <code>redirect_uri</code>, <code>state</code></td></tr>',
      '<tr><td>2</td><td>User</td><td>Logs in, sees consent screen, approves scopes</td></tr>',
      '<tr><td>3</td><td>Auth server</td><td>Redirects back to <code>redirect_uri</code> with a short-lived <code>code</code></td></tr>',
      '<tr><td>4</td><td>Your backend</td><td>Exchanges <code>code</code> + <code>client_secret</code> for <code>access_token</code> — server-side only</td></tr>',
      '<tr><td>5</td><td>Your backend</td><td>Uses <code>access_token</code> to call the resource API on the user\'s behalf</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Node.js — Authorization Code flow</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> { AuthorizationCode } = <span class="cs-fn">require</span>(<span class="cs-st">\'simple-oauth2\'</span>);\n\n<span class="cs-kw">const</span> client = <span class="cs-kw">new</span> <span class="cs-fn">AuthorizationCode</span>({\n  client: { id: CLIENT_ID, secret: CLIENT_SECRET },\n  auth: {\n    tokenHost:    <span class="cs-st">\'https://accounts.google.com\'</span>,\n    authorizePath:<span class="cs-st">\'/o/oauth2/auth\'</span>,\n    tokenPath:    <span class="cs-st">\'/o/oauth2/token\'</span>,\n  },\n});\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/auth/google\'</span>, (req, res) => {\n  <span class="cs-kw">const</span> state = crypto.<span class="cs-fn">randomBytes</span>(<span class="cs-num">16</span>).<span class="cs-fn">toString</span>(<span class="cs-st">\'hex\'</span>);\n  req.session.oauthState = state;\n\n  <span class="cs-kw">const</span> authUrl = client.<span class="cs-fn">authorizeURL</span>({\n    redirect_uri: <span class="cs-st">\'https://app.example.com/callback\'</span>,\n    scope: <span class="cs-st">\'email profile\'</span>,\n    state,\n  });\n  res.<span class="cs-fn">redirect</span>(authUrl);\n});\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/callback\'</span>, <span class="cs-kw">async</span> (req, res) => {\n  <span class="cs-kw">if</span> (req.query.state !== req.session.oauthState)\n    <span class="cs-kw">return</span> res.status(<span class="cs-num">400</span>).<span class="cs-fn">send</span>(<span class="cs-st">\'State mismatch\'</span>);\n\n  <span class="cs-kw">const</span> tokenSet = <span class="cs-kw">await</span> client.<span class="cs-fn">getToken</span>({\n    code: req.query.code,\n    redirect_uri: <span class="cs-st">\'https://app.example.com/callback\'</span>,\n  });\n\n  <span class="cs-kw">const</span> files = <span class="cs-kw">await</span> <span class="cs-fn">fetch</span>(\n    <span class="cs-st">\'https://www.googleapis.com/drive/v3/files\'</span>,\n    { headers: { Authorization: <span class="cs-st">\'Bearer \'</span> + tokenSet.token.access_token }}\n  );\n  res.<span class="cs-fn">json</span>(<span class="cs-kw">await</span> files.<span class="cs-fn">json</span>());\n});</div>',
      '<div class="cs-insight" style="border-color:#E67E22"><span class="cs-icon" style="color:#E67E22">→</span><div>OAuth 2.0 answers <i>what can this app do</i> — it is <b>not authentication</b>. Getting an access token does not tell you who the user is. For user identity, add OpenID Connect on top. Always validate the <code>state</code> parameter to prevent CSRF attacks.</div></div>'
    ].join("")
  },
  {
    label: "OpenID Connect",
    tag: "Authentication",
    color: "#1ABC9C",
    content: [
      '<div class="cs-pill" style="background:#1ABC9C22;color:#1ABC9C">Authentication</div>',
      '<div class="cs-title">OpenID Connect (OIDC)</div>',
      '<div class="cs-sub">An <b>identity layer built on top of OAuth 2.0</b>. Adds an <b>ID token</b> — a signed JWT containing verified user info (sub, email, name). This is what powers "Sign in with Google". OAuth 2.0 answers <i>what can you do</i>; OIDC answers <i>who are you</i>.</div>',
      '<div class="cs-lbl">OIDC vs OAuth 2.0 — what changes</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Feature</th><th>OAuth 2.0 alone</th><th>+ OpenID Connect</th></tr></thead><tbody>',
      '<tr><td>Access token</td><td>Yes — for API access</td><td>Yes — same</td></tr>',
      '<tr><td>ID token</td><td>No</td><td><span class="cs-badge cs-badge-ok">Yes — signed JWT with user info</span></td></tr>',
      '<tr><td>User identity</td><td>Not defined</td><td><span class="cs-badge cs-badge-ok">sub, email, name, picture</span></td></tr>',
      '<tr><td>Discovery</td><td>No</td><td><span class="cs-badge cs-badge-ok">/.well-known/openid-configuration</span></td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Standard ID token claims</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Claim</th><th>Meaning</th><th>Required?</th></tr></thead><tbody>',
      '<tr><td><code>sub</code></td><td>Subject — unique user ID at the provider</td><td>Yes</td></tr>',
      '<tr><td><code>iss</code></td><td>Issuer URL</td><td>Yes</td></tr>',
      '<tr><td><code>aud</code></td><td>Audience — your client_id</td><td>Yes</td></tr>',
      '<tr><td><code>exp</code></td><td>Expiry timestamp</td><td>Yes</td></tr>',
      '<tr><td><code>email</code></td><td>Verified email (if scope includes email)</td><td>Optional</td></tr>',
      '<tr><td><code>name</code></td><td>Full name (if scope includes profile)</td><td>Optional</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Node.js — verify OIDC ID token with openid-client</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> { Issuer } = <span class="cs-fn">require</span>(<span class="cs-st">\'openid-client\'</span>);\n\n<span class="cs-kw">const</span> googleIssuer = <span class="cs-kw">await</span> Issuer.<span class="cs-fn">discover</span>(\n  <span class="cs-st">\'https://accounts.google.com\'</span>);\n\n<span class="cs-kw">const</span> oidcClient = <span class="cs-kw">new</span> googleIssuer.<span class="cs-fn">Client</span>({\n  client_id:      CLIENT_ID,\n  client_secret:  CLIENT_SECRET,\n  redirect_uris:  [<span class="cs-st">\'https://app.example.com/callback\'</span>],\n  response_types: [<span class="cs-st">\'code\'</span>],\n});\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/auth/google\'</span>, (req, res) => {\n  <span class="cs-kw">const</span> { url, state, nonce } = oidcClient.<span class="cs-fn">authorizationUrl</span>({\n    scope: <span class="cs-st">\'openid email profile\'</span>,\n  });\n  req.session.state = state;\n  req.session.nonce = nonce;\n  res.<span class="cs-fn">redirect</span>(url);\n});\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/callback\'</span>, <span class="cs-kw">async</span> (req, res) => {\n  <span class="cs-kw">const</span> params   = oidcClient.<span class="cs-fn">callbackParams</span>(req);\n  <span class="cs-kw">const</span> tokenSet = <span class="cs-kw">await</span> oidcClient.<span class="cs-fn">callback</span>(\n    <span class="cs-st">\'https://app.example.com/callback\'</span>, params,\n    { state: req.session.state, nonce: req.session.nonce }\n  );\n  <span class="cs-kw">const</span> claims = tokenSet.<span class="cs-fn">claims</span>();\n  <span class="cs-cm">// { sub, email, name, picture, ... }</span>\n\n  <span class="cs-kw">const</span> user = <span class="cs-kw">await</span> User.<span class="cs-fn">findOrCreate</span>({\n    googleId: claims.sub, email: claims.email, name: claims.name\n  });\n  req.session.userId = user.id;\n  res.<span class="cs-fn">redirect</span>(<span class="cs-st">\'\/\'</span>);\n});</div>',
      '<div class="cs-insight" style="border-color:#1ABC9C"><span class="cs-icon" style="color:#1ABC9C">→</span><div>Always verify the ID token\'s <code>aud</code> claim matches your <code>client_id</code>. Use <code>sub</code> (not email) as the foreign key in your DB — it is stable, while users can change their email address.</div></div>'
    ].join("")
  },
  {
    label: "SSO",
    tag: "Enterprise UX",
    color: "#2980B9",
    content: [
      '<div class="cs-pill" style="background:#2980B922;color:#2980B9">Enterprise UX</div>',
      '<div class="cs-title">Single Sign-On (SSO)</div>',
      '<div class="cs-sub">A <b>user experience pattern</b>, not a protocol itself. You authenticate once with a central <b>Identity Provider</b> (Okta, Azure AD, Google Workspace). Every connected app trusts the IdP and accepts its tokens — you never log in again. Backed by OIDC or SAML under the hood.</div>',
      '<div class="cs-lbl">SSO vs standalone auth</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Aspect</th><th>Without SSO</th><th>With SSO</th></tr></thead><tbody>',
      '<tr><td>Login count</td><td>Once per app</td><td><span class="cs-badge cs-badge-ok">Once total across all apps</span></td></tr>',
      '<tr><td>Password management</td><td>Each app stores passwords</td><td><span class="cs-badge cs-badge-ok">Only IdP stores credentials</span></td></tr>',
      '<tr><td>Offboarding</td><td>Deactivate in each app separately</td><td><span class="cs-badge cs-badge-ok">Disable in IdP — access revoked everywhere</span></td></tr>',
      '<tr><td>MFA enforcement</td><td>Per app, inconsistent</td><td><span class="cs-badge cs-badge-ok">Enforced once at IdP level</span></td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">OIDC vs SAML — which protocol backs SSO</div>',
      '<div class="cs-table-wrap"><table class="cs-table"><thead><tr><th>Feature</th><th>OIDC</th><th>SAML 2.0</th></tr></thead><tbody>',
      '<tr><td>Token format</td><td>JWT (JSON)</td><td>XML assertion</td></tr>',
      '<tr><td>Era</td><td>Modern (2014+)</td><td>Enterprise legacy (2005)</td></tr>',
      '<tr><td>Mobile-friendly</td><td>Yes</td><td>Complex</td></tr>',
      '<tr><td>Common IdPs</td><td>Okta, Auth0, Google, Azure AD</td><td>ADFS, Okta, older enterprise IdPs</td></tr>',
      '</tbody></table></div>',
      '<div class="cs-lbl">Passport.js — SSO with Google OIDC</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> passport      = <span class="cs-fn">require</span>(<span class="cs-st">\'passport\'</span>);\n<span class="cs-kw">const</span> GoogleStrategy = <span class="cs-fn">require</span>(<span class="cs-st">\'passport-google-oidc\'</span>);\n\npassport.<span class="cs-fn">use</span>(<span class="cs-kw">new</span> <span class="cs-fn">GoogleStrategy</span>({\n  clientID:     CLIENT_ID,\n  clientSecret: CLIENT_SECRET,\n  callbackURL:  <span class="cs-st">\'/auth/google/callback\'</span>,\n  scope:        [<span class="cs-st">\'openid\'</span>, <span class="cs-st">\'profile\'</span>, <span class="cs-st">\'email\'</span>],\n}, <span class="cs-kw">async</span> (issuer, profile, done) => {\n  <span class="cs-kw">const</span> user = <span class="cs-kw">await</span> User.<span class="cs-fn">findOrCreate</span>({\n    googleId: profile.id,\n    email:    profile.emails[<span class="cs-num">0</span>].value,\n    name:     profile.displayName,\n  });\n  <span class="cs-kw">return</span> <span class="cs-fn">done</span>(<span class="cs-kw">null</span>, user);\n}));\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/auth/google\'</span>,\n  passport.<span class="cs-fn">authenticate</span>(<span class="cs-st">\'google\'</span>));\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/auth/google/callback\'</span>,\n  passport.<span class="cs-fn">authenticate</span>(<span class="cs-st">\'google\'</span>, {\n    successRedirect: <span class="cs-st">\'\/\'</span>,\n    failureRedirect: <span class="cs-st">\'/login\'</span>,\n  }));</div>',
      '<div class="cs-lbl">SAML SSO with Okta (enterprise)</div>',
      '<div class="cs-code"><span class="cs-kw">const</span> saml = <span class="cs-fn">require</span>(<span class="cs-st">\'passport-saml\'</span>);\n\npassport.<span class="cs-fn">use</span>(<span class="cs-kw">new</span> saml.<span class="cs-fn">Strategy</span>({\n  entryPoint:  <span class="cs-st">\'https://yourcompany.okta.com/sso/saml\'</span>,\n  issuer:      <span class="cs-st">\'https://app.example.com\'</span>,\n  callbackUrl: <span class="cs-st">\'https://app.example.com/auth/saml/callback\'</span>,\n  cert:        process.env.OKTA_CERT,\n}, (profile, done) => {\n  User.<span class="cs-fn">findOrCreate</span>({ samlId: profile.nameID })\n    .<span class="cs-fn">then</span>(user => <span class="cs-fn">done</span>(<span class="cs-kw">null</span>, user));\n}));\n\napp.<span class="cs-fn">get</span>(<span class="cs-st">\'/auth/saml\'</span>, passport.<span class="cs-fn">authenticate</span>(<span class="cs-st">\'saml\'</span>));\napp.<span class="cs-fn">post</span>(<span class="cs-st">\'/auth/saml/callback\'</span>,\n  passport.<span class="cs-fn">authenticate</span>(<span class="cs-st">\'saml\'</span>, { successRedirect: <span class="cs-st">\'\/\'</span> }));</div>',
      '<div class="cs-insight" style="border-color:#2980B9"><span class="cs-icon" style="color:#2980B9">→</span><div>SSO\'s biggest enterprise win is <b>offboarding</b> — disable a user in Okta/Azure AD and they lose access to every connected app instantly. For new apps, use OIDC. For legacy enterprise integrations, expect SAML.</div></div>'
    ].join("")
  }
];

const root = dv.el("div", "", { attr: { id: "auth-root" } });

root.innerHTML = '<style>'
  + '#auth-root {'
  + '  font-family: var(--font-interface, sans-serif);'
  + '  font-size: 14px;'
  + '  color: var(--text-normal);'
  + '  --bg: var(--background-primary);'
  + '  --bg2: var(--background-secondary);'
  + '  --border: var(--background-modifier-border);'
  + '  --muted: var(--text-muted);'
  + '  --code: var(--code-background, var(--background-secondary));'
  + '  --mono: var(--font-monospace, monospace);'
  + '  --r: 6px;'
  + '}'
  + '#auth-tabs { display:flex; gap:4px; flex-wrap:wrap; padding:0 2px; }'
  + '.auth-tab {'
  + '  display:flex; align-items:center; gap:7px;'
  + '  padding:9px 16px;'
  + '  border-radius:var(--r) var(--r) 0 0;'
  + '  border:1px solid transparent;'
  + '  cursor:pointer; font-size:13px; font-weight:500;'
  + '  transition:all .15s; user-select:none;'
  + '}'
  + '.auth-tab.idle { background:var(--bg2); color:var(--muted); border-color:var(--border); }'
  + '.auth-tab.idle:hover { color:var(--text-normal); }'
  + '.auth-tag { font-size:10px; padding:2px 8px; border-radius:99px; font-weight:600; }'
  + '#auth-body {'
  + '  border:1px solid var(--border);'
  + '  border-radius:0 var(--r) var(--r) var(--r);'
  + '  padding:22px 24px; background:var(--bg); min-height:280px;'
  + '}'
  + '.cs-pill { display:inline-block; font-size:11px; font-weight:600; padding:3px 11px; border-radius:99px; margin-bottom:10px; letter-spacing:.04em; }'
  + '.cs-title { font-size:20px; font-weight:600; margin-bottom:8px; }'
  + '.cs-sub { color:var(--muted); line-height:1.65; margin-bottom:18px; font-size:13.5px; }'
  + '.cs-sub b, .cs-insight b { color:var(--text-normal); }'
  + '.cs-sub code, .cs-insight code { font-family:var(--mono); font-size:12px; background:var(--code); padding:1px 5px; border-radius:3px; }'
  + '.cs-lbl { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); margin:20px 0 8px; }'
  + '.cs-code {'
  + '  background:var(--code); border:1px solid var(--border);'
  + '  border-radius:0 var(--r) var(--r) var(--r);'
  + '  padding:13px 16px; font-family:var(--mono); font-size:12.5px;'
  + '  line-height:1.75; overflow-x:auto; white-space:pre; margin-bottom:12px;'
  + '}'
  + '.cs-cm  { color:var(--muted); }'
  + '.cs-kw  { color:#378ADD; font-weight:500; }'
  + '.cs-fn  { color:#D4A017; }'
  + '.cs-st  { color:#27AE60; }'
  + '.cs-num { color:#E67E22; }'
  + '.cs-code-label { font-size:11px; font-weight:600; padding:4px 12px; border-radius:5px 5px 0 0; display:inline-block; margin-top:8px; }'
  + '.cs-bad-label  { background:#E74C3C22; color:#E74C3C; }'
  + '.cs-good-label { background:#27AE6022; color:#27AE60; }'
  + '.cs-two-col { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:4px; }'
  + '.cs-table-wrap { overflow-x:auto; margin-bottom:12px; border-radius:var(--r); overflow:hidden; }'
  + '.cs-table { width:100%; border-collapse:collapse; font-size:13px; outline:1px solid var(--border); border-radius:var(--r); }'
  + '.cs-table thead tr { background:var(--bg2); }'
  + '.cs-table th { padding:7px 12px; text-align:left; font-weight:600; font-size:12px; color:var(--muted); border:1px solid var(--border); }'
  + '.cs-table td { padding:8px 12px; border:1px solid var(--border); vertical-align:top; line-height:1.5; }'
  + '.cs-table code { font-family:var(--mono); font-size:12px; background:var(--code); padding:1px 6px; border-radius:4px; }'
  + '.cs-badge { font-size:11px; font-weight:600; padding:2px 10px; border-radius:99px; white-space:nowrap; }'
  + '.cs-badge-good { background:#27AE6022; color:#27AE60; }'
  + '.cs-badge-ok   { background:#E67E2222; color:#E67E22; }'
  + '.cs-badge-bad  { background:#E74C3C22; color:#E74C3C; }'
  + '.cs-insight {'
  + '  margin-top:20px; padding:12px 16px; border-left:3px solid;'
  + '  border-radius:0 var(--r) var(--r) 0; background:var(--bg2);'
  + '  font-size:13px; color:var(--muted); line-height:1.65;'
  + '  display:flex; gap:10px; align-items:flex-start;'
  + '}'
  + '.cs-icon { font-weight:700; font-size:15px; flex-shrink:0; margin-top:2px; }'
  + '</style>'
  + '<div id="auth-tabs">'
  + tabs.map(function(t, i) {
      var active = i === 0;
      var style = active
        ? 'background:' + t.color + '18;border-color:' + t.color + ';border-bottom-color:var(--background-primary);color:' + t.color
        : '';
      var cls = active ? 'auth-tab' : 'auth-tab idle';
      return '<div class="' + cls + '" data-i="' + i + '" style="' + style + '">'
        + t.label
        + '<span class="auth-tag" style="background:' + t.color + '22;color:' + t.color + '">' + t.tag + '</span>'
        + '</div>';
    }).join('')
  + '</div>'
  + '<div id="auth-body">' + tabs[0].content + '</div>';

root.querySelectorAll(".auth-tab").forEach(function(tab) {
  tab.addEventListener("click", function() {
    var i = parseInt(tab.dataset.i);
    var t = tabs[i];
    root.querySelectorAll(".auth-tab").forEach(function(el, j) {
      if (j === i) {
        el.classList.remove("idle");
        el.style.cssText = 'background:' + t.color + '18;border-color:' + t.color + ';border-bottom-color:var(--background-primary);color:' + t.color;
      } else {
        el.classList.add("idle");
        el.style.cssText = "";
      }
    });
    root.querySelector("#auth-body").innerHTML = t.content;
  });
});
```


## Error Handling

```dataviewjs
const sections = [
  {
    num: "01",
    lang: "TypeScript",
    color: "#3178C6",
    title: "Never forget await on async calls",
    verdict: "DON'T",
    useCase: "A function calls fetchUserProfile() but forgets the await. It returns true synchronously before the fetch completes. If the fetch fails, the error logs to console — where nobody looks.",
    tip: "TypeScript won't always catch a missing await. Enable `@typescript-eslint/no-floating-promises` in your ESLint config — it flags unawaited Promises as errors.",
    good: `// DO: always await async operations
async function loadData(): Promise<boolean> {
  await fetchUserProfile()  // error surfaces properly
  return true
}`,
    bad: `// DON'T: fire-and-forget async call
function loadData() {
  fetchUserProfile()  // ← missing await
  return true         // returns before fetch even starts
  // errors silently logged to console and lost
}`
  },
  {
    num: "02",
    lang: "TypeScript",
    color: "#3178C6",
    title: "Promise.all on mutations without rollback",
    verdict: "DON'T",
    useCase: "chargeCard() and reserveInventory() run in parallel. Card charge throws — Promise.all rejects immediately. But reserveInventory() may have already succeeded, leaving inventory permanently locked.",
    tip: "Promise.all is safe for parallel reads. For mutations with side effects, run sequentially and implement explicit rollback on failure.",
    good: `// DO: sequential mutations with rollback
const charge = await chargeCard()
try {
  await reserveInventory()
} catch (err) {
  await refundCharge(charge.id)  // explicit rollback
  throw err
}`,
    bad: `// DON'T: parallel mutations, no rollback
await Promise.all([
  chargeCard(),        // fails → rejects
  reserveInventory()   // may have already succeeded
])
// result: charged card + locked inventory = broken state`
  },
  {
    num: "03",
    lang: "TypeScript",
    color: "#3178C6",
    title: "Massive catch blocks with instanceof chains",
    verdict: "DON'T",
    useCase: "Giant catch blocks with 5+ instanceof checks for AxiosError, TypeError, SyntaxError, NetworkError, plus an else fallback that nobody understands. Adding a new error type means editing every catch site.",
    tip: "Create a normaliseError() utility that maps raw errors to domain types at the boundary. Catch blocks stay thin; domain errors carry all context your app needs.",
    good: `// DO: normalise at the boundary, catch domain errors
function normaliseError(err: unknown): AppError {
  if (axios.isAxiosError(err))
    return new NetworkError(err.message)
  if (err instanceof SyntaxError)
    return new ParseError(err.message)
  return new UnknownError(String(err))
}

try {
  await fetchData()
} catch (err) {
  throw normaliseError(err)  // thin, consistent
}`,
    bad: `// DON'T: instanceof sprawl in every catch
try {
  await fetchData()
} catch (err) {
  if (err instanceof AxiosError) { ... }
  else if (err instanceof TypeError) { ... }
  else if (err instanceof SyntaxError) { ... }
  else if (err instanceof NetworkError) { ... }
  else { /* nobody knows what happens here */ }
}`
  },
  {
    num: "04",
    lang: "Go",
    color: "#00ADD8",
    title: "Comma-ok assertion + %w wrapping",
    verdict: "DO",
    useCase: "Extracting a typed value from context.Context. Direct assertion panics if the key is absent — common in background jobs and unauthenticated routes that skip auth middleware.",
    tip: "Always use comma-ok form for type assertions. Wrap errors with `fmt.Errorf(\"context: %w\", err)` so errors.Is() and errors.As() work anywhere up the call stack.",
    good: `// DO: comma-ok check + %w wrapping
val, ok := ctx.Value("user").(*User)
if !ok || val == nil {
    return fmt.Errorf("auth: no user in context")
}

if err != nil {
    return fmt.Errorf("process payment: %w", err)
    // %w preserves the chain for errors.Is / errors.As
}`,
    bad: `// DON'T: direct assertion — #1 production panic
val := ctx.Value("user").(*User)
// panics with nil pointer dereference if user absent
// crashes the entire service on unauthenticated routes
// or background jobs that skip auth middleware`
  },
  {
    num: "05",
    lang: "Go",
    color: "#00ADD8",
    title: "Pick one error strategy per codebase",
    verdict: "DON'T",
    useCase: "Four devs, four strategies in the same file: one wraps with %w, one logs and returns a zero value, one panics, one discards with _. At 50 engineers this becomes completely undebuggable.",
    tip: "Agree on one strategy at architecture review time. Write a short ADR (Architecture Decision Record). Enforce it with golangci-lint rules like `errcheck` and `wrapcheck`.",
    good: `// DO: one agreed strategy — always wrap with context
func saveUser(db *DB, u User) error {
    if err := db.Insert(u); err != nil {
        return fmt.Errorf("saveUser: %w", err)
    }
    return nil
}
// consistent: every caller can use errors.Is / errors.As`,
    bad: `// DON'T: four strategies in one codebase
return fmt.Errorf("save user: %w", err) // Dev A
log.Println(err); return User{}          // Dev B — zero value
if err != nil { panic(err) }             // Dev C
result, _ := db.Query(...)               // Dev D — discarded`
  }
];

// ── helpers ──────────────────────────────────────────────────────────
const esc = s => s
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

// ── root ─────────────────────────────────────────────────────────────
const root = dv.el("div", "", { attr: { id: "eh-root" } });

root.innerHTML = `
<style>
  #eh-root {
    font-family: var(--font-interface, sans-serif);
    font-size: 14px;
    color: var(--text-normal);
    --bg:     var(--background-primary);
    --bg2:    var(--background-secondary);
    --border: var(--background-modifier-border);
    --muted:  var(--text-muted);
    --code:   var(--code-background, var(--background-secondary));
    --mono:   var(--font-monospace, monospace);
    --r: 8px;
  }

  /* ── top tab strip ── */
  #eh-root .eh-tabs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding: 14px 14px 0;
    border: 1px solid var(--border);
    border-bottom: none;
    border-radius: var(--r) var(--r) 0 0;
    background: var(--bg2);
  }
  #eh-root .eh-tab {
    padding: 8px 14px;
    border-radius: 99px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .05em;
    cursor: pointer;
    transition: all .15s;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }
  #eh-root .eh-tab:hover { color: var(--text-normal); }
  #eh-root .eh-tab.active {
    color: var(--text-normal);
    background: color-mix(in srgb, var(--eh-accent) 14%, var(--bg));
    border-color: color-mix(in srgb, var(--eh-accent) 40%, var(--border));
  }
  #eh-root .eh-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 99px;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  /* ── main panel ── */
  #eh-root .eh-panel { display: none; }
  #eh-root .eh-panel.active { display: block; }

  #eh-root .eh-body {
    border: 1px solid var(--border);
    border-radius: 0 0 var(--r) var(--r);
    background: var(--bg);
    padding: 0;
    overflow: hidden;
  }

  /* ── header strip ── */
  #eh-root .eh-head {
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
  }
  #eh-root .eh-kicker {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  #eh-root .eh-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #eh-root .eh-verdict {
    font-size: 10px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 99px;
    letter-spacing: .07em;
  }
  #eh-root .verdict-do   { background: #27AE6020; color: #27AE60; }
  #eh-root .verdict-dont { background: #E74C3C20; color: #E74C3C; }

  #eh-root .eh-meta {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.65;
    margin-bottom: 6px;
  }
  #eh-root .eh-meta b { color: var(--text-normal); font-weight: 600; }

  /* ── code comparison ── */
  #eh-root .eh-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  #eh-root .eh-col {
    border-top: 1px solid var(--border);
    overflow: hidden;
  }
  #eh-root .eh-col + .eh-col {
    border-left: 1px solid var(--border);
  }
  #eh-root .eh-col-head {
    padding: 8px 14px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  #eh-root .eh-col-head.good {
    background: #27AE6012;
    color: #27AE60;
    border-bottom-color: #27AE6030;
  }
  #eh-root .eh-col-head.bad {
    background: #E74C3C12;
    color: #E74C3C;
    border-bottom-color: #E74C3C30;
  }
  #eh-root .eh-col pre {
    margin: 0;
    padding: 14px 16px;
    overflow-x: auto;
    background: var(--code);
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.72;
    white-space: pre;
  }

  /* ── tip footer ── */
  #eh-root .eh-tip {
    border-top: 1px solid var(--border);
    padding: 12px 20px;
    font-size: 12.5px;
    color: var(--muted);
    line-height: 1.6;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    background: var(--bg2);
  }
  #eh-root .eh-tip-icon {
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  #eh-root .eh-tip code {
    font-family: var(--mono);
    font-size: 11.5px;
    background: var(--code);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--text-normal);
  }
  #eh-root .eh-tip b { color: var(--text-normal); font-weight: 600; }

  @media (max-width: 700px) {
    #eh-root .eh-compare { grid-template-columns: 1fr; }
    #eh-root .eh-col + .eh-col { border-left: none; border-top: 1px solid var(--border); }
  }
</style>

<!-- Tab strip -->
<div class="eh-tabs">
  ${sections.map((s, i) => `
    <button
      class="eh-tab ${i === 0 ? "active" : ""}"
      data-idx="${i}"
      style="--eh-accent:${s.color}"
    >
      <span style="color:${s.color}">${s.num}</span>
      <span class="eh-badge" style="background:${s.color}20;color:${s.color}">${s.lang}</span>
    </button>
  `).join("")}
</div>

<!-- Panels -->
<div class="eh-body">
  ${sections.map((s, i) => `
    <div class="eh-panel ${i === 0 ? "active" : ""}" data-panel="${i}">
      <div class="eh-head">
        <div class="eh-kicker" style="color:${s.color}">Point ${s.num} · ${s.lang}</div>
        <div class="eh-title">
          ${s.title}
          <span class="eh-verdict ${s.verdict === "DO" ? "verdict-do" : "verdict-dont"}">
            ${s.verdict === "DO" ? "✓ DO" : "✕ DON'T"}
          </span>
        </div>
        <div class="eh-meta">${s.useCase}</div>
      </div>
      <div class="eh-compare">
        <div class="eh-col">
          <div class="eh-col-head good">✓ Good pattern</div>
          <pre><code>${esc(s.good)}</code></pre>
        </div>
        <div class="eh-col">
          <div class="eh-col-head bad">✕ Avoid this</div>
          <pre><code>${esc(s.bad)}</code></pre>
        </div>
      </div>
      <div class="eh-tip">
        <span class="eh-tip-icon" style="color:${s.color}">→</span>
        <div>${s.tip}</div>
      </div>
    </div>
  `).join("")}
</div>
`;

// ── tab switching ──────────────────────────────────────────────────────
root.querySelectorAll(".eh-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const idx = parseInt(tab.dataset.idx);
    const s   = sections[idx];

    root.querySelectorAll(".eh-tab").forEach((t, j) => {
      t.classList.toggle("active", j === idx);
      t.style.setProperty("--eh-accent", sections[j].color);
    });

    root.querySelectorAll(".eh-panel").forEach((p, j) => {
      p.classList.toggle("active", j === idx);
    });
  });
});
```

### Ref
https://www.youtube.com/watch?v=XDTov7xaD7g
#ref 