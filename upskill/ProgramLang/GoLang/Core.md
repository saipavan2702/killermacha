---
title: Golang
tags:
  - "#lang"
  - "#golang"
date: 2025-12-24
---
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
## Channels
Channels are Go’s way of letting **go routines communicate safely** with each other.  
Think of a channel as a **pipe**: one go-routine sends values into it, another go routine receives values from it.

```go
// Unbuffered channel
c := make(chan int)

// Buffered channel with capacity 5
c := make(chan string, 5)
```

- **Unbuffered**: send blocks until a receive happens.  
- **Buffered**: can hold up to `N` values before blocking.

```go
c := make(chan int)

// Send
c <- 42

// Receive
x := <-c
fmt.Println(x) // 42
```

```
[ Goroutine A ] --42--> [ Channel ] --> [ Goroutine B ]
```

- `c <- 42` puts `42` into the channel.  
- `<-c` pulls the value out.

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    c := make(chan string)

    // Sender
    go func() {
        time.Sleep(1 * time.Second)
        c <- "Hello from goroutine"
    }()

    // Receiver waits until value is sent
    msg := <-c
    fmt.Println(msg)
}
```

```
Main goroutine  ──────── wait <─┐
Worker goroutine ── send "Hello" ─┘
```

```go
c := make(chan int, 2)

c <- 1
c <- 2   // still okay (buffer size = 2)

// Receive
fmt.Println(<-c) // 1
fmt.Println(<-c) // 2

Channel buffer [ 1 | 2 ]  (capacity 2)
```

- Sender can place 2 values before blocking.  
- Once buffer is full, sender **blocks** until a receiver consumes.

```go
c := make(chan int)

go func() {
    for i := 0; i < 3; i++ {
        c <- i
    }
    close(c)
}()

for v := range c {
    fmt.Println(v) // 0 1 2
}

[ Sender ] → 0 → 1 → 2 → [close]
[ Receiver ] reads until channel is closed
```

##  Select Statement (Multiple Channels)

```go
c1 := make(chan string)
c2 := make(chan string)

go func() { c1 <- "from c1" }()
go func() { c2 <- "from c2" }()

select {
case msg1 := <-c1:
    fmt.Println(msg1)
case msg2 := <-c2:
    fmt.Println(msg2)
case <-time.After(1 * time.Second):
    fmt.Println("timeout")
}
```

```
Wait for whichever channel responds first:
   ┌── c1 → "from c1"
   ├── c2 → "from c2"
   └── timeout (1s)
```
##  Channels in Your Crawler

```go
c := make(chan []byte)

go fetchPage(url, c)   // worker fetches the page
content := <-c         // main goroutine waits here
parseHTML(url, content, &queue, &crawled, &db)

// [ fetchPage goroutine ] → (HTML []byte) → [ channel ] → [ main goroutine ]
```

This ensures the main go routine only parses once the page is fully fetched.

## ✅ Key Takeaways

1. **Unbuffered channels** → synchronize sender & receiver.  
2. **Buffered channels** → allow limited queuing of messages.  
3. **close + range** → clean way to signal completion.  
4. **select** → powerful for handling multiple channels & timeouts.  
5. Channels are the backbone of **safe concurrency in Go**.

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

## Interfaces

An interface in Go is just a contract: "if you have this method, you qualify." You never say "I implement this interface" — Go checks automatically.
```go
// The contract
type io.Writer interface {
  Write(p []byte) (n int, err error)
}

// os.File has Write() → qualifies as io.Writer
// net.Conn has Write() → qualifies as io.Writer
// bytes.Buffer has Write() → qualifies as io.Writer
```

>[!tip]
> Think of it like a power socket. Any plug with the right shape fits — it doesn't matter who made it or what it does inside.
The core idea — an interface is just a shape-check. If your type has the right method signature, it fits. `io.Writer` requires exactly one method: Write([]byte) (int, error). Once you have that, any function accepting `io.Writer` will work with your type.
> Also the print functions
> 
 > - Plain Print → always stdout
 > - Fprint (F = file/writer) → you supply the destination
>  - Sprint (S = string) → returns a string, no output at all

```go
package main

import "fmt"

// Define an interface
type Shape interface {
	Area() float64
}

// Define a struct
type Rectangle struct {
	Width  float64
	Height float64
}

// Implement the interface method
func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func printArea(s Shape) {
	fmt.Println("Area:", s.Area())
}

func main() {
	rect := Rectangle{
		Width:  10,
		Height: 5,
	}
	var _ Shape = Rectangle{} // compile-check
	var _ Counter = (*Number)(nil) // similar for nil-pinter type

	printArea(rect)
}
```

A example on struct
```go
package main

import (
	"encoding/json"
	"fmt"
)

type UserWrong struct {
	Name  string `json:"name"`
	email string `json:"email"`
	Age   int    `json:"age"`
}

type UserRight struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Age   int    `json:"age"`
}

func main() {

	wrong := UserWrong{
		Name:  "Patrik",
		email: "wrong@example.com",
		Age:   90,
	}

	right := UserRight{
		Name:  "Patrik",
		Email: "right@example.com",
		Age:   90,
	}

	wrongJSON, _ := json.Marshal(wrong)
	rightJSON, _ := json.Marshal(right)

	fmt.Println("Wrong User JSON:", string(wrongJSON))
	fmt.Println("Right User JSON:", string(rightJSON))
}
```

>[!tip]
>| Verb  | Use               |
| ----- | ----------------- |
| `%v`  | Any value         |
| `%+v` | Struct debugging  |
| `%#v` | Go representation |
| `%T`  | Type              |
| `%d`  | Integer           |
| `%f`  | Float             |
| `%s`  | String            |
| `%q`  | Quoted            |
| `%t`  | Bool              |
| `%p`  | Pointer           |
| `%x`  | Hex               |
| `%w`  | Wrap error        |


### References
https://www.youtube.com/watch?v=6DiCscb0gWk

#ref #golang 