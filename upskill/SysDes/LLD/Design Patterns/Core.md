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

 [[SOLID principles]]

---

## References

> [!info] Source trail
> Design-pattern resources that support this note.

- [Software Design Patterns](https://www.geeksforgeeks.org/system-design/software-design-patterns/) - Pattern reference.
- [7 Design Patterns EVERY Developer Should Know](https://www.youtube.com/watch?v=BJatgOiiht4) - Pattern overview.

#sysdes #design-patterns #core
