# Structural

### 1. Adapter
**Purpose**: Make incompatible interfaces work together.
**Use when**: A third-party library gives data in a format your app does not expect. The adapter translates between the two without changing either side.
**Example**: USB-C to USB-A adapter
```java
class OldPrinter { void printOld(String text) {...} }
class PrinterAdapter implements ModernPrinter {
    OldPrinter oldPrinter;
    public void print(String text) {
        oldPrinter.printOld(text);
    }
}

// Third-party API speaks Celsius + km, your app expects F + miles
class WeatherAdapter implements WeatherApp {
    private WeatherAPI api;  // the incompatible third-party

    public double getTempF() {
        return toFahrenheit(api.getTempC()); // translate on the fly
    }

    public double getDistanceMiles() {
        return toMiles(api.getDistanceKm());
    }
}

// Your app only ever calls WeatherAdapter, never the raw API directly
WeatherApp w = new WeatherAdapter(thirdPartyApi);
```
> Think: USB-C to HDMI dongle. Same idea, but in code.

### 2. Bridge
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

### 3. Composite
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

### 4. Decorator
**Purpose**: Add features to objects dynamically.
**Example**: Coffee with milk, sugar, whipped cream
```java
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
```

### 5. Facade
**Purpose**: Provide a simple interface to complex subsystems.
**Use when**: Several complex subsystems must work together. Wrap them behind a single simple method so the caller does not need to know the internals.
**Example**: Home theatre system with one "Watch Movie" button
```java
class HomeTheater {
    Projector projector;
    SoundSystem sound;
    public void watchMovie() {
        projector.on();
        sound.setVolume(5);
    }
}

// BAD: caller must orchestrate every subsystem manually
if (PaymentProcessor.charge(cart)) {
    if (InventorySystem.reserve(cart)) {
        FraudChecker.verify(cart);  // ...and so on
    }
}

// GOOD: one method call, all complexity hidden inside
OrderFacade facade = new OrderFacade();
facade.placeOrder(cart);  // payment + inventory + fraud, all handled
```
> Like clicking "Buy Now" on a website: you do not see the backend, and you do not need to.

### 6. Flyweight
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

### 7. Proxy
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

#sysdes #design-patterns
