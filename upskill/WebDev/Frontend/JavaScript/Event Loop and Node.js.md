> [!summary]
> JavaScript executes one call stack at a time while host environments coordinate timers, I/O, and queued callbacks around that stack.

Map: [[Upskill/WebDev/Frontend/JavaScript/JavaScript|JavaScript]]

## Browser Event Loop

The runtime repeatedly follows this shape:

1. Run the current synchronous task to completion.
2. Drain queued microtasks, including promise reactions.
3. Let the browser render when appropriate.
4. Start the next task, such as a timer or input event.

```javascript
console.log("start");

setTimeout(() => console.log("timer"), 0);
Promise.resolve().then(() => console.log("promise"));

console.log("end");
```

```text
start
end
promise
timer
```

The timer delay is a minimum waiting period, not a guarantee that the callback runs at that exact time.

## Callback Example

```javascript
function loadMessage(callback) {
  setTimeout(() => callback("loaded"), 1000);
}

console.log("before");
loadMessage(message => console.log(message));
console.log("after");
```

Synchronous output appears first; the callback runs in a later task.

## Node.js and libuv

Node.js runs JavaScript callbacks on an event-loop thread. The host delegates many operating-system operations to asynchronous APIs, while libuv also provides a worker pool for selected operations such as file-system work and some DNS or crypto tasks.

Important queue families include:

- timers such as `setTimeout`
- pending and poll callbacks for I/O
- check callbacks such as `setImmediate`
- close callbacks
- microtasks, including promises and Node's `process.nextTick`

Avoid blocking the event-loop thread with long CPU work. Move CPU-heavy tasks to worker threads or another service when latency matters.

## Related

- [[Upskill/CS Topics/Concurrency-Parallelism-Async|Concurrency, Parallelism, and Async]]
- [[Upskill/WebDev/Frontend/JavaScript/Scope Functions and Closures|Scope, Functions, and Closures]]
- [[Upskill/WebDev/Frontend/JavaScript/Debouncing and Throttling|Debouncing and Throttling]]
- [[Upskill/ProgramLang/Python/Concurrency and I-O|Python Concurrency and I/O]]

#javascript #concurrency

---

## References

- [The Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop) - Browser execution model.
- [Node.js Event Loop](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) - Node event-loop phases and scheduling.
- [Visual Guide to the Node.js Event Loop](https://www.builder.io/blog/visual-guide-to-nodejs-event-loop) - Illustrated queue walkthrough.
