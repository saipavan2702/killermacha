---
title: Golang
tags:
  - "#lang"
  - "#golang"
date: 2025-12-24
---
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
