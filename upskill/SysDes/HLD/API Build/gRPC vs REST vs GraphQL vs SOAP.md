> [!summary]
> Choose an API style from client needs, schema guarantees, transport efficiency, caching, and organizational constraints.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/HLD/API Build/Pagination|Pagination]]

These four are common API styles/protocols. None is always "best"; the better choice depends on who consumes the API, how much performance matters, how strict the contract needs to be, and how flexible the client queries must be.

## Quick Decision Guide

| Situation | Better choice | Why |
| --- | --- | --- |
| Public API for unknown clients | REST | Easy to understand, easy to test, works everywhere |
| Simple CRUD backend | REST | Maps naturally to resources like users, orders, posts |
| Complex frontend needs different data shapes | GraphQL | Client can request exactly the fields it needs |
| Mobile app wants fewer network calls | GraphQL | One query can fetch nested data that may need many REST calls |
| Internal microservices need low latency | gRPC | Binary payloads, HTTP/2, generated typed clients |
| Real-time streaming between services | gRPC | Built-in server/client/bidirectional streaming |
| Enterprise legacy integration | SOAP | WSDL contracts and WS-* standards are common in older systems |
| Banking/telecom/vendor system with strict XML contracts | SOAP | Strong formal contract and mature enterprise tooling |

## Core Difference

| Feature | REST | GraphQL | gRPC | SOAP |
| --- | --- | --- | --- | --- |
| API model | Resources | Query graph | Remote procedure calls | XML messages/actions |
| Common payload | JSON | JSON | Protobuf binary | XML |
| Transport | Usually HTTP/1.1 or HTTP/2 | HTTP | HTTP/2 | HTTP, SMTP, others |
| Contract | OpenAPI optional | Strong schema | `.proto` required | WSDL required |
| Browser friendliness | Excellent | Excellent | Needs gRPC-Web/proxy | Poor for modern frontend use |
| Human readability | High | High | Low | Medium but verbose |
| Caching | Strong HTTP caching | Harder, custom caching | Not HTTP-cache friendly | Possible but uncommon |
| Streaming | Limited | Subscriptions exist | First-class streaming | Possible but heavy |
| Best mental model | "Expose resources" | "Client asks for a shape" | "Call a function on another service" | "Exchange strict XML envelopes" |

## REST

REST means Representational State Transfer. In practice, most REST APIs expose resources through URLs and use HTTP methods to act on them.

```http
GET /users/42
POST /users
PATCH /users/42
DELETE /users/42
```

### Why REST Is Good

- Very simple mental model: resources + HTTP verbs.
- Works naturally with browsers, curl, Postman, proxies, CDNs, and caches.
- Great for public APIs because almost every developer understands it.
- Easy to debug because payloads are usually JSON.

### REST Problems

- Can over-fetch: `/users/42` may return fields the client does not need.
- Can under-fetch: one screen may need `/users`, `/orders`, `/payments`, and `/reviews`.
- Versioning needs discipline: `/v1`, `/v2`, compatible schema changes, deprecations.

### Choose REST When

- You are building a CRUD API.
- You want a public developer-friendly API.
- You want simple HTTP caching.
- Your clients are web, mobile, or third-party integrations.

## GraphQL

GraphQL lets the client ask for exactly the data shape it wants. Instead of many endpoints, there is usually one endpoint and a schema.

```graphql
query {
  user(id: "42") {
    name
    orders {
      id
      total
    }
  }
}
```

### Why GraphQL Is Good

- Client controls the response shape.
- Reduces over-fetching and under-fetching.
- Great when different clients need different fields.
- Useful as an aggregation layer over many backend services.

### GraphQL Problems

- More backend complexity than REST.
- Caching is harder because every query can be shaped differently.
- Query cost must be controlled, or clients can send expensive nested queries.
- File uploads, HTTP semantics, and status codes can feel less natural.

### Choose GraphQL When

- Frontend screens need flexible nested data.
- Mobile clients need fewer round trips.
- Multiple clients need different response shapes.
- You want one API gateway over many backend services.

## gRPC

gRPC is a contract-first RPC framework. You define services and messages in `.proto` files, generate client/server code, and communicate over HTTP/2 using Protobuf.

```proto
service UserService {
  rpc GetUser (GetUserRequest) returns (User);
}

message GetUserRequest {
  string id = 1;
}
```

### Why gRPC Is Good

- Very fast and compact because Protobuf is binary.
- Strong contracts through `.proto` files.
- Generated clients reduce manual integration errors.
- Excellent for service-to-service communication.
- Supports four communication patterns:
  - Unary: one request, one response.
  - Server streaming: one request, many responses.
  - Client streaming: many requests, one response.
  - Bidirectional streaming: both sides stream at the same time.

### gRPC Problems

- Not as browser-friendly without gRPC-Web or a proxy.
- Harder to inspect manually because payloads are binary.
- Public API consumers may find it less approachable than REST.
- Schema evolution must be handled carefully.

### Choose gRPC When

- Internal services talk to each other frequently.
- Low latency and high throughput matter.
- You want strict typed contracts across languages.
- You need streaming for logs, chat, telemetry, or live updates.

## SOAP

SOAP is an older XML-based protocol with strict message envelopes, WSDL contracts, and enterprise standards.

```xml
<soap:Envelope>
  <soap:Body>
    <GetUser>
      <UserId>42</UserId>
    </GetUser>
  </soap:Body>
</soap:Envelope>
```

### Why SOAP Is Good

- Very strict formal contract through WSDL.
- Mature enterprise standards for security, transactions, and reliability.
- Common in legacy enterprise, banking, telecom, insurance, and government systems.

### SOAP Problems

- XML is verbose.
- Developer experience is heavier than REST or GraphQL.
- Poor fit for modern browser/mobile product APIs.
- Tooling feels legacy in many stacks.

### Choose SOAP When

- You must integrate with a legacy enterprise system.
- The vendor requires WSDL/XML.
- You need WS-Security or related enterprise standards.

## Which Is Better?

There is no universal winner.

- **REST is the best default** for public APIs and simple CRUD systems.
- **GraphQL is better for frontend flexibility** when clients need custom nested data.
- **gRPC is better for internal high-performance service calls** and streaming.
- **SOAP is better only when enterprise/legacy constraints require it**.

For most modern systems, start with REST. Move to GraphQL when frontend data-fetching becomes painful. Use gRPC behind the scenes for microservices that need speed and strict contracts. Use SOAP when the ecosystem forces it.


#sysdes #api
