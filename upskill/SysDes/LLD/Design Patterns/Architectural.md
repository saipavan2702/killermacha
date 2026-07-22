Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/LLD/Design Patterns/Behavioral|Behavioral]]

### 1. MVC (Model-View-Controller)
**Purpose**: Separate data, UI, and logic.
- **Model**: User data
- **View**: Login page HTML
- **Controller**: Handles login button click
```java
class UserController {
    UserModel model;
    UserView view;
    void updateView() {
        view.display(model.getName());
    }
}
```

### 2. Dependency Injection
**Purpose**: Provide dependencies from outside instead of creating them.
**Example**: Car receives engine instead of building it
```java
class Car {
    Engine engine;
    Car(Engine engine) { // injected
        this.engine = engine;
    }
}
```

### 3. Repository Pattern
**Purpose**: Separate data access logic from business logic.
**Example**: UserRepository handles all database operations for Users
```java
interface UserRepository {
    User findById(int id);
    void save(User user);
}
class DatabaseUserRepository implements UserRepository {
    // SQL queries here
}
```

### 4. CQRS (Command Query Responsibility Segregation)
**Purpose**: Separate read and write operations.
**Example**: E-commerce with separate databases for browsing (read) and ordering (write)
```java
class OrderCommandService {
    void createOrder(Order order) {...}
}
class OrderQueryService {
    List<Order> getOrders() {...}
}
```

### 5. Event Sourcing
**Purpose**: Store all changes as sequence of events.
**Example**: Banking transaction log (deposit $100, withdraw $50)
```java
class BankAccount {
    List<Event> events;
    void apply(Event e) {
        events.add(e);
        balance = recalculateFromEvents();
    }
}
```


#sysdes #design-patterns
