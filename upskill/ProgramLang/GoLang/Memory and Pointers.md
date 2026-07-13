# Go Memory and Pointers

> [!summary]
> Stack lifetime, heap escape, garbage collection, and pointer semantics determine when Go copies data and how long it remains alive.

## Stack and Heap

Yes, **both stack and heap are in RAM**.
```code
RAM
├── Stack area
├── Heap area
├── Code area
├── Global variables area
└── Other runtime/OS memory
```
### Stack
The **stack** is used for function calls and local variables.
Example:
```go
func add() {
	x := 10
	y := 20
	fmt.Println(x + y)
}
//Here `x` and `y` may live on the stack.
//Stack memory is very fast and simple
//function starts  -> memory added
//function ends    -> memory removed
```

In Go, each goroutine has its own stack.
```go
go myFunction()
```
That goroutine gets its own stack memory.

### Heap
The **heap** is used for values that may need to live longer or have more flexible lifetime.
Example:
```go
func createUser() *User {
	user := User{Name: "Amit"}
	return &user
}
//Here, `user` cannot be destroyed when the function ends because its address is returned.
//Heap memory is managed by garbage collection.
//object created
//object used
//no one references it anymore
//GC cleans it later
```
### Very simple example
```go
func test() {
	a := 10
	b := &User{Name: "Amit"}

	fmt.Println(a, b.Name)
}
//Stack:
// a
// b  ---- points to ----> Heap: User{Name: "Amit"}

a := 10
//`a` may be directly on the stack.

b := &User{Name: "Amit"}
//`b` itself may be on the stack, but the `User` object it points to may be on the heap.
```

Difference is **how they are used and cleaned**:
```text
Stack = temporary function memory
Heap  = longer-living memory managed by GC
```

---

## Pointers
Once you understand why we use pointers and when to use them, it becomes crystal clear. One such use is to pass a value as a param to a function.
For example, if your param value is a datatype / struct which takes a lot of memory, for example let's take a struct which for example is 80 MB of good old int (hypothetical for understanding purpose), you don't want to pass the entire struct as a param, that's because by default golang makes a copy of each value passed as param to a function. This means your function will make a copy of the struct each time the function is called.
So how do we solve this, we can instead point to the huge struct and tell the compiler - here is where the value resides (memory address), just check what's the value and directly work on that. Don't make any copies. That's what unpacking a pointer does. So you only pass an 8 byte pointer instead of 80 MB struct every time, which saves on CPU time and also memory.

```go
package main

import "fmt"

type Huge struct {
    data [10_000_000]int // ~80 MB (10 million * 8 bytes)
}

// Function taking Huge by value (copies entire struct)
func processByValue(h Huge) int {
    return h.data[0]
}

// Function taking Huge by pointer (only 8-byte pointer copied)
func processByPointer(h *Huge) int {
    return h.data[0]
}

func main() {
    var big Huge
    big.data[0] = 123

    // Passing by value (will copy ~80MB each call)
    fmt.Println(processByValue(big))

    // Passing by pointer (just copies an 8-byte pointer)
    fmt.Println(processByPointer(&big))
}
```

```go
BY VALUE — processByValue(big)
┌─────────────────────────────────────────────┐
│  RAM                                        │
│                                             │
│  original `big`  →  [####...80MB...####]    │
│                              ↓  COPY        │
│  function's `h`  →  [####...80MB...####]    │
│                                             │
│  Two copies of 80MB exist simultaneously!   │
└─────────────────────────────────────────────┘

BY POINTER — processByPointer(&big)
┌─────────────────────────────────────────────┐
│  RAM                                        │
│                                             │
│  original `big`  →  [####...80MB...####]    │
│                              ↑              │
│  pointer `h`  →  [ 0xC000014080 ]  (8 bytes)│
│                    "go look HERE"           │
│                                             │
│  Only ONE copy of 80MB exists. Ever.        │
└─────────────────────────────────────────────┘
```

The `10_000_000` is just Go letting you write underscores as visual separators (like commas in a number) — so `10_000_000` = `10000000`. Makes it readable.
### The `&` and `*` decoded

| Symbol | Name | What it does |
|--------|------|--------------|
| `&big` | address-of | "Give me the **memory address** where `big` lives" |
| `*Huge` | pointer type | "This variable holds an **address** pointing to a `Huge`" |
| `h.data[0]` | auto-deref | Go automatically follows the pointer for you |

In the last line, `h.data[0]` — Go could've made you write `(*h).data[0]` (manually unpack the pointer, then access the field), but Go does this **automatically** for structs, so `h.data[0]` just works.
Every function call with `processByValue(big)` secretly does this behind the scenes:

```go
h := big  // silent copy of 80MB — you never wrote this, but Go does it
```

Whereas `processByPointer(&big)` does:
```go
h := &big  // copy of one memory address — 8 bytes, done
```

That's the entire trade-off. A pointer is just a **sticky note with an address on it** — lightweight, fast, and points Go to the real data.

---
