### 1. Chain of Responsibility
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

### 2. Command
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

### 3. Iterator
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

### 4. Mediator
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

### 5. Memento
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

### 6. Observer
**Purpose**: Notify multiple objects when one object changes.
**Use when**: Many objects need to react when one object's state changes, without the source needing to know who is listening.
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

// BAD: polling, constantly checking if something changed
while (true) {
    for (User u : allMillionUsers) checkForNewVideo(u); // brutal and wasteful
}

// GOOD: subscribers register once, then get pushed a notification automatically
class VideoChannel {
    List<Subscriber> subs = new ArrayList<>();

    void addSubscriber(Subscriber s) { subs.add(s); }

    void upload(String title) {
        // event fires: everyone in the list is notified instantly
        for (Subscriber s : subs) s.notify(title);
    }
}
```
> Like YouTube subscriptions: the channel pushes to you. You do not keep refreshing to check.

### 7. State
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

### 8. Strategy
**Purpose**: Choose algorithm at runtime.
**Use when**: The same action has multiple implementations that need to be interchangeable without touching the surrounding code.
**Example**: Payment methods (Credit Card, PayPal, Crypto)
```java
interface PaymentStrategy { void pay(int amount); }
class ShoppingCart {
    PaymentStrategy payment;
    void checkout(int amount) { payment.pay(amount); }
}

// BAD: one big method with if/else for every transport type
if (mode == "car")       driveToWork();
else if (mode == "bike") cycleToWork();
else if (mode == "bus")  takeBusToWork();

// GOOD: inject any strategy object, Commuter stays the same
Commuter commuter = new Commuter();

commuter.setStrategy(new CarStrategy());
commuter.goToWork();   // runs car logic

commuter.setStrategy(new BikeStrategy()); // swap, zero changes elsewhere
commuter.goToWork();   // runs bike logic
```
> Core rule: program to an interface, not an implementation.

### 9. Template Method
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

### 10. Visitor
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

#sysdes #design-patterns
