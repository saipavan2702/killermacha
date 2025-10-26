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