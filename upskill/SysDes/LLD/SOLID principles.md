## 🗺️ The Big Picture

| Letter | Principle | One-liner |
|--------|-----------|-----------|
| **S** | Single Responsibility | One class, one reason to change |
| **O** | Open / Closed | Extend freely, modify never |
| **L** | Liskov Substitution | Subclasses must keep their parent's promises |
| **I** | Interface Segregation | Don't force clients to depend on what they don't use |
| **D** | Dependency Inversion | Depend on abstractions, not concrete implementations |
## S — Single Responsibility Principle

> **"A class should have only one reason to change."**

### 🧠 Mental Model
Think of **stakeholders, not methods**. If three different teams (marketing, security, ops) all need to modify the same file, you have three reasons to change → split it.

> [!warning] Common Trap
> SRP ≠ "one method per class". Over-decomposing into 12 files just to send one email is *premature decomposition*. Group by **reason to change**, not by line count.

### 🔴 Violation
```typescript
class GodClass {
    authenticateUser(user) { }  // ← Security team's concern
    sendEmail(user) { }         // ← Marketing team's concern
    logError(error) { }         // ← Ops team's concern
    queryDatabase() { }
}
```

### 🟢 Solution
```typescript
class AuthenticationModule {
    authenticateUser(user) { }
}

class NotificationModule {
    sendEmail(user) { }
}

class LoggingModule {
    logError(error) { }
}
```

### 💡 Quick Test
*Ask yourself: "Who would ask me to change this file?"*
If the answer is more than one type of person → split it.

---

## O — Open / Closed Principle

> **"Software should be open for extension, but closed for modification."**

### 🧠 Mental Model
Imagine a **plugin system**. You can add new plugins without touching the core application. That's OCP in a nutshell.

> [!warning] Common Trap
> Don't abstract for a future that never arrives. If you have a simple switch with 2 cases that hasn't changed in 2 years, leave it alone.

### 🔴 Violation
```typescript
class PaymentProcessor {
    processPayment(type: string) {
        switch (type) {
            case 'creditCard': /* ... */ break;
            case 'paypal':     /* ... */ break;
            // Adding 'crypto' means opening this and risking breaking PayPal ❌
        }
    }
}
```

### 🟢 Solution
```typescript
interface PaymentMethod {
    process(): void;
}

class CreditCard implements PaymentMethod { process() { /* ... */ } }
class PayPal    implements PaymentMethod { process() { /* ... */ } }
class Crypto    implements PaymentMethod { process() { /* ... */ } } // New file, zero risk ✅
```

### 💡 Quick Test
*"Can I add a new feature without touching existing files?"*
If yes → you're following OCP.

---

## L — Liskov Substitution Principle

> **"A subclass must not break the contract of its parent class."**
> Named after **Barbara Liskov** (1987).

### 🧠 Mental Model
If your code works with a `Shape`, it should work with *any* subclass of `Shape` — **without surprises**. A subclass can do *more*, but never *less* or *differently* than expected.

> [!tip] The Formal Version
> If `S` is a subtype of `T`, then objects of type `T` may be replaced with objects of type `S` without altering the correctness of the program.

### 🔴 Violation — The Square/Rectangle Trap
```typescript
class Rectangle {
    setWidth(w: number)  { this.width = w; }
    setHeight(h: number) { this.height = h; }
    getArea() { return this.width * this.height; }
}

class Square extends Rectangle {
    setWidth(w: number)  { this.width = w; this.height = w; }  // ← silently changes height!
    setHeight(h: number) { this.width = h; this.height = h; }  // ← silently changes width!
}

function calculate(rect: Rectangle) {
    rect.setWidth(5);
    rect.setHeight(10);
    return rect.getArea(); // Expects 50 → Square gives 100 ❌
}
```

### 🟢 Solution
Don't force the inheritance. A mutable `Square` and mutable `Rectangle` have **incompatible invariants** — they should be separate, unrelated classes.

```typescript
class Rectangle { /* width and height independent */ }
class Square    { /* single side property */         }
// No inheritance between them ✅
```

### 💡 Quick Test
*"If I pass a subclass where the parent is expected, does anything break or surprise the caller?"*
If yes → LSP violation.

---

## I — Interface Segregation Principle

> **"Clients should not be forced to depend on methods they don't use."**

### 🧠 Mental Model
Prefer **small, focused interfaces** over one fat "do-everything" interface. It's better to implement two tiny interfaces than one bloated one with empty stubs.

> [!note] Key Smell
> If you're writing empty methods just to satisfy an interface, the interface is too fat.

### 🔴 Violation
```typescript
interface Worker {
    work(): void;
    eat(): void;  // ← Robots don't eat!
}

class Robot implements Worker {
    work() { /* works hard */ }
    eat()  { /* ← empty stub — a lie in your code */ }  // ❌
}
```

### 🟢 Solution
```typescript
interface Workable { work(): void; }
interface Feedable { eat(): void;  }

class Human implements Workable, Feedable {
    work() { /* ... */ }
    eat()  { /* ... */ }
}

class Robot implements Workable {
    work() { /* ... */ }
    // No eat() required ✅
}
```

### 💡 Quick Test
*"Am I implementing any empty or stub methods just to satisfy an interface?"*
If yes → segregate that interface.

---

## D — Dependency Inversion Principle

> **"High-level modules should not depend on low-level modules. Both should depend on abstractions."**

### 🧠 Mental Model
Imagine a power outlet (abstraction). Your laptop, phone, and lamp all plug into it — the outlet doesn't care what's plugged in, and the devices don't care about the wiring inside the walls. That's DIP.

> [!important] DIP ≠ Dependency Injection
> - **Dependency Injection** = passing a dependency in from outside (a *technique*)
> - **Dependency Inversion** = flipping the dependency arrow toward a shared abstraction (an *architectural principle*)
> You can use either without the other.

### 🔴 Violation
```typescript
class MySQLRepository {
    insertOrder(order) { /* MySQL-specific code */ }
}

class OrderService {
    constructor() {
        this.db = new MySQLRepository();  // ← tightly coupled ❌
    }
    save(order) { this.db.insertOrder(order); }
}
// Switching to Postgres = rewrite everything 😱
```

### 🟢 Solution
```typescript
interface Repository {
    saveOrder(order): void;  // ← the shared contract
}

class MySQL    implements Repository { saveOrder(order) { /* MySQL  */ } }
class Postgres implements Repository { saveOrder(order) { /* Postgres */ } }

class OrderService {
    constructor(private db: Repository) { }  // ← depends on abstraction ✅
    save(order) { this.db.saveOrder(order); }
}
// Swap MySQL → Postgres by changing one line at the call site ✨
```

### 💡 Quick Test
*"Does my high-level business logic import a specific low-level technology?"*
If yes → invert it with an interface.

---
## 🧩 How They Fit Together
```
SRP  →  Each class has a clear, single purpose;  One class, one job
OCP  →  You can grow the system without breaking it; Open for extension, closed for modification
LSP  →  Subclasses are trustworthy drop-in replacements; Subclasses should be replaceable for parent
ISP  →  Interfaces are lean; nothing is forced on anyone; Many small interfaces > one large interface
DIP  →  High-level logic is shielded from low-level detail; Depend on abstractions, not concrete classes
```

#oops #sysdes 

### Ref
https://www.youtube.com/watch?v=K7iVBAQHN8I
#ref 