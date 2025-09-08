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

