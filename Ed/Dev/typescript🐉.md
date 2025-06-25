#typescript 
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


#ref 
[decorators](https://medium.com/@InspireTech/what-are-decorators-in-typescript-and-how-to-use-decorators-d82d15c5851f#:~:text=A%20Decorator%20is%20a%20special,information%20about%20the%20decorated%20declaration.)
