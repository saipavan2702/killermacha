Tags: #webdev #typescript
Map: [[Upskill/WebDev/Frontend/React Basics|React Basics]]

```ts
/**
*@callback funcName
*@param{String} attributeName
*@return{Array<number> | number []}
*/
```

The above is how we write tsdoc for javascript so it can precompile the types of params and return we are expecting.

### Generics
They can provide a way to create reusable components that can work with different types while maintaining type safety.

```ts
//Generics
function getFirstElement<T>(arr: T[]):T {
  return arr[0];
}

const numbers = [1, 2, 3, 4];
console.log(getFirstElement(numbers));

//In classes
class Calendar<T> {
	value:T;
	constructor(initialValue:T){
	  this.value=initialValue;
	}
}

//Constraints
interface Lengthy {
 length:number;
}

function getLength<T extends Lengthy>(input: T):number {
  return input.length;
}

// The above code allows parameters which has length property
```

```ts
type Payment =  | { state: "pending"; id: string }  
| { state: "authorized"; id: string; authorizationId: string }  
| { state: "captured"; id: string; receiptId: string }  
| { state: "failed"; id: string; reason: string };

//Now, a function that sends receipts can require a captured payment:

function sendReceipt(payment: Extract<Payment, { state: "captured" }>) {  return emailReceipt(payment.receiptId);}
```

This is where it gets neat. Extract<T, U> is a built-in conditional type:
```ts
Extract<Payment, { state: "captured" }>
type Extract<T, U> = T extends U ? T : never;
```
Yeah, `Extract` is just one of a whole family of **conditional + distributive utility types** built into TypeScript. Here are the main ones worth knowing, since they follow the same "type-level function" pattern:

```typescript
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;
```

`Exclude` is the mirror image of `Extract` — instead of keeping matching branches, it removes them.

```typescript
type Exclude<Payment, { state: "captured" }>
// → pending | authorized | failed
```

Useful for "everything except the terminal states," etc.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
```

Strips `null`/`undefined` out of a union — this one you actually *can* semi-replicate in Java with `@NonNull` annotations, but it's a linting/static-analysis convention, not an enforced compiler mechanic.

## Types that pull structure *out* of other types

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

This uses `infer` — TypeScript's way of saying "match this shape and bind whatever's in this slot to a new type variable." So:

```typescript
function getPayment(): Payment { ... }
type P = ReturnType<typeof getPayment>; // Payment
```

There's no Java equivalent at all here — Java can't introspect a method's return type at the *type* level like this (only via reflection, at runtime, which is a completely different mechanism).

```typescript
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

function sendReceipt(payment: Extract<Payment, { state: "captured" }>) {}
type Args = Parameters<typeof sendReceipt>;
// → [Extract<Payment, { state: "captured" }>]
```

## Mapped types (a different but related mechanic)

```typescript
type Partial<T> = { [K in keyof T]?: T[K] };
type Required<T> = { [K in keyof T]-?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

These iterate over a type's keys (`keyof T`) and rebuild a new type with modified properties. `Pick`, for instance:

```typescript
type PaymentSummary = Pick<Payment, "id">;
// roughly { id: string } — though since Payment is a union, this actually distributes oddly; more useful on single object types
```

Java has nothing like `keyof` — no way to talk about "the set of property names of a type" as a type-level value.

## Combining them — this is where TS gets genuinely wild

```typescript
type Record<K extends string | number | symbol, V> = { [P in K]: V };

type PaymentByState = Record<Payment["state"], Payment>;
// { pending: Payment; authorized: Payment; captured: Payment; failed: Payment }
```

Or chaining conditional + infer + distribution together:

```typescript
type UnwrapArray<T> = T extends (infer U)[] ? U : T;

type A = UnwrapArray<string[]>; // string
type B = UnwrapArray<number>;   // number
```

All of these are instances of the same thing: **TypeScript's type system is itself a small functional programming language** that runs at compile time — conditional types are `if/else`, `infer` is pattern-matching with variable binding, mapped types are `map()` over a type's keys, and unions distribute automatically like a implicit `flatMap`.

Java's generics, by contrast, are **erased at runtime** and were designed purely for container-style reuse (`List<T>`, `Map<K,V>`) — not for computing new types from existing ones. That's not really a limitation Java "forgot" to fix; it's a fundamentally different design philosophy (nominal typing + reflection for runtime introspection, vs. structural typing + compile-time type computation).

If you want the practical takeaway: in Java, when you want "the type of X but shaped like Y," you almost always have to **declare that shape explicitly** as its own class/record. In TypeScript, you can often **derive** it from existing types instead. Neither is strictly better — Java's approach trades flexibility for simplicity and more predictable tooling; TypeScript's trades some readability (these chains get gnarly fast) for expressiveness.

### Builder patterns
The Builder pattern is a well-known pattern in TypeScript world. It’s especially useful when you need to create an object with lots of possible configuration options.

```ts
class Person {
  name?: string;
  class?: string;
  age?: number;

  contructor(){}
}

interface personInterface {
  setName(name: string): void;
  setClass(className: string): void;
  setAge(age: number): void;
  build(): Person;
}



class PersonBuilder implements personInterface {
  private person: Person;

  constructor() {
    this.person = new Person();
  }

  setName(name: string): void {
    this.person.name = name;
  }

  setClass(className: string): void {
    this.person.class = className;
  }

  setAge(age: number): void {
    this.person.age = age;
  }

  build(): Person {
    return this.person;
  }
}

let person1 = new PersonBuilder();
person1.setName("Alice")
person1.setClass("S-rank")
person1.setAge(6)
person1.build()

console.log(person1)
```

### Decorators
```js
function logger(originalMethod: any, _context: any) {
  function replacementMethod(this: any, ...args: any[]) {
    console.log("start:", originalMethod.name);
    const result = originalMethod.call(this, ...args);
    console.log("end:", originalMethod.name);
    return result;
  }
  return replacementMethod;
}

class User {
  constructor(private name: string, private age: number) {}
  @logger
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
  @logger
  printAge() {
    console.log(`I am ${this.age} years old`);
  }
}

const user = new User("Ron", 25);
user.greet();
user.printAge();

Output:
//greet
start: greet
Hello, my name is Ron
end: greet
//print
start: printAge
I am 25 years old
end: printAge
```
We use decorators, so we could reuse the logic of logging function execution start and end. A wrapper function is created that logs the start and end of the wrapped function.


---

## References

- [Decorators](https://medium.com/@InspireTech/what-are-decorators-in-typescript-and-how-to-use-decorators-d82d15c5851f#:~:text=A%20Decorator%20is%20a%20special,information%20about%20the%20decorated%20declaration.) - Decorator syntax and usage.
- [React TypeScript Components](https://felixgerschau.com/react-typescript-components/) - React component typing.
