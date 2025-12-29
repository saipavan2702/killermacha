---
title: Java
tags:
  - "#lang"
  - "#java"
date: 2025-12-24
---
## Access Modifiers
Access modifiers describe the **visibility** of classes, variables, and methods.

- **public** → Visible to any other class.  
- **protected** → Visible to classes in the same package **or** to subclasses.  
- **default (no modifier)** → Visible only to classes in the same package.  
- **private** → Visible only within the same class.  

## `main` Method
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

## Quick Comparison Table

| Feature            | Statement `:` | Statement `->` | Expression `:`    | Expression `->`       |
| ------------------ | ------------- | -------------- | ----------------- | --------------------- |
| Fall-through       | Yes           | No             | Yes (until yield) | No                    |
| Returns value      | No            | No             | Yes               | Yes                   |
| Use `break`        | Yes           | Optional       | ❌ No              | ❌ No                  |
| Use `yield`        | No            | No             | ✅ Required        | ✅ Required for blocks |
| Must be exhaustive | No            | No             | Yes               | Yes                   |
## Key Takeaways

1. **Statements** don't return values; **Expressions** do
2. **Arrow syntax (`->`)** prevents fall-through
3. **Expressions** require `yield` instead of `break`
4. **Expressions must be exhaustive** (all cases covered)

