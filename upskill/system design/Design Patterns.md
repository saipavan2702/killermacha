---
title: design patterns
date: 2026-01-02
tags:
  - "#sysdes"
  - "#ref"
---
There are mainly three types of Design Patterns
 1. Creational Design Pattern
 2. Structural Design Pattern
 3. Behavioural Design Pattern 
## Creational Patterns (5 Core + 2 Additional)

### 1. Singleton
**Purpose**: Ensure only one instance of a class exists.
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
```

### 2. Factory Method
**Purpose**: Create objects without specifying exact class.
**Example**: Shape factory creating circles/squares
```java
interface Shape { void draw(); }
class ShapeFactory {
    public Shape createShape(String type) {
        if (type.equals("circle")) return new Circle();
        return new Square();
    }
}
```

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
**Example**: Building a Pizza with optional toppings
```java
Pizza pizza = new Pizza.Builder()
    .size("Large")
    .cheese(true)
    .pepperoni(true)
    .build();
```

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

## Structural Patterns (7 Core)

### 8. Adapter
**Purpose**: Make incompatible interfaces work together.
**Example**: USB-C to USB-A adapter
```java
class OldPrinter { void printOld(String text) {...} }
class PrinterAdapter implements ModernPrinter {
    OldPrinter oldPrinter;
    public void print(String text) {
        oldPrinter.printOld(text);
    }
}
```

### 9. Bridge
**Purpose**: Separate abstraction from implementation.
**Example**: Remote control (abstraction) works with different TV brands (implementation)
```java
interface Device { void turnOn(); }
class Remote {
    Device device;
    void powerButton() { device.turnOn(); }
}
class TV implements Device {...}
class Radio implements Device {...}
```

### 10. Composite
**Purpose**: Treat individual objects and groups uniformly.
**Example**: File system (files and folders)
```java
interface Component { void display(); }
class File implements Component {...}
class Folder implements Component {
    List<Component> children;
    void display() {
        for (Component c : children) c.display();
    }
}
```

### 11. Decorator
**Purpose**: Add features to objects dynamically.
**Example**: Coffee with milk, sugar, whipped cream
```java
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
```

### 12. Facade
**Purpose**: Provide a simple interface to complex subsystems.
**Example**: Home theater system with one "Watch Movie" button
```java
class HomeTheater {
    Projector projector;
    SoundSystem sound;
    public void watchMovie() {
        projector.on();
        sound.setVolume(5);
    }
}
```

### 13. Flyweight
**Purpose**: Share common data to save memory.
**Example**: Text editor storing character formatting once, not per character
```java
class CharacterStyle {
    String font, color; // shared
}
class Character {
    char value; // unique
    CharacterStyle style; // shared reference
}
```

### 14. Proxy
**Purpose**: Control access to an object.
**Example**: Virtual proxy loading large images only when needed
```java
class ImageProxy implements Image {
    RealImage realImage;
    public void display() {
        if (realImage == null) {
            realImage = new RealImage(); // load on demand
        }
        realImage.display();
    }
}
```

---

## Behavioral Patterns (10 Core)

### 15. Chain of Responsibility
**Purpose**: Pass request through chain of handlers.
**Example**: Customer support (Level 1 → Level 2 → Manager)
```java
abstract class Handler {
    Handler next;
    void handleRequest(Request r) {
        if (canHandle(r)) process(r);
        else if (next != null) next.handleRequest(r);
    }
}
```

### 16. Command
**Purpose**: Encapsulate requests as objects.
**Example**: Remote control with undo/redo
```java
interface Command { 
    void execute(); 
    void undo(); 
}
class RemoteControl {
    Command command;
    void pressButton() { command.execute(); }
    void pressUndo() { command.undo(); }
}
```

### 17. Iterator
**Purpose**: Access elements of a collection sequentially.
**Example**: Looping through a playlist
```java
interface Iterator {
    boolean hasNext();
    Object next();
}
class PlaylistIterator implements Iterator {
    List<Song> songs;
    int position;
    public boolean hasNext() { return position < songs.size(); }
    public Song next() { return songs.get(position++); }
}
```

### 18. Mediator
**Purpose**: Centralize complex communications between objects.
**Example**: Air traffic control tower coordinating planes
```java
class ChatRoom {
    void sendMessage(String msg, User user) {
        for (User u : users) {
            if (u != user) u.receive(msg);
        }
    }
}
```

### 19. Memento
**Purpose**: Save and restore object state.
**Example**: Text editor undo functionality
```java
class TextEditor {
    String content;
    Memento save() { return new Memento(content); }
    void restore(Memento m) { content = m.getState(); }
}
class Memento {
    private String state;
    Memento(String state) { this.state = state; }
    String getState() { return state; }
}
```

### 20. Observer
**Purpose**: Notify multiple objects when one object changes.
**Example**: YouTube notifying subscribers when new video uploads
```java
interface Observer { void update(String message); }
class Channel {
    List<Observer> subscribers;
    void uploadVideo(String title) {
        for (Observer sub : subscribers) {
            sub.update("New video: " + title);
        }
    }
}
```

### 21. State
**Purpose**: Change object behavior when its state changes.
**Example**: Document states (Draft → Review → Published)
```java
interface State { void publish(Document doc); }
class Document {
    State state;
    void publish() { state.publish(this); }
}
class DraftState implements State {
    void publish(Document doc) {
        doc.setState(new PublishedState());
    }
}
```

### 22. Strategy
**Purpose**: Choose algorithm at runtime.
**Example**: Payment methods (Credit Card, PayPal, Crypto)
```java
interface PaymentStrategy { void pay(int amount); }
class ShoppingCart {
    PaymentStrategy payment;
    void checkout(int amount) { payment.pay(amount); }
}
```

### 23. Template Method
**Purpose**: Define skeleton of algorithm, let subclasses override steps.
**Example**: Making tea vs coffee (same steps, different ingredients)
```java
abstract class Beverage {
    final void prepare() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }
    abstract void brew();
    abstract void addCondiments();
}
```

### 24. Visitor
**Purpose**: Add operations to objects without changing their classes.
**Example**: Tax calculator visiting different product types
```java
interface Visitor {
    void visit(Book book);
    void visit(Fruit fruit);
}
class TaxCalculator implements Visitor {
    void visit(Book book) { /* tax logic for books */ }
    void visit(Fruit fruit) { /* tax logic for fruits */ }
}
```

---

## Architectural Patterns

### 25. MVC (Model-View-Controller)
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

### 26. Dependency Injection
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

### 27. Repository Pattern
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

### 28. CQRS (Command Query Responsibility Segregation)
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

### 29. Event Sourcing
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

---

## SOLID Principles

1. **Single Responsibility**: One class, one job
2. **Open/Closed**: Open for extension, closed for modification
3. **Liskov Substitution**: Subclasses should be replaceable for parent
4. **Interface Segregation**: Many small interfaces > one large interface
5. **Dependency Inversion**: Depend on abstractions, not concrete classes

---

## Quick Reference Table

| Need                                     | Pattern                  |
| ---------------------------------------- | ------------------------ |
| One instance only                        | Singleton                |
| Create related objects                   | Factory/Abstract Factory |
| Build complex objects                    | Builder                  |
| Clone objects                            | Prototype                |
| Reuse expensive objects                  | Object Pool              |
| Add features dynamically                 | Decorator                |
| Simplify complex system                  | Facade                   |
| Save memory with shared data             | Flyweight                |
| Notify multiple objects                  | Observer                 |
| Swap algorithms                          | Strategy                 |
| Undo/Redo functionality                  | Command/Memento          |
| Control object access                    | Proxy                    |
| Adapt incompatible interfaces            | Adapter                  |
| Treat objects uniformly                  | Composite                |
| Chain of handlers                        | Chain of Responsibility  |
| Centralize communication                 | Mediator                 |
| Change behavior by state                 | State                    |
| Traverse collections                     | Iterator                 |
| Add operations without modifying classes | Visitor                  |
| Separate read/write                      | CQRS                     |

### Real Life application

```java

// ============================================
// STRATEGY PATTERN - Authentication System
// ============================================

public interface LoginStrategy {
    boolean login(Credentials credentials);
}

public class EmailLogin implements LoginStrategy {
    public boolean login(Credentials credentials) {
        return validateEmailAndPassword(credentials);
    }
    
    private boolean validateEmailAndPassword(Credentials credentials) {
        // Email validation logic
        return true;
    }
}

public class GoogleLogin implements LoginStrategy {
    public boolean login(Credentials credentials) {
        return validateGoogleToken(credentials);
    }
    
    private boolean validateGoogleToken(Credentials credentials) {
        // Google OAuth token validation
        return true;
    }
}

public class SSOLogin implements LoginStrategy {
    public boolean login(Credentials credentials) {
        return validateSSOToken(credentials);
    }
    
    private boolean validateSSOToken(Credentials credentials) {
        // SSO token validation
        return true;
    }
}

public class LoginContext {
    private LoginStrategy strategy;
    
    public LoginContext(LoginStrategy strategy) {
        this.strategy = strategy;
    }
    
    public boolean authenticate(Credentials credentials) {
        return strategy.login(credentials);
    }
}

// ============================================
// FACTORY PATTERN - Strategy Selection
// ============================================

public class LoginStrategyFactory {
    public static LoginStrategy getStrategy(String type) {
        switch (type.toUpperCase()) {
            case "EMAIL":
                return new EmailLogin();
            case "GOOGLE":
                return new GoogleLogin();
            case "SSO":
                return new SSOLogin();
            default:
                throw new UnsupportedOperationException("Unknown login type: " + type);
        }
    }
}

// ============================================
// DECORATOR PATTERN - Payment Processing
// ============================================

public interface PaymentProcessor {
    void process(Payment payment);
}

public class BasePaymentProcessor implements PaymentProcessor {
    public void process(Payment payment) {
        System.out.println("Processing payment: " + payment.getAmount());
        executeTransaction(payment);
    }
    
    private void executeTransaction(Payment payment) {
        // Core payment processing logic
    }
}

public class LoggingDecorator implements PaymentProcessor {
    private PaymentProcessor wrapped;
    
    public LoggingDecorator(PaymentProcessor wrapped) {
        this.wrapped = wrapped;
    }
    
    public void process(Payment payment) {
        System.out.println("[LOG] Payment started - ID: " + payment.getId());
        wrapped.process(payment);
        System.out.println("[LOG] Payment completed - ID: " + payment.getId());
    }
}

public class FraudCheckDecorator implements PaymentProcessor {
    private PaymentProcessor wrapped;
    
    public FraudCheckDecorator(PaymentProcessor wrapped) {
        this.wrapped = wrapped;
    }
    
    public void process(Payment payment) {
        if (isFraudulent(payment)) {
            throw new SecurityException("Fraudulent payment detected");
        }
        wrapped.process(payment);
    }
    
    private boolean isFraudulent(Payment payment) {
        return payment.getAmount() > 10000 && payment.isFromNewAccount();
    }
}

public class MetricsDecorator implements PaymentProcessor {
    private PaymentProcessor wrapped;
    
    public MetricsDecorator(PaymentProcessor wrapped) {
        this.wrapped = wrapped;
    }
    
    public void process(Payment payment) {
        long startTime = System.currentTimeMillis();
        wrapped.process(payment);
        long duration = System.currentTimeMillis() - startTime;
        System.out.println("[METRICS] Processing time: " + duration + "ms");
    }
}

// ============================================
// OBSERVER PATTERN - Event Broadcasting
// ============================================

public interface LoginObserver {
    void onLogin(User user);
}

public class AuditLogObserver implements LoginObserver {
    public void onLogin(User user) {
        System.out.println("Audit: User " + user.getId() + " logged in at " + System.currentTimeMillis());
    }
}

public class NotificationObserver implements LoginObserver {
    public void onLogin(User user) {
        System.out.println("Notification sent to: " + user.getEmail());
    }
}

public class RewardsObserver implements LoginObserver {
    public void onLogin(User user) {
        System.out.println("Rewards updated for user: " + user.getId());
    }
}

public class LoginPublisher {
    private List<LoginObserver> observers = new ArrayList<>();
    
    public void register(LoginObserver observer) {
        observers.add(observer);
    }
    
    public void unregister(LoginObserver observer) {
        observers.remove(observer);
    }
    
    public void notifyAllObservers(User user) {
        for (LoginObserver observer : observers) {
            observer.onLogin(user);
        }
    }
}

// ============================================
// USAGE EXAMPLES
// ============================================

public class Main {
    public static void main(String[] args) {
        // Strategy Pattern Usage
        LoginStrategy strategy = LoginStrategyFactory.getStrategy("EMAIL");
        LoginContext context = new LoginContext(strategy);
        boolean authenticated = context.authenticate(new Credentials("user@example.com", "pass123"));
        
        // Decorator Pattern Usage
        PaymentProcessor processor = new BasePaymentProcessor();
        processor = new LoggingDecorator(processor);
        processor = new FraudCheckDecorator(processor);
        processor = new MetricsDecorator(processor);
        processor.process(new Payment("12345", 500.00));
        
        // Observer Pattern Usage
        LoginPublisher publisher = new LoginPublisher();
        publisher.register(new AuditLogObserver());
        publisher.register(new NotificationObserver());
        publisher.register(new RewardsObserver());
        publisher.notifyAllObservers(new User("user123", "user@example.com"));
    }
}

// ============================================
// SUPPORTING CLASSES
// ============================================

class Credentials {
    private String username;
    private String password;
    
    public Credentials(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    public String getUsername() { return username; }
    public String getPassword() { return password; }
}

class Payment {
    private String id;
    private double amount;
    private boolean fromNewAccount;
    
    public Payment(String id, double amount) {
        this.id = id;
        this.amount = amount;
        this.fromNewAccount = false;
    }
    
    public String getId() { return id; }
    public double getAmount() { return amount; }
    public boolean isFromNewAccount() { return fromNewAccount; }
}

class User {
    private String id;
    private String email;
    
    public User(String id, String email) {
        this.id = id;
        this.email = email;
    }
    
    public String getId() { return id; }
    public String getEmail() { return email; }
}
```

https://www.geeksforgeeks.org/system-design/software-design-patterns/
#ref 