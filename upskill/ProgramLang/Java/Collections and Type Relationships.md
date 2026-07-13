# Java Collections and Type Relationships

> [!summary]
> The collection hierarchy and the extends-versus-implements rules define how Java types relate and which implementations fit each need.

## Java Collections Hierarchy

### Memory trick: **"I Can List Quietly, Sets Don't Repeat"**
> **I**terable → **C**ollection → **L**ist / **Q**ueue / **S**et → concrete classes

### Full Tree

```
Iterable  (interface)
└── extends → Collection  (interface)
                ├── extends → List  (interface)
                │               ├── implements → ArrayList
                │               ├── implements → LinkedList  (also implements Deque)
                │               └── implements → Vector
                │                                   └── extends → Stack
                │
                ├── extends → Queue  (interface)
                │               ├── implements → PriorityQueue
                │               └── extends → Deque  (interface)
                │                               ├── implements → ArrayDeque
                │                               └── implements → LinkedList
                │
                └── extends → Set  (interface)
                                ├── implements → HashSet
                                │                   └── extends → LinkedHashSet
                                └── extends → SortedSet  (interface)
                                                └── extends → NavigableSet  (interface)
                                                                └── implements → TreeSet
```


### Interface → Concrete Class (what `implements` what)

| Concrete Class | Implements | Also extends |
|---|---|---|
| `ArrayList` | `List` | `AbstractList` |
| `LinkedList` | `List`, `Deque` | `AbstractSequentialList` |
| `Vector` | `List` | `AbstractList` |
| `Stack` | — | `Vector` |
| `PriorityQueue` | `Queue` | `AbstractQueue` |
| `ArrayDeque` | `Deque` | `AbstractCollection` |
| `HashSet` | `Set` | `AbstractSet` |
| `LinkedHashSet` | `Set` | `HashSet` |
| `TreeSet` | `NavigableSet` | `AbstractSet` |

### Interface → Interface (what `extends` what)

| Child Interface | Extends |
|---|---|
| `Collection` | `Iterable` |
| `List` | `Collection` |
| `Queue` | `Collection` |
| `Deque` | `Queue` |
| `Set` | `Collection` |
| `SortedSet` | `Set` |
| `NavigableSet` | `SortedSet` |

> **Rule:** Interfaces use `extends`, not `implements`. Only classes `implement` interfaces.

## extends & implements — All Scenarios

## The 2 Keywords, Simply Put

- **`extends`** → inherit / expand → used by class→class or interface→interface
- **`implements`** → fulfil a contract → used by class→interface **only**

---

## ✅ What's Allowed

| Who | Keyword | Target | Multiple? |
|---|---|---|---|
| Class | `extends` | Class | ❌ One only |
| Class | `implements` | Interface | ✅ Many |
| Class | `extends` + `implements` | Class + Interface(s) | extends one, implements many |
| Interface | `extends` | Interface | ✅ Many |

```java
class Dog extends Animal { }                        // class → class
class Duck implements Swimmable { }                 // class → interface
class Duck implements Swimmable, Flyable { }        // class → many interfaces
class ArrayList extends AbstractList
              implements List, Cloneable { }        // both at once (extends first!)
interface SortedSet extends Set { }                 // interface → interface
interface C extends A, B { }                        // interface → many interfaces
```

---

## ❌ What's Illegal

| Who | Keyword | Target | Why |
|---|---|---|---|
| Class | `extends` | Two classes | Diamond problem — Java forbids it |
| Class | `implements` | Class | `implements` is for interfaces only |
| Interface | `implements` | Interface | Interfaces never use `implements` |
| Interface | `extends` | Class | Interfaces only know other interfaces |

```java
class Dog extends Animal, Pet { }        // ❌ can't extend two classes
class Dog implements Animal { }          // ❌ Animal is a class, not interface
interface Pet implements Animal { }      // ❌ interfaces don't implement
interface Pet extends Animal { }         // ❌ Animal is a class, not interface
```

---

## One-Line Rules to Remember

1. `implements` → **always points at an interface, always written by a class**
2. `extends` → **class uses it for a class, interface uses it for an interface**
3. A class can extend **one** but implement **many**
4. An interface can extend **many** interfaces
5. `extends` always comes **before** `implements` when both are used

---

## Key Differences Between Common Implementations

| | `ArrayList` | `LinkedList` | `HashSet` | `TreeSet` |
|---|---|---|---|---|
| Order | Insertion | Insertion | None | Sorted |
| Duplicates | ✅ | ✅ | ❌ | ❌ |
| Null allowed | ✅ | ✅ | One `null` | ❌ |
| Access speed | O(1) get | O(n) get | O(1) | O(log n) |
| Interface | `List` | `List`, `Deque` | `Set` | `SortedSet` |

## The `extends` vs `implements` Rule (one line each)

- **`extends`** → inherit from a class *or* expand an interface → **"I am a more specific version"**
- **`implements`** → fulfil an interface contract → **"I promise to have these methods"**

---
