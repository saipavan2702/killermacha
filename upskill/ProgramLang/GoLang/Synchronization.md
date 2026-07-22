> [!summary]
> Mutexes, read-write locks, once guards, wait groups, and channels coordinate shared work between goroutines.

Map: [[Upskill/ProgramLang/Golang/Go|Go]]
Connections: [[Upskill/ProgramLang/Golang/Channels and Select|Channels and Select]], [[Upskill/ProgramLang/Golang/Context|Context]]

## Shared-State Primitives

```go
type ConcurrentStore struct {
    bookings map[string]Booking
    sync.RWMutex  // ← embedded, not a named field
}

s.RWMutex.Lock()  // explicit — accessing via the embedded type name
s.Lock()          // shorthand — promoted method, same thing
s.Unlock()        // same as s.RWMutex.Unlock()
```


**1. `sync.Mutex` — Basic lock**
```go
var mu sync.Mutex
mu.Lock()
defer mu.Unlock()
```
> 🚪 One person in at a time. Everyone else waits. Use when you don't need separate read/write locks.

**2. `sync.RWMutex` — Read/Write lock** *(you already know this)*
```go
mu.Lock() / mu.Unlock()    // writing
mu.RLock() / mu.RUnlock()  // reading
```
> 👀 Many readers OR one writer. Never both at same time.


**3. `sync.Once` — Run something only once**
```go
var once sync.Once
once.Do(func() {
    fmt.Println("runs only once, ever")
})
```
> 🎯 Even if 100 goroutines hit this, the function runs **once**. Great for initializing shared resources.

**4. `sync.WaitGroup` — Wait for goroutines to finish**
```go
var wg sync.WaitGroup
wg.Add(1)
go func() {
    defer wg.Done()
    // do work
}()
wg.Wait() // blocks until Done() called
```
> ⏳ "Don't move on until all workers are finished."


**5. Channels — Go's preferred way**
```go
ch := make(chan int, 1) // buffered = acts like a lock
ch <- 1                 // lock
<-ch                    // unlock
```
> 💬 Go's motto: *"Don't communicate by sharing memory, share memory by communicating."* Channels are often cleaner than locks.



In Go, a type implements an interface automatically if it has all the methods required by that interface.

---
