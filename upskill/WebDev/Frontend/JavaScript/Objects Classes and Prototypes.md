> [!summary]
> JavaScript objects inherit through prototype chains; class syntax provides a clearer surface over that same model.

Map: [[Upskill/WebDev/Frontend/JavaScript/JavaScript|JavaScript]]
Connections: [[Upskill/WebDev/Frontend/JavaScript/Scope Functions and Closures|Scope, Functions, and Closures]], [[Upskill/SysDes/LLD/Object-Oriented Programming|Object-Oriented Programming]], [[Upskill/SysDes/LLD/Inheritance vs Composition|Inheritance vs Composition]]

## Objects and References

Object variables hold references. Assigning one object variable to another does not clone the object.

```javascript
const first = { name: "Jen", skills: ["JavaScript"] };
const same = first;

same.skills.push("TypeScript");
console.log(first.skills); // ["JavaScript", "TypeScript"]
```

A spread creates a shallow copy. Nested objects are still shared.

```javascript
const copy = { ...first };
const independent = structuredClone(first);
```

## Array Reduction

`reduce` turns a sequence into one accumulated value.

```javascript
const values = [1, 2, 3, 3, 2];

const frequencies = values.reduce((counts, value) => {
  counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}, {});

// { 1: 1, 2: 2, 3: 2 }
```

## Classes

```javascript
class Animal {
  #weight;

  constructor(name, weight) {
    this.name = name;
    this.#weight = weight;
  }

  describe() {
    return `${this.name} weighs ${this.#weight}`;
  }
}

class Dog extends Animal {
  speak() {
    return "woof";
  }
}
```

- `extends` links the child prototype to the parent prototype.
- `super()` initializes the parent part of an instance.
- Private fields such as `#weight` are enforced by the language.
- Static methods belong to the class rather than its instances.

## Prototype Chain

```javascript
const greeter = {
  greet() {
    return `Hello ${this.name}`;
  }
};

const person = Object.create(greeter);
person.name = "Asha";
person.greet(); // Hello Asha
```

If a property is not found directly on `person`, JavaScript follows its prototype to `greeter`, then continues until the chain ends at `null`.

#javascript #objects

---

## References

- [Inheritance and the Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain) - JavaScript's object inheritance model.
- [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) - Class syntax and semantics.
- [Object-Oriented JavaScript](https://www.freecodecamp.org/news/object-oriented-javascript-for-beginners/) - Introductory examples.
