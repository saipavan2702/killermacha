---
title: Java
tags:
  - "#lang"
  - "#java"
date: 2025-12-24
---
## 🔒 Access Modifiers
Access modifiers describe the **visibility** of classes, variables, and methods.

- **public** → Visible to any other class.  
- **protected** → Visible to classes in the same package **or** to subclasses.  
- **default (no modifier)** → Visible only to classes in the same package.  
- **private** → Visible only within the same class.  

---

## 🚀 The `main` Method
The `main` method is the **entry point** into a Java application.  
It is where **program execution starts**.

### Rules for `main`:
- The method must be called **`main`**.  
- Must be **`public`** → because it needs to be invoked from outside the class.  
- Must be **`static`** → so it can run without creating an instance of the class.  
- Must be **`void`** → since it does not return a value.  
- Must accept a **String array parameter** (`String[] args`).  
  - The name `args` is just a convention; you can use any valid identifier.  

### 📌 Eg:
```java
package demos;

public class Whatever {
    public static void main(String[] args) {
        // program execution starts here
        System.out.println("Hello, World!");
    }
}
```

## 1. Switch Statement with `:` (Colon Syntax)

**Characteristics:**
- Traditional syntax
- **Falls through** to the next case unless you use `break`
- Used when you don't need to return a value

**Syntax:**
```java
switch (variable) {
    case label1: {
        // code
        break; // prevents fall-through
    }
    case label2: {
        // code
        break;
    }
    default: {
        // code
    }
}
```

**Example:**
```java
int day = 2;
switch (day) {
    case 1: {
        System.out.println("Monday");
        break;
    }
    case 2: {
        System.out.println("Tuesday");
        break;
    }
    default: {
        System.out.println("Other day");
    }
}
// Output: Tuesday
```

---

## 2. Switch Statement with `->` (Arrow Syntax)

**Characteristics:**
- Modern syntax (Java 14+)
- **No fall-through** - each case is isolated
- Cleaner and less error-prone
- Can still use `break` if needed

**Syntax:**
```java
switch (variable) {
    case label1 -> {
        // code
    }
    case label2 -> {
        // code
    }
    default -> {
        // code
    }
}
```

**Example:**
```java
int day = 2;
switch (day) {
    case 1 -> System.out.println("Monday");
    case 2 -> System.out.println("Tuesday");
    default -> System.out.println("Other day");
}
// Output: Tuesday
```

---

## 3. Switch Expression with `:` (Colon Syntax)

**Characteristics:**
- **Returns a value** (assigned to a variable)
- Must use `yield` to produce values
- Falls through unless you yield
- **Cannot use `break`** (compilation error)
- Must cover all cases or throw an exception

**Syntax:**
```java
variable = switch (expression) {
    case label1: {
        // code
        yield value;
    }
    case label2: {
        yield value;
    }
    default: {
        yield value;
    }
};
```

**Example:**
```java
int day = 2;
String dayName = switch (day) {
    case 1: {
        yield "Monday";
    }
    case 2: {
        yield "Tuesday";
    }
    default: {
        yield "Unknown";
    }
};
System.out.println(dayName); // Output: Tuesday
```

---

## 4. Switch Expression with `->` (Arrow Syntax)

**Characteristics:**
- **Returns a value** (most modern and concise)
- No fall-through
- Can yield directly from simple expressions
- For complex logic, use `yield` in a block
- **Cannot use `break`**
- Must be exhaustive (cover all cases)

**Syntax:**
```java
variable = switch (expression) {
    case label1 -> value;
    case label2 -> {
        // complex logic
        yield value;
    }
    default -> value;
};
```

**Example (Simple):**
```java
int day = 2;
String dayName = switch (day) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    default -> "Unknown";
};
System.out.println(dayName); // Output: Tuesday
```

**Example (Complex with `yield`):**
```java
int day = 2;
String result = switch (day) {
    case 1 -> "Monday";
    case 2 -> {
        String prefix = "Happy ";
        yield prefix + "Tuesday";
    }
    default -> "Unknown";
};
System.out.println(result); // Output: Happy Tuesday
```

---

## Quick Comparison Table