---
## Data Structures
```java
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

public class ModernJava21Collections {
    public static void main(String[] args) {
        
        // ========================================
        // 1. ARRAYS (Classic but still used)
        // ========================================
        int[] nums = new int[5];
        String[] names = {"Alice", "Bob"};
        int[][] matrix = new int[3][3];
        
        // ========================================
        // 2. ARRAYLIST (Modern, preferred)
        // ========================================
        List<String> list = new ArrayList<>();
        list.add("apple");
        list.add("banana");
        list.addAll(List.of("cherry", "date"));
        
        // ========================================
        // 3. LINKEDLIST (Use when frequent insertions/deletions)
        // ========================================
        List<Integer> linkedList = new LinkedList<>();
        linkedList.add(10);
        linkedList.add(20);
        
        // ========================================
        // 4. IMMUTABLE COLLECTIONS (Java 9+, preferred)
        // ========================================
        List<String> immutableList = List.of("a", "b", "c");
        Set<String> immutableSet = Set.of("x", "y", "z");
        Map<String, Integer> immutableMap = Map.of("one", 1, "two", 2);
        
        // For more than 10 entries
        List<Integer> largeImmutableList = List.copyOf(List.of(1, 2, 3, 4, 5));
        
        // ========================================
        // 5. HASHSET (Modern, fast lookups)
        // ========================================
        Set<String> set = new HashSet<>();
        set.add("a");
        set.add("b");
        set.contains("a");
        
        // ========================================
        // 6. LINKEDHASHSET (Maintains insertion order)
        // ========================================
        Set<String> linkedSet = new LinkedHashSet<>();
        linkedSet.add("x");
        linkedSet.add("y");
        
        // ========================================
        // 7. TREESET (Sorted, implements NavigableSet)
        // ========================================
        NavigableSet<Integer> treeSet = new TreeSet<>();
        treeSet.add(3);
        treeSet.add(1);
        treeSet.add(2);
        treeSet.first();
        treeSet.last();
        treeSet.higher(2);  // element > 2
        treeSet.lower(2);   // element < 2
        
        // ========================================
        // 8. ENUMSET (Best for enum types)
        // ========================================
        enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }
        EnumSet<Day> weekdays = EnumSet.range(Day.MON, Day.FRI);
        EnumSet<Day> weekend = EnumSet.of(Day.SAT, Day.SUN);
        
        // ========================================
        // 9. HASHMAP (Modern, fast key-value)
        // ========================================
        Map<String, Integer> map = new HashMap<>();
        map.put("ram", 25);
        map.put("sam", 30);
        map.putIfAbsent("ram", 35);  // only if key doesn't exist
        map.getOrDefault("xyz", 0);   // return default if not found
        map.computeIfAbsent("key", k -> 100);
        map.merge("ram", 5, Integer::sum);  // merge values
        
        // ========================================
        // 10. LINKEDHASHMAP (Insertion order preserved)
        // ========================================
        Map<Integer, String> linkedMap = new LinkedHashMap<>();
        linkedMap.put(1, "one");
        linkedMap.put(2, "two");
        
        // ========================================
        // 11. TREEMAP (Sorted by key, NavigableMap)
        // ========================================
        NavigableMap<String, Integer> sortedMap = new TreeMap<>();
        sortedMap.put("charlie", 3);
        sortedMap.put("alice", 1);
        sortedMap.firstEntry();
        sortedMap.lastEntry();
        sortedMap.higherKey("bob");
        
        // ========================================
        // 12. ENUMMAP (Best for enum keys)
        // ========================================
        Map<Day, String> enumMap = new EnumMap<>(Day.class);
        enumMap.put(Day.MON, "Monday");
        enumMap.put(Day.TUE, "Tuesday");
        
        // ========================================
        // 13. QUEUE using LinkedList
        // ========================================
        Queue<String> queue = new LinkedList<>();
        queue.offer("A");  // preferred over add()
        queue.offer("B");
        queue.poll();      // removes and returns head
        queue.peek();      // returns head without removing
        
        // ========================================
        // 14. PRIORITYQUEUE (Min-heap by default)
        // ========================================
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(10);
        minHeap.offer(1);
        minHeap.offer(5);
        
        // Max-heap
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        
        // Custom comparator (Java 21 style)
        PriorityQueue<String> customPQ = new PriorityQueue<>(
            Comparator.comparingInt(String::length).reversed()
        );
        
        // ========================================
        // 15. DEQUE using ArrayDeque (Modern, preferred)
        // ========================================
        Deque<String> deque = new ArrayDeque<>();
        deque.offerFirst("X");
        deque.offerLast("Y");
        deque.pollFirst();
        deque.pollLast();
        deque.peekFirst();
        deque.peekLast();
        
        // ========================================
        // 16. STACK using ArrayDeque (Modern way)
        // ========================================
        Deque<String> stack = new ArrayDeque<>();
        stack.push("A");
        stack.push("B");
        stack.pop();
        stack.peek();
        
        // ========================================
        // 17. CONCURRENTHASHMAP (Thread-safe, modern)
        // ========================================
        ConcurrentMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("key1", 100);
        concurrentMap.computeIfAbsent("key2", k -> 200);
        
        // ========================================
        // 18. COPYONWRITEARRAYLIST (Thread-safe reads)
        // ========================================
        List<String> cowList = new CopyOnWriteArrayList<>();
        cowList.add("thread-safe");
        
        // ========================================
        // 19. COPYONWRITEARRAYSET (Thread-safe reads)
        // ========================================
        Set<String> cowSet = new CopyOnWriteArraySet<>();
        cowSet.add("concurrent");
        
        // ========================================
        // 20. BLOCKINGQUEUE (Producer-Consumer pattern)
        // ========================================
        BlockingQueue<Integer> blockingQueue = new LinkedBlockingQueue<>();
        BlockingQueue<Integer> arrayBlockingQueue = new ArrayBlockingQueue<>(10);
        BlockingQueue<Integer> priorityBlockingQueue = new PriorityBlockingQueue<>();
        
        // ========================================
        // 21. CONCURRENTSKIPLISTMAP (Sorted, concurrent)
        // ========================================
        ConcurrentNavigableMap<String, Integer> skipListMap = new ConcurrentSkipListMap<>();
        skipListMap.put("a", 1);
        
        // ========================================
        // 22. CONCURRENTSKIPLISTSET (Sorted set, concurrent)
        // ========================================
        NavigableSet<Integer> skipListSet = new ConcurrentSkipListSet<>();
        skipListSet.add(5);
        
        // ========================================
        // 23. SEQUENCED COLLECTIONS (Java 21 NEW!)
        // ========================================
        // SequencedCollection interface (Java 21)
        SequencedCollection<String> seqList = new ArrayList<>(List.of("a", "b", "c"));
        seqList.addFirst("start");
        seqList.addLast("end");
        seqList.getFirst();
        seqList.getLast();
        seqList.reversed();  // reversed view
        
        // SequencedSet (Java 21)
        SequencedSet<Integer> seqSet = new LinkedHashSet<>(Set.of(1, 2, 3));
        seqSet.addFirst(0);
        seqSet.reversed();
        
        // SequencedMap (Java 21)
        SequencedMap<String, Integer> seqMap = new LinkedHashMap<>();
        seqMap.put("a", 1);
        seqMap.putFirst("start", 0);
        seqMap.putLast("end", 99);
        seqMap.firstEntry();
        seqMap.lastEntry();
        
        // ========================================
        // 24. GENERICS (Modern patterns)
        // ========================================
        // Generic class
        Box<String> stringBox = new Box<>("Hello");
        Box<Integer> intBox = new Box<>(42);
        
        // Bounded type parameters
        NumberBox<Integer> numBox = new NumberBox<>(100);
        
        // Multiple bounds
        MultiBox<String> multiBox = new MultiBox<>("test");
        
        // Wildcards
        List<? extends Number> numberList = new ArrayList<Integer>();
        List<? super Integer> superList = new ArrayList<Number>();
        List<?> unknownList = new ArrayList<String>();
        
        // Generic method with type inference (diamond operator)
        var result = createPair("key", 123);
        
        // ========================================
        // 25. COLLECTIONS UTILITY (Modern methods)
        // ========================================
        List<Integer> numbers = new ArrayList<>(List.of(5, 2, 8, 1, 9));
        Collections.sort(numbers);
        Collections.reverse(numbers);
        Collections.shuffle(numbers);
        
        // Modern unmodifiable wrappers
        List<String> unmodifiableList = Collections.unmodifiableList(list);
        Set<String> unmodifiableSet = Collections.unmodifiableSet(set);
        Map<String, Integer> unmodifiableMap = Collections.unmodifiableMap(map);
        
        // ========================================
        // 26. STREAMS (Java 8+, essential in modern Java)
        // ========================================
        list.stream()
            .filter(s -> s.startsWith("a"))
            .map(String::toUpperCase)
            .sorted()
            .distinct()
            .limit(10)
            .forEach(System.out::println);
        
        // Collecting to different collections
        List<String> filtered = list.stream()
            .filter(s -> s.length() > 3)
            .toList();  // Java 16+ (immutable)
        
        Set<String> uniqueSet = list.stream()
            .collect(Collectors.toSet());
        
        Map<Integer, String> lengthMap = list.stream()
            .collect(Collectors.toMap(String::length, s -> s, (a, b) -> a));
        
        // ========================================
        // 27. OPTIONAL (Modern null handling)
        // ========================================
        Optional<String> optional = Optional.of("value");
        optional.ifPresent(System.out::println);
        String value = optional.orElse("default");
        String computed = optional.orElseGet(() -> "computed");
        
        // ========================================
        // 28. RECORDS (Java 14+, for data classes)
        // ========================================
        record Person(String name, int age) {}
        
        Person person = new Person("Alice", 30);
        String name = person.name();
        int age = person.age();
        
        List<Person> people = List.of(
            new Person("Alice", 30),
            new Person("Bob", 25)
        );
        
        // ========================================
        // 29. PATTERN MATCHING (Java 21)
        // ========================================
        Object obj = "Hello";
        
        // Pattern matching for instanceof
        if (obj instanceof String s) {
            System.out.println(s.toUpperCase());
        }
        
        // Pattern matching in switch (Java 21)
        String result2 = switch (obj) {
            case String s -> "String: " + s;
            case Integer i -> "Integer: " + i;
            case null -> "Null value";
            default -> "Unknown type";
        };
        
        // Record patterns (Java 21)
        Object personObj = new Person("Charlie", 35);
        if (personObj instanceof Person(String n, int a)) {
            System.out.println(n + " is " + a + " years old");
        }
        
        // ========================================
        // 30. VIRTUAL THREADS (Java 21 - for concurrent tasks)
        // ========================================
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            executor.submit(() -> {
                System.out.println("Running in virtual thread");
                return "result";
            });
        }
        
        // ========================================
        // 31. EXCEPTION HANDLING WITH COLLECTIONS
        // ========================================
        try {
            list.get(100);  // IndexOutOfBoundsException
        } catch (IndexOutOfBoundsException e) {
            System.err.println("Index out of bounds: " + e.getMessage());
        }
        
        try {
            immutableList.add("d");  // UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.err.println("Cannot modify immutable collection");
        }
        
        try {
            TreeSet<String> nullSet = new TreeSet<>();
            // nullSet.add(null);  // NullPointerException
        } catch (NullPointerException e) {
            System.err.println("Null not allowed");
        }
        
        try {
            Queue<String> emptyQueue = new LinkedList<>();
            emptyQueue.element();  // NoSuchElementException
        } catch (NoSuchElementException e) {
            System.err.println("Queue is empty");
        }
        
        // ========================================
        // 32. COMPARATOR (Modern functional style)
        // ========================================
        people.sort(Comparator.comparing(Person::age));
        people.sort(Comparator.comparing(Person::name).reversed());
        people.sort(Comparator.comparing(Person::age)
                              .thenComparing(Person::name));
        
        // ========================================
        // 33. TEXT BLOCKS (Java 15+)
        // ========================================
        String json = """
            {
                "name": "Alice",
                "age": 30,
                "city": "NYC"
            }
            """;
        
        // ========================================
        // 34. VAR (Java 10+, type inference)
        // ========================================
        var autoList = new ArrayList<String>();
        var autoMap = new HashMap<String, Integer>();
        var autoSet = new HashSet<Integer>();
        
        // ========================================
        // PRINT EXAMPLES
        // ========================================
        System.out.println("Modern Java 21 Collections Demo");
        System.out.println("ArrayList: " + list);
        System.out.println("Immutable List: " + immutableList);
        System.out.println("SequencedMap: " + seqMap);
        System.out.println("PriorityQueue: " + minHeap.peek());
    }
    
    // ========================================
    // GENERIC CLASS
    // ========================================
    static class Box<T> {
        private T content;
        
        public Box(T content) {
            this.content = content;
        }
        
        public T getContent() {
            return content;
        }
    }
    
    // ========================================
    // BOUNDED GENERIC CLASS
    // ========================================
    static class NumberBox<T extends Number> {
        private T number;
        
        public NumberBox(T number) {
            this.number = number;
        }
        
        public double getDoubleValue() {
            return number.doubleValue();
        }
    }
    
    // ========================================
    // MULTIPLE BOUNDS
    // ========================================
    static class MultiBox<T extends Comparable<T> & CharSequence> {
        private T value;
        
        public MultiBox(T value) {
            this.value = value;
        }
    }
    
    // ========================================
    // GENERIC METHOD
    // ========================================
    public static <K, V> Map<K, V> createPair(K key, V value) {
        return Map.of(key, value);
    }
    
    // ========================================
    // GENERIC METHOD WITH BOUNDS
    // ========================================
    public static <T extends Comparable<T>> T findMax(List<T> list) {
        return Collections.max(list);
    }
}
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