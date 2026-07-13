# C++ Memory and Parameters

> [!summary]
> Explicit ownership and parameter-passing semantics determine whether C++ code copies, aliases, leaks, or safely releases memory.

## Memory Leaks

Memory management in cpp while dealing with pointers there can be some memory leaks, so we should be careful.
For example,

```cpp
#include <iostream>

int b = 20;

int main() {
    int *p = new int;

    p = new int(10);
    return 0;
}

```

The previous memory block allocated by new int is still reserved in heap memory.
However, we lost the address of that memory because p now points elsewhere.
Since there's no way to free that memory now, it remains allocated indefinitely → Memory Leak!

Now to deal with this, 
```cpp
delete p;  // Free allocated memory
p = nullptr;  // Avoid dangling pointer issues
```

It is a good practice to assign null to the pointer after deletion. 
A dangling pointer is a pointer that refers to a memory location that has been freed. Setting p = nullptr; ensures that it doesn't point to invalid memory.


### Pass by Value

```cpp
void update(int x) { 
    x = 20; 
}

int main() {
    int c = 10;
    update(c);
    cout << c; // Still prints 10
}
```

Here we are passing c to update func, and that is a frame in stack where it stores x with diff memory address, and when we update x value changes, but c memory address and value doesn't get affected.

### Pass by Pointer

```cpp
void update(int *p) { 
	if(p==nullptr) return;
    *p = 20; 
}

int main() {
    int c = 10;
    update(&c); // address of c 
    cout << c; // Prints 20
}
```

Here we are passing address of c and we are changing the value stored in address using a pointer, so c value changes, but here another memory address for p gets allocated.
Also always check while dereferencing a pointer that it is not null.

### Pass by Reference

```cpp
void update(int &r) { 
    r = 20; 
}

int main() {
    int c = 10;
    update(c); // address of c is passed
    cout << c; // Prints 20
}
```

Here no new variable is created, r is just another alias of c and we are updating the c itself.
While doing pass by reference we have to make sure passing variable is not null.
```cpp
void update(int &r) {
	r = 20;
}

int main() {
	int *p = nullptr;
	update (*p) ; 
}
//This gives error
```
