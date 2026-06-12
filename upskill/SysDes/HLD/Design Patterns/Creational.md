---
title: Creational Design Patterns
tags:
  - sysdes
  - ref
  - design-patterns
---
### 1. Singleton
**Purpose**: Ensure only one instance of a class exists.
**Use when**: You need exactly one shared resource, like a logger or DB connection. Multiple instances would conflict or waste resources.
**Cons**: Can't easily mock for UT; Needs thread-safe to avoid race condition 
**Example**: Database connection, Logger
```java
class Database {
    private static Database instance;
    private Database() {}
    public static Database getInstance() {
        if (instance == null) instance = new Database();
        return instance;
    }
}

// BAD: two separate loggers, each unaware of the other
Logger a = new Logger();
Logger b = new Logger();  // chaos: both write independently

// GOOD: getInstance() always returns the same object
Logger a = Logger.getInstance();
Logger b = Logger.getInstance();  // a == b, exact same object
```
> Hard to mock in unit tests because it is essentially a controlled global variable.

### 2. Factory Method
**Purpose**: Create objects without specifying exact class.
**Use when**: Which object to create depends on runtime data. Keeps `new` and `if/else` logic in one place instead of scattered everywhere.
**Example**: Shape factory creating circles/squares
```java
interface Shape { void draw(); }
class ShapeFactory {
    public Shape createShape(String type) {
        if (type.equals("circle")) return new Circle();
        return new Square();
    }
}

// BAD: creation logic scattered everywhere you need a User
User u;
if (role.equals("admin"))     u = new AdminUser(id, name);
else if (role.equals("mod"))  u = new ModUser(id, name);

// GOOD: pass details to the factory, it handles branching internally
User u = UserFactory.create("admin", 1, "John");
// the switch/if lives inside Factory.create(), not here
```
> Adding a new user type means editing the factory only, not every caller.

### 3. Abstract Factory
**Purpose**: Create families of related objects.
**Example**: UI factory for Windows/Mac themes
```java
interface UIFactory {
    Button createButton();
    Checkbox createCheckbox();
}
class WindowsFactory implements UIFactory {...}
class MacFactory implements UIFactory {...}
```

### 4. Builder
**Purpose**: Construct complex objects step-by-step.
**Use when**: An object has many optional fields. Instead of one giant constructor call, chain only the parts you need.
**Example**: Building a Pizza with optional toppings
```java
Pizza pizza = new Pizza.Builder()
    .size("Large")
    .cheese(true)
    .pepperoni(true)
    .build();

// BAD: one huge constructor, hard to read and easy to mess up argument order
Request r = new Request("api.example.com", "POST", null, null, "Bearer token");

// GOOD: chain only what you need, reads like plain English
Request r = new RequestBuilder()
    .url("api.example.com")
    .method("POST")
    .headers("Authorization: Bearer token")
    .build();            // produces the final Request object
```
> Each chained method returns `this`, allowing the next call to be chained.

### 5. Prototype
**Purpose**: Clone existing objects instead of creating new ones.
**Example**: Copying document templates
```java
class Document implements Cloneable {
    public Document clone() {
        return (Document) super.clone();
    }
}
```

### 6. Object Pool
**Purpose**: Reuse expensive-to-create objects.
**Example**: Database connection pool, Thread pool
```java
class ConnectionPool {
    Queue<Connection> available;
    Connection getConnection() {
        return available.isEmpty() ? new Connection() : available.poll();
    }
    void releaseConnection(Connection conn) {
        available.add(conn);
    }
}
```

### 7. Lazy Initialization
**Purpose**: Delay object creation until needed.
**Example**: Loading images only when scrolled into view
```java
class ExpensiveObject {
    private HeavyResource resource;
    public HeavyResource getResource() {
        if (resource == null) {
            resource = new HeavyResource(); // create only when needed
        }
        return resource;
    }
}
```

---
