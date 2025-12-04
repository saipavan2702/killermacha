## **Class**
- A **Class** is a user-defined data type that defines its **properties** (data members) and **functions** (member functions).  
- It is the **logical representation** of the data.

---

## **Object**
- An **Object** is a **run-time entity** and an **instance of a class**.  
- An object can represent a person, place, or any real-world item.  
- It can operate on both **data members** and **member functions**.

---

## **Inheritance**
Inheritance allows one class to acquire the **properties** and **behaviours** of another class.  
It helps in **reusing**, **extending**, or **modifying** existing functionality.

- **Base class** → the class whose members are inherited.  
- **Derived class** → the class that inherits from the base class.

### **Types of Inheritance**
1. **Single Inheritance** → One class inherits from another.  
2. **Multiple Inheritance** → A class inherits from two or more classes.  
3. **Hierarchical Inheritance** → Multiple classes inherit from a single base class.  
4. **Multilevel Inheritance** → A class derives from another derived class.  
5. **Hybrid Inheritance** → A combination of multiple and hierarchical inheritance.

---

## **Encapsulation**
- The process of **combining data and methods** into a single unit called a **class**.  
- Data is not directly accessible; access is controlled using **public**, **private**, and **protected** specifiers.  
- Achieves the principle of **data hiding**.

---

## **Abstraction**
- Provides an **abstract view** of a real-world problem while hiding unnecessary details.  
- Example: **Coffee Machine** → we only need to add water & beans; we don’t need to know the internal heating process.  

---

## **Polymorphism**
Polymorphism allows the **same interface** to represent different underlying forms (data types).

### **1. Static / Compile-time Polymorphism**
- Achieved at **compile time**.  
- Implemented using **method overloading**.  
- A function can differ by:
  1. Return type  
  2. Number of parameters  
  3. Type of parameters  
- (Different parameter order is possible but **not recommended** as it reduces readability.)

### **2. Dynamic / Run-time Polymorphism**
- Achieved at **run time**.  
- Implemented using **method overriding**.  
- A derived class defines a method with the **same signature** as in the base class, overriding its behaviour.

---

## **Constructor & Destructor**
- **Constructor** → Special function, called automatically when an object is created. Used to initialise members.  
- **Destructor** → Special function, called automatically when an object is destroyed. Prefixed with a `~` (tilde).

---

## **`this` Pointer**
The `this` keyword refers to the **current instance** of the class.

Uses:
1. Passing the current object as a parameter.  
2. Referring to instance variables of the class.  
3. Declaring indexers.

---

## **Namespaces**
- Used to **avoid ambiguity** when multiple identifiers (functions, variables, classes) have the same name.  
- Helps in organizing large projects.

---

## **Friend Function**
- A **non-member function** that can access the **private** and **protected** members of a class.  
- Declared using the `friend` keyword.  
- Provides flexibility but should be used sparingly to avoid breaking **encapsulation**.