| Feature | Statement `:` | Statement `->` | Expression `:` | Expression `->` |
|---------|--------------|----------------|----------------|-----------------|
| Fall-through | Yes | No | Yes (until yield) | No |
| Returns value | No | No | Yes | Yes |
| Use `break` | Yes | Optional | ❌ No | ❌ No |
| Use `yield` | No | No | ✅ Required | ✅ Required for blocks |
| Must be exhaustive | No | No | Yes | Yes |

---

## Key Takeaways

1. **Statements** don't return values; **Expressions** do
2. **Arrow syntax (`->`)** prevents fall-through
3. **Expressions** require `yield` instead of `break`
4. **Expressions must be exhaustive** (all cases covered)


## 1️⃣ **Arrays**

```java
// Fixed-size array
int[] nums = new int[5];             // default values = 0
String[] names = {"Alice", "Bob"};   // initialized with values
```

## 2️⃣ **List (Ordered, allows duplicates)**

### **ArrayList**

```java
import java.util.ArrayList;
List<String> list = new ArrayList<>();
list.add("apple");
list.add("banana");
```

### **LinkedList**

```java
import java.util.LinkedList;
List<Integer> linkedList = new LinkedList<>();
linkedList.add(10);
linkedList.add(20);
```

### **Immutable List (Java 9+)**

```java
List<String> fixedList = List.of("a", "b", "c");
```

## 3️⃣ **Set (Unique elements, no duplicates)**

### **HashSet (no order guarantee)**

```java
import java.util.HashSet;
Set<String> set = new HashSet<>();
set.add("a");
set.add("b");
```

### **LinkedHashSet (maintains insertion order)**

```java
import java.util.LinkedHashSet;
Set<String> linkedSet = new LinkedHashSet<>();
```

### **TreeSet (sorted order)**

```java
import java.util.TreeSet;
Set<Integer> treeSet = new TreeSet<>();
treeSet.add(3);
treeSet.add(1);
treeSet.add(2);
```

## 4️⃣ **Map (key-value pairs)**

### **HashMap (no order guarantee)**

```java
import java.util.HashMap;
Map<String, Integer> map = new HashMap<>();
map.put("ram", 25);
map.put("sam", 30);
```

### **LinkedHashMap (preserves insertion order)**

```java
import java.util.LinkedHashMap;
Map<Integer, String> linkedMap = new LinkedHashMap<>();
```

### **TreeMap (sorted by key)**

```java
import java.util.TreeMap;
Map<String, Integer> sortedMap = new TreeMap<>();
```

## 5️⃣ **Queue & Deque**

### **Queue using LinkedList**

```java
import java.util.Queue;
import java.util.LinkedList;

Queue<String> queue = new LinkedList<>();
queue.add("A");
queue.add("B");
queue.poll(); // removes head
```

### **PriorityQueue (min-heap)**

```java
import java.util.PriorityQueue;
Queue<Integer> pq = new PriorityQueue<>();
pq.add(10);
pq.add(1);
```

### **Deque using ArrayDeque**

```java
import java.util.ArrayDeque;
Deque<String> dq = new ArrayDeque<>();
dq.addFirst("X");
dq.addLast("Y");
```

## 6️⃣ **Stack**

> Java’s `Stack` is legacy — prefer `ArrayDeque`

```java
Deque<String> stack = new ArrayDeque<>();
stack.push("A");
stack.push("B");
stack.pop(); // B
```

## 7️⃣ **LinkedList (as list + queue + deque)**

```java
LinkedList<String> ll = new LinkedList<>();
ll.add("one");
ll.addFirst("zero");
```

## 8️⃣ **Concurrent / Thread-Safe Structures**

```java
import java.util.concurrent.ConcurrentHashMap;
Map<String, String> chm = new ConcurrentHashMap<>();

import java.util.concurrent.CopyOnWriteArrayList;
List<String> cowList = new CopyOnWriteArrayList<>();
```

## 🔥 Bonus: Pre-fill shortcuts

```java
List<Integer> nums = new ArrayList<>(List.of(1, 2, 3));
Set<String> fruits = new HashSet<>(Set.of("apple", "banana"));
Map<Integer, String> studentMap = new HashMap<>(Map.of(1, "John", 2, "Sara"));
```


---

Using strategy pattern in production code
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