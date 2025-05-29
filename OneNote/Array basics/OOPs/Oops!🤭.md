The **Class** is a user-defined data type which defines its properties and its functions. It is the only logical representation of the data.
 
**Object** is a run-time entity. It is an instance of the class. An object can represent a person, place or any other item. An object can operate on both data members and member functions.
   

● **Inheritance**
 
Inheritance is a process in which one object acquires all the properties and behaviors of its parent object automatically. In such a way, you can reuse, extend or modify the attributes and behaviors which are defined in other classes.
 
In C++ , the class which inherits the members of another class is called derived class and the class whose members are inherited is called base class. The derived class is the specialized class for the base class.
 
**Types of Inheritance** **:-**
 
**1. Single inheritance :** When one class inherits another class, it is known as single level inheritance
 
**2. Multiple inheritance :** Multiple inheritance is the process of deriving a new class that inherits the attributes from two or more classes.
 
**3. Hierarchical inheritance :** Hierarchical inheritance is defined as the process of deriving more than one class from a base class.
 
**4. Multilevel inheritance :** Multilevel inheritance is a process of deriving a class from another derived class.   **5. Hybrid inheritance :** Hybrid inheritance is a combination of simple, multiple inheritance and hierarchical inheritance.
   

**● Encapsulation**
 
Encapsulation is the process of combining data and functions into a single unit called class. In this data is not accessed directly. We use restrictive methods to make it visible according to the attribute we desire.  
The concept of data hiding is achieved from this. As we know private, public, protected.
   

**● Abstraction**
 
We try to obtain an abstract view, model or structure of a real life problem, and reduce its unnecessary details.  
For example making coffee in a coffee machine is a best example of abstraction, as we only need to know what are the things mainly required to put in machine(coffee beans, water etc.) and no need to know the optimal temperature of water or how machine works internally we only need an abstract amount of knowledge to get our work done.
 
**● Polymorphism**
 
Polymorphism is the ability to present the same interface for differing underlying forms (data types). Due to this each class will have different data types. It has mainly 2 types. i)Static ii)Dynamic
 
**Static/Compile-time polymorphism**  
The polymorphism which is implemented at the compile time is known as compile-time polymorphism.  
Method overloading is a representation of this static polymorphism. It is a technique which allows you to have more than one function with the same function name but with different functionality. In this method overloading the same classes may differ in 3 ways.
 
1. The return type of the overloaded function.  
2. The type of the parameters passed to the function.  
3. The number of parameters passed to the function.
 
-\>They need to expect parameters in different order. This is not recommended as it makes API difficult to understand.
 
**Dynamic/Run-time polymorphism**
 
Function overriding is an application of this. It means when child class contains the method already present in parent class. Hence, child class overrides method of parent class.
 
● **Constructor** is a special method which is invoked automatically at the time of object creation. It is used to initialize the data members of new objects generally.
 
● **Destructor**, it destructs the objects of classes. It can be defined only once in a class. Like constructors, it is invoked automatically. A destructor is defined like a constructor. It must have the same name as class, prefixed with a tilde sign (~).
 
● **‘this’** Pointer : this is a keyword that refers to the current instance of the class.
 
1. It can be used to pass the current object as a parameter to another method  
2. It can be used to refer to the current class instance variable.  
3. It can be used to declare indexers.
 
● **Namespaces in C++**  
The main purpose of using namespace in C++ is to remove the ambiguity. Ambiguity occurs when a different task occurs with the same name.
 
**● Friend Function**  
Friend function acts as a friend of the class. It can access the private and protected members of the class. The friend function is a non-member function and has the ability to access the private data of the class.