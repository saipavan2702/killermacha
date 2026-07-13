# Java Fundamentals

> [!summary]
> Core rules for visibility, application entry points, constructors, and methods.

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

## Constructors vs Methods

| | Constructor | Method |
|---|---|---|
| **Return type** | None (not even `void`) | Must declare one |
| **Name** | Must match class name exactly | Any valid name |
| **Default** | Java provides one if you declare none | No default methods |
| **Inheritance** | Cannot be inherited | Can be inherited |
| **When called** | At object creation (`new`) | Explicitly called |

```java
public class Dog {
    String name;

    // Constructor — no return type, same name as class
    public Dog(String name) {
        this.name = name;
    }

    // Method — has return type, different name
    public String bark() {
        return "Woof!";
    }
}
```
