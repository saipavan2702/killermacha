> [!summary]
> Debouncing waits for activity to stop; throttling limits activity to at most once per interval.

Map: [[Upskill/WebDev/Frontend/JavaScript/JavaScript|JavaScript]]
Connections: [[Upskill/WebDev/Frontend/JavaScript/Event Loop and Node.js|Event Loop and Node.js]], [[Upskill/WebDev/Frontend/React|React]], [[Upskill/WebDev/Frontend/Request Waterfalls|Request Waterfalls]]

## Choose the Behavior

| Need | Technique | Typical example |
| --- | --- | --- |
| Run after rapid input stops | Debounce | Search suggestions, validation, resize completion |
| Run periodically during continuous input | Throttle | Scroll tracking, drag updates, telemetry |

## Debounce

Each call resets the timer. Only the latest call survives the quiet period.

```javascript
function debounce(fn, delay) {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce(query => {
  console.log("search", query);
}, 300);
```

## Throttle

Calls inside the interval are ignored in this simple leading-edge implementation.

```javascript
function throttle(fn, interval) {
  let lastRun = 0;

  return function throttled(...args) {
    const now = Date.now();
    if (now - lastRun < interval) return;

    lastRun = now;
    return fn.apply(this, args);
  };
}

const reportScroll = throttle(() => {
  console.log(window.scrollY);
}, 200);
```

Production helpers may also support leading/trailing execution, cancellation, and flushing. Decide those semantics before choosing an implementation.

#javascript #performance

---

## References

- [Debounce](https://www.30secondsofcode.org/js/s/debounce-function/) - Compact debounce implementation.
- [Debouncing and Throttling](https://javascript.plainenglish.io/debouncing-and-throttling-in-javascript-3c8f8cf5e645) - Behavioral comparison.
