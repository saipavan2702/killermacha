> [!summary]
> A JavaScript function resolves names through its lexical scope and carries that surrounding environment with it when used as a closure.

Map: [[Upskill/WebDev/Frontend/JavaScript/JavaScript|JavaScript]]

## Scope Chain

Each function invocation gets its own execution context. A name is resolved in the current scope, then each enclosing lexical scope, and finally the global scope.

```javascript
const value = 1;

function outer() {
  const value = 10;

  function inner() {
    console.log(value);
  }

  inner();
}

outer(); // 10
console.log(value); // 1
```

## Hoisting and the Temporal Dead Zone

Function declarations are available before their source position. A `var` declaration is hoisted and initialized to `undefined`. A `let` or `const` binding exists from the start of its block but cannot be accessed before its declaration is evaluated; this period is the temporal dead zone.

```javascript
console.log(a); // undefined
var a = 10;

console.log(b); // ReferenceError
let b = 10;
```

Prefer `const` by default and `let` when reassignment is necessary. Avoid `var` in new code unless its function-scoped behavior is specifically required.

## Closures

A closure is a function together with references to the lexical environment where it was created.

```javascript
function counter() {
  let count = 0;

  return () => {
    count += 1;
    return count;
  };
}

const next = counter();
next(); // 1
next(); // 2
```

The returned function keeps `count` reachable even after `counter()` has finished.

## Closures in Loops

`var` creates one function-scoped binding shared by every callback. `let` creates a fresh binding for each loop iteration.

```javascript
for (var i = 0; i < 3; i += 1) {
  setTimeout(() => console.log(i), 0);
}
// 3, 3, 3

for (let j = 0; j < 3; j += 1) {
  setTimeout(() => console.log(j), 0);
}
// 0, 1, 2
```

## Arrow Functions

Arrow functions are concise function expressions, but they do not create their own `this` or `arguments`, cannot be called with `new`, and are not available before their initialization.

```javascript
const team = {
  name: "Platform",
  members: ["Asha", "Sam"],
  labels() {
    return this.members.map(member => `${this.name}: ${member}`);
  }
};
```

## Related

- [[Upskill/WebDev/Frontend/JavaScript/Event Loop and Node.js|Event Loop and Node.js]]
- [[Upskill/WebDev/Frontend/JavaScript/Objects Classes and Prototypes|Objects, Classes, and Prototypes]]

#javascript #functions

---

## References

- [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures) - Lexical environments and closure patterns.
- [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) - Behavioral differences from normal functions.
