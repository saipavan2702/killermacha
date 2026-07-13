# Context

> [!summary]
> Go context carries cancellation, deadlines, and request-scoped values across API boundaries and concurrent work.

Context provides a mechanism to control the lifecycle, cancellation, and propagation of requests across multiple goroutines.
This aids in the management of go routines.
With context we can create hierarchies of goroutines and pass the information down the chain.

## Using Context in managing concurrent API requests

This is a scenario where we fetch data from multiple APIs concurrently. We use context to manage the lifecycle of each request.
```go
package main

import (
"fmt"
"context"
"time"
"net/http"
)

func main(){
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.second)
	defer cancel()
	
	urls := []string{
	  "https://api.example.com/users",
	  "https://api.example.com/products",
	  "https://api.example.com/orders",
	}
	
	results := make(chan string)
	for _, url := range urls {
		go fetchAPI(ctx, url, results)
	}
	
	for range urls {
		fmt.Println(<-results)
	}
}

func fetchAPI(ctx context.Context, url string, results chan<-string) {
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		results <- fmt.Sprintf("Error creating request for %s: %s", url, err.Error())
		return
	}
	
	client := http.DefaultClient
	resp, err := client.Do(req)
	
	if err != nil {
		results <- fmt.Sprintf("Error making request to %s: %s", url, err.Error())
	}
	
	defer resp.Body.Close()
	results <- fmt.Sprintf("Response from %s: %d", url, resp.StatusCode)
}
```

So here we create a new httpRequest with context of cancellation if api call takes more than 5 seconds. Once any api call takes more than 5 seconds it cancels all other ongoing requests.


## Context with it's multiple applications

Context can be created with different attributes such as timeout, deadline, and background etc. and also can be propagated across go functions. We can cancel the ongoing tasks after some timeout via context signalling. We can exit a task once it's past the given deadline via context signalling.
```go

package main

import (
"context"
"fmt"
"time"
)

func main(){
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	
	go performTask(ctx)
	
	select {
		case <- ctx.Done(): 
			fmt.Println("Task is timed out")
	}
}

func performTask(ctx context.Context){
	 select {
		 case <-time.After(5 * time.Second):
			 fmt.Println("Task completed successfully")
	 }
}


func propagateCtx(){
	ctx := context.Background()
	ctx = context.WithValue(ctx, "UserId", 123)
	
	go performTask2(ctx)
	//
}

func performTask2(ctx context.Context){
	id := ctx.Value("UserId")
}

func cancelCtx(){
	ctx, cancel := context.WithCancel(context.Background())
	go performTask3(ctx)
	
	time.Sleep(2*time.Second)
	cancel()
	
	time.Sleep(1*time.Second)
}

func performTask3(ctx context.Context){
	for {
		select {
			case <- ctx.Done():
				fmt.Println("task cancelled")
				return
			default:
				fmt.Println("Performing task...")
				time.Sleep(500*time.Millisecond)
		}
	}
}

func deadlineCtx(){
	ctx, cancel := context.WithDeadline(context.Background(), time.Now().Add(2*time.Second))
	defer cancel()
	
	go performTask4(ctx)
	time.Sleep(3*time.Second)
}

func performTask4(ctx context.Context){
	select{
		case <-ctx.Done():
			fmt.Println("Task completed or deadline exceeded:", ctx.Err())
			return
	}
}
```

### Context best practices

```go
package main

import(
	"fmt"
	"context"
	"time"
	"databse/sql"
	_ "github.com/lib/pq"
)

func main(){
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	
	db,err := sql.Open("postgres", "postgres://username:password@localhost/mydatabase?sslmode=disable")
	
	if err != nil {
		fmt.Println("Error connecting to database", err)
		return
	}
	
	defer db.Close()
	
	rows, err := db.QueryContext(ctx, "SELECT * FROM users")
	if err != nil {
		fmt.Println("Error executing query:", err)
		return
	}
	defer rows.Close()
}


// Always pass ctx as the first argument
func GetUser(ctx context.Context, id string) (*User, error)

// Always call cancel() — use defer
ctx, cancel := context.WithTimeout(...)
defer cancel() // even if work finishes early, free the resources

// Never pass nil as context
GetUser(nil, id) // Bad
GetUser(context.Background(), id) // Good
```

Here we are creating context with 2sec timeout and we open connection to Postgres and while executing db query, context ensures that operation will be cancelled if it exceeds specified timeout.

>[!tip]
>Use `context.TODO()` -  if we are unsure which context to use in a particular scenario.
>
>Prefer Cancel over Timeout  - as `context.WithCancel` allows us to explicitly trigger cancellation and `context.WithTimeout` does automatic cancellation.


### Context & Goroutine leaks

If a goroutine started with a context, but does not properly exit when that context is cancelled, it can result in a goroutine leak. The goroutine will persist even after operation is cancelled.

```go
func main(){
	ctx := context.Background()  // ← Context #1 (no cancel, plain background)
	
	go func(ctx context.Context){
		for {
			select {
				case <- ctx.Done(): // ← will NEVER fire, Background() can't be cancelled
					//properly handle cancellation
					return
				default:
					//do something
			}
			
		}
	}(ctx)
	
	time.Sleep(1 * time.Second)
	cancel() // ← calls your custom cancel() function
}

func cancel(){
	ctx, cancel := context.WithCancel(context.Background()) // ← Context #2 (brand new!)
	cancel() // ← cancels Context #2, which nobody is using 
}
```

Here in this example goroutine started with the context does not properly exit when that context is cancelled. This results in a goroutine leak.

```go
func main() {
  ctx, cancel := context.WithCancel(context.Background()) // one ctx
  defer cancel()

  go func(ctx context.Context) {
    for {
      select {
      case <-ctx.Done():
        return // exit properly on cancellation  
      default:
        // do work
      }
    }
  }(ctx)

  time.Sleep(1 * time.Second)  

  cancel()            // ✅ cancels the SAME ctx goroutine is watching
}
```


## New Features

`WithoutCancel` — Detach a Child from Parent Cancellation

Sometimes you want a goroutine to finish even if the parent is cancelled.
```go
// Normal: if parent cancels, child cancels too
go handleRequest(ctx, req)

// WithoutCancel: child runs independently
handlerCtx := context.WithoutCancel(ctx)
go handleRequest(handlerCtx, req) // won't stop if parent cancels

// Useful for: finishing in-flight requests during server shutdown.
```

`AfterFunc` — Run Cleanup After Context Ends

```go
stop := context.AfterFunc(ctx, func() {
    // runs after ctx is cancelled
    cleanup()
})

// If you want to prevent cleanup from running:
stop()
//Useful for: deferred cleanup tied to a context's lifetime.
```


## An Example of Context propagating

Here's a clean real-world example — an HTTP request hitting a service, then hitting a DB:

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    // Create ONE context at the top
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()

    err := handleRequest(ctx, "user_123")
    if err != nil {
        fmt.Println("Request failed:", err)
    }
}

// Child 1 — simulates HTTP handler / service layer
func handleRequest(ctx context.Context, userID string) error {
    fmt.Println("handleRequest: started")

    // passes ctx DOWN to next child
    result, err := getUserFromDB(ctx, userID)
    if err != nil {
        return err
    }

    fmt.Println("handleRequest: got result →", result)
    return nil
}

// Child 2 — simulates DB query
func getUserFromDB(ctx context.Context, userID string) (string, error) {
    fmt.Println("getUserFromDB: querying...")

    select {
    case <-time.After(5 * time.Second): // simulates slow DB (5s)
        return "some user", nil

    case <-ctx.Done(): // context cancelled/timed out first
        fmt.Println("getUserFromDB: cancelled!", ctx.Err())
        return "", ctx.Err()
    }
}

// Output

// handleRequest: started
// getUserFromDB: querying...
// getUserFromDB: cancelled! context deadline exceeded
// Request failed: context deadline exceeded
//
//
// Chain diagram 
//   │
//   ├── creates ctx (3s timeout)
//   │
//   ▼
// handleRequest(ctx)          ← Child 1 receives ctx
//   │
//   ▼
// getUserFromDB(ctx)          ← Child 2 receives same ctx
//   │
//   ▼
// ctx times out at 3s
//   │
//   └── ctx.Done() fires
//         │
//         └── getUserFromDB exits
//               │
//               └── handleRequest exits
//                     │
//                     └── main gets error
```

### The key rule:

> Cancel at the **top**, it automatically bubbles down to **every child** using that same `ctx`. You don't manually cancel each function — they all listen to `ctx.Done()` themselves.

One cancel → entire chain stops. That's the whole power of context.

#golang #lang

---

## References

- [Complete Guide to Context in Golang](https://medium.com/@jamal.kaksouri/the-complete-guide-to-context-in-golang-efficient-concurrency-management-43d722f6eaea) - Context cancellation and concurrency management.
