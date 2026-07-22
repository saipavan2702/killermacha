Map: [[Upskill/ProgramLang/Java/Java|Java]]
Connections: [[Upskill/ProgramLang/Java/Coupling and Dependency Injection|Coupling and Dependency Injection]], [[Upskill/ProgramLang/Java/Spring Boot|Spring Boot]]

Inversion of Control (IoC) is a design principle in software engineering .
In general, we have control over object creation and lifecycle management but we give up the control and give it to external container/framework.

For example without `IoC` our code would look like this:
```java
// Without IoC — your class builds its own dependency
public class NotificationService {

    private EmailSender emailSender;

    public NotificationService() {
        this.emailSender = new EmailSender(); // ← You're in control
    }

    public void notify(String message) {
        emailSender.send(message);
    }
}
```

Problem is `NotificationService` is tightly coupled to `EmailSender`.
But with IoC we can decouple them.
```java
// The contract (interface)
public interface MessageSender {
    void send(String message);
}

// One implementation
@Component
public class EmailSender implements MessageSender {
    public void send(String message) {
        System.out.println("Email sent: " + message);
    }
}

// Another implementation (easy to swap)
@Component
public class SmsSender implements MessageSender {
    public void send(String message) {
        System.out.println("SMS sent: " + message);
    }
}

// The service — Spring injects the dependency
@Service
public class NotificationService {

    private final MessageSender messageSender;

    @Autowired  // ← Spring is now in control of creating and providing this
    public NotificationService(MessageSender messageSender) {
        this.messageSender = messageSender;
    }

    public void notify(String message) {
        messageSender.send(message);
    }
}
```




#java #springboot
