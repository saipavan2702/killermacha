Map: [[Upskill/ProgramLang/Golang/Go|Go]]


> [!summary]
> Go interfaces are satisfied implicitly by method sets, allowing behavior-based composition without declaration-heavy inheritance.

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

For  tags like Java : Go has build tags, not test annotations like `JUnit @Tag`.

Example :
```go
//go:build integration
package mypkg

//Then run only files with that tag:
go test -tags=integration ./...
```

## Related

- [[Upskill/ProgramLang/Golang/Memory and Pointers|Memory and Pointers]]
- [[Upskill/ProgramLang/Golang/Channels and Select|Channels and Select]]
