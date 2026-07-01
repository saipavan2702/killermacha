## The Core Idea

HTTP methods are **labels for intent**. The server can technically do anything regardless of the method, but the label tells every piece of infrastructure in between — browsers, caches, proxies, crawlers, API tools — what kind of action to expect.

**"State"** = what's stored on the server: user profiles, cart contents, database rows, files, payment status, etc.

**"Mutate state"** = change that stored reality.

## The Full Map

| Method | Plain English | Mutates State? | Idempotent? | Safe? |
|--------|--------------|:--------------:|:-----------:|:-----:|
| `GET` | Read a resource | No | Yes | Yes |
| `HEAD` | Same as GET, but return headers only — no body | No | Yes | Yes |
| `OPTIONS` | Ask the server: "what methods do you support here?" | No | Yes | Yes |
| `QUERY` | Read a resource, but send the query in the body | No | Yes | Yes |
| `POST` | Submit, process, or create something | Usually yes | No | No |
| `PUT` | Fully replace a resource | Yes | Yes | No |
| `PATCH` | Partially update a resource | Yes | Sometimes | No |
| `DELETE` | Remove a resource | Yes | Yes | No |

## Two Key Concepts

### Safe
> "This request is not supposed to change anything on the server."

`GET`, `HEAD`, `OPTIONS`, `QUERY` are safe.

Logs and analytics may still fire — that doesn't count. "Safe" refers to the main resource state, not side effects.

### Idempotent
> "Send this request 1 time or 10 times — the final server state is the same."

This does **not** mean "nothing changes." It means repeating the request doesn't compound the change.

```
PUT /users/42  { "name": "Maya" }
→ Send 5 times → user 42 is still named Maya ✅ idempotent

DELETE /posts/7
→ Send 5 times → post 7 is gone (same outcome) ✅ idempotent

POST /orders  { "item": "keyboard" }
→ Send 5 times → 5 orders created ❌ not idempotent
```


## Method-by-Method Breakdown

### `GET` — Read something
The workhorse. Fetch a resource. Query info goes in the URL.

```http
GET /users/42
GET /products?category=shoes&sort=price
```

No body. No side effects. Cacheable.


### `HEAD` — Read headers only
Identical to `GET`, but the server sends back only headers — no response body.

Useful for: checking if a resource exists, checking file size before downloading, validating a cache.

```http
HEAD /files/report.pdf
→ Returns: Content-Length, Last-Modified, Content-Type — but not the file itself
```


### `OPTIONS` — Ask what's allowed
The server responds with which methods are supported at that URL. Mostly used internally by browsers for CORS preflight checks.

```http
OPTIONS /api/users
→ Allow: GET, POST, PUT, DELETE
```


### `QUERY` — Read with a body *(newer, not yet universal)*
Like `GET`, but you can put the query in the request body. Designed for complex searches where the URL would get too long or awkward.

```http
QUERY /products
{
  "filters": { "category": "shoes", "price": { "max": 100 } },
  "sort": ["rating", "desc"],
  "fields": ["name", "price", "image"]
}
```

Still safe and idempotent — it's a read. No state changes.

**Why not just use `POST /search`?** You could, and many APIs do. But `POST` implies something might change. `QUERY` signals clearly: this is still just a read.


### `POST` — Create or process
The most flexible method. "Here's some data — do something with it."

```http
POST /orders          → creates a new order
POST /auth/login      → processes credentials
POST /emails/send     → triggers an action
POST /payments        → initiates a payment
```

Not idempotent by default — sending twice may create two orders, two emails, two charges.


### `PUT` — Full replacement
Replace the entire resource with what you're sending. If a field isn't in your body, it's gone.

```http
PUT /users/42
{ "name": "Maya", "email": "maya@example.com", "role": "admin" }
```

If user 42 had a `phone` field and you don't include it → it gets wiped.

Idempotent: send it 5 times, the result is the same complete replacement.


### `PATCH` — Partial update
Update only the fields you send. Everything else stays untouched.

```http
PATCH /users/42
{ "email": "new@example.com" }
→ Only email changes. Name, role, phone — all preserved.
```

Idempotent? Depends on the operation:

```http
PATCH /counter { "increment": 1 }
→ Send 5 times → counter goes up 5 ❌ not idempotent

PATCH /users/42 { "name": "Maya" }
→ Send 5 times → name is still Maya ✅ effectively idempotent
```


### `DELETE` — Remove a resource

```http
DELETE /posts/99
```

Idempotent: deleting something that's already gone still results in it being gone. The server may return `200` the first time and `404` after, but the *state* is the same.


## Quick Decision Guide

```
Do you want to READ data?
├── Simple query in the URL?          → GET
├── Complex query needing a body?     → QUERY
└── Just need to check existence?     → HEAD

Do you want to WRITE data?
├── Create something new?             → POST
├── Replace something completely?     → PUT
├── Update just a few fields?         → PATCH
└── Remove something?                 → DELETE

Do you want to INSPECT the server?
└── What methods are supported here?  → OPTIONS
```

Safe ⊂ Idempotent — everything safe is also idempotent, but not vice versa (`PUT`, `DELETE`).