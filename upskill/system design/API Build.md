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

