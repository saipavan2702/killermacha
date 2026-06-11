- It is a synchronous single -threaded  language.
- The function can be invoked before it is compiled/encountered.
- It stores functions as it is. Means when it is casted for output we can see whole function in output.


- undefined- a placeholder for a variable which is initialized.
- not defined- a variable which is never initialized.
- Arrow function `var func=()=>{…}` It does not exhibit same properties as normal function instead it can be seen as a normal variable.


- The call stack throws out the executed function and its memory inside compiler. So, the values they are assigned to are discarded after their execution.(If variable value is changed inside function)
```javascript
var x=1
a()
b()
console.log(x)

function a(){
	var x=10
	console.log(x)
}

function b(){
	var x=100
	console.log(x)
}

// output: 10,100,1
```
- Scope, where we can access a specific variable or a function.
```javascript
function a(){
	var b=10
	function c(){
	}
}
a()
console.log(b)
```

Upon running above we get an error as var b is not in lexical environment of its memory space. Scope chain is mentioned when a function in function occurs in order with its lexical environment. In the above the scope chain will be from c->a->global.

- let & const hoisting is done separately in a block(makes them block scope) so they are not in global environment.
- Window object cannot access these variables.
- The **temporal dead zone** (TDZ) is a specific period in the execution of JavaScript code where variables declared with `let` and `const` exist but cannot be accessed or assigned any value. During this phase, accessing or using the variable will result in a `ReferenceError`.


- For const variable the data should be assigned in the same line. Reassigning another value to it gives TypeError. Missing declaration to const also gives SyntaxError.
```javascript
console.log(x)
let x=10
//Code is rejected completely by giving reference error.
//but for var x=10 it gives undefined as reuslt.
```

- In summary, the TDZ is a period during which `let` and `const` variables exist but are not yet accessible. It helps catch potential issues caused by accessing variables before their initialization, ensuring more reliable and predictable code.
- Using `window` key we can change variable value globally.
```javascript
var c=10
function b(){
	var c=30;
	console.log(window.c)
	window.c=20
}
b()
console.log(c);

// output: 10,20
```

```javascript

let x=10
function a(){
	var x=100;
}
console.log(x);

// output: 10
//var is a function scope variable
```

- Closure it is referred as function bundled together with its lexical environment.
- Whenever a function is returned, even if it is vanished from execution context it still remembers the reference it was pointing to.
- Not just function alone but its entire closure

#ref
[JS Que](https://umarfarooquekhan.medium.com/top-10-javascript-interview-questions-9c337fa746f6)

- `setTimeout` is an asynchronous function. It doesn't block the execution of the loop; instead, it schedules the provided function to be executed after a specified delay.

```javascript
for(let i=0;i<6;i++){
    setTimeout(()=>{
        console.log(i)
    },i*1000)
}
//output: 6 6 6 6 6 6

for(let i=0;i<6;i++){
    setTimeout(()=>{
        console.log(i)
    },i*1000)
}
//output: 0 1 2 3 4 5

```

- The function inside `setTimeout` captures the reference to the variable `i`. However, it doesn't capture the value of `i` at the time the function is created; it captures a reference to the variable itself.
- Since there is only one variable `i` shared across all iterations, when the functions inside `setTimeout` execute, they all reference the same `i`, which has been incremented to `6` by the time the functions execute.

#tips 
```javascript
const arr=[1,2,3,4,5,5,4,5]

const ans=arr.reduce((acc,curr)=>{
    if(curr>acc){
        acc=curr
    }
    return acc
},0)
console.log(ans)

const unique=arr.reduce((acc,curr)=>{
   if(!acc.includes(curr)) {
       //acc.push(curr)
       return [...acc,curr]
   }
   return acc
},[])

console.log(unique);

const count=arr.reduce((acc,curr)=>{
    if(acc[curr]){
        acc[curr]=++acc[curr]
    }else{
        acc[curr]=1
    }
    return acc
},{})

console.log(count)

let people = [
  { name: "John", age: 21 },
  { name: "Oliver", age: 55 },
  { name: "Michael", age: 55 },
  { name: "Dwight", age: 19 },
  { name: "Oscar", age: 21 },
  { name: "Kevin", age: 55 },
];

function groupBy(people, property) {
  return people.reduce(function (acc, curr) {
    let key = curr[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});
}

let groupedPeople = groupBy(people, "age");
console.log(groupedPeople);

//Some examples of reduce() method in JS'
```


### OOPs
```js
class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getInfo() {
    return `The name of the animal is ${this.name} and the age is ${this.age}`;
  }
}

const first = new Animal("Rex", 6);
console.log(first);
console.log(first.getInfo());
  

//Inheritance
class Dog extends Animal {
  constructor(name, age, breed) {
    super(name, age);
    this.breed = breed;
  }
  bark() {
    return "woof";
  }
}

const firstDog = new Dog("Rex", 6, "German shepard");
console.log(firstDog);
console.log(firstDog.getInfo());
console.log(firstDog.bark());


//Encapsulation
class Cat extends Animal {
  #weight;
  constructor(name, age, weight) {
    super(name, age);
    this.#weight = weight;
  }
  getWeight() {
    return this.#weight;
  }
  setWeight(weight) {
    this.#weight = weight;
  }
}

const firstCat = new Cat("charon", 7, "3kg");
console.log(firstCat.weight); //private property does not show up in logs and we cannot access it directly
firstCat.setWeight("6kg");
console.log(firstCat.getWeight());

  
//Polymorphism
//Child class functions override parent classes

//static 
class Person{
  static add(x,y){
    return x+y
  }
}
const res=Person.add(3,5);
console.log(result);
//For js static methods are available to class itself not instances.
//There are get and set keywords in javascript
```
 
### Prototypes

```js
const person={
  greet: function(){
    console.log(`Hi ${this.name}`);
  }
}

const raju=Object.create(person);
raju.name="Alice";
raju.greet();

//using constructor

function person(name){
  this.name=name;
}

person.prototype.greet= function(){
  console.log(`Hello ${this.name}`)
}
const akash=new person("Alice");
akash.greet();
```

### Arrow functions
They are almost same as `function` in javascript, they are more of a syntactic sugars. They differ in some aspects.

- #### No `arguments` object in arrow functions
- #### Arrow functions do not create their own `this` binding
- #### Arrow functions cannot be accessed before initialization


### Event loop
Javascript is a single threaded language. It has four major components i.e., call stack, web api's, task queue, micro task queue. Let's ay we have some functions, some of them are asynchronous too.
```
call stack {
 Promise(foo())
 setTimeout(log,1000)
 main()
}

Web APIs {
 setTimeout(log,1000)
}

Task Queue {
  log()
}

micro task queue {
  foo()
}
```
Here we can see that as Promise are more priority they are pushed into micro task queue, and when call stack becomes empty first micro task queue will become empty and next task queue after the delay provided.

### Nodejs
Node.js accepts the request from the clients and sends the response, while working with the request node.js handles them with a single thread. 

To operate I/O operations or requests node.js use the concept of threads. Thread is a sequence of instructions that the server needs to perform. It runs parallel on the server to provide the information to multiple clients.

Libuv is an open-source library built-in C. It has a strong focus on asynchronous and  I/O, this gives node access to the underlying computer operating system, file system, and networking.

Libuv implements two extremely important features of node.js  
- Event loop
- Thread pool

Synchronous actions are carried out normally where the actions are stored in call stack in V8 engine(call stack, memory heap). Asynchronous actions are pushed to libuv.

There are six different queues in event loop, first one is timer queue(setTimeout, setInterval), second one is I/O queue(cb of fs, http), check queue(setImmediate), close queue(close handler cb's), at last there is micro task queue which has two queues separately they are nextTick queue and Promise queue.

```js
console.log("start");
setTimeout(()=>console.log("timeout finsihed"),0);
fs.readFile("a.txt",(err,data)=>console.log("data returns"));

setImmediate(()=>{
  console.log("executing setImmediate cb");
  setTimeout(()=>console.log("second timeout finished"),0)
})

console.log("end")

//output
/**
start [Timer-(setTimeout), I/O poll-(fs), check-(setImmediate)]
end
timeout finished
executing setImmediate cb [Timer-(setTimeout_ii), I/O poll-(fs)]
second timout
data returns
*/
```

### Debouncing
If we click a button too many times, there are going to be chances of irresponsive(freezed) UI and there will be too many requests(API calls). So we use this to ensure that certain tasks doesn't fire too often. 

```js
const debounce = (fn, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

document.getElementbyId("btn").addEventListener(
  'click',
  debounce(() => {
    console.log("click");
  }, 1000)
); 
```

### Throttling
It is firing event between intervals unlike debouncing, so when we click on button it will execute first time and if we keeps on hitting it will not fire event until interval has passed.

```js

const throttleFunction = (func, delay) => {
	let prev = 0;
	return (...args) => {
		let now = new Date().getTime();
		if (now - prev > delay) {
			prev = now;
			return func(...args);
		}
	}
}
document.getElementbyId("btn").addEventListener(
  'click',
   throttleFunction(() => {
       console.log("button is clicked")
   }, 1500)
);  
```


In javascript generally objects are passed by references, not by values. So this type is deep copy as for shallow copy we use `{...spread}` operator.
```js
let arr1 = [ 1, 2, 3];
let arr2 = arr1;

console.log(arr1); // [1, 2, 3]
console.log(arr2); // [1, 2, 3]

arr1.push(4);

console.log(arr1); // [1, 2, 3, 4]
console.log(arr2); // [1, 2, 3, 4]
```

```js
const user1 = {
	name: 'Jen',
	age: 22,
};

const user2 = {
	name: "Andrew",
	location: "Philadelphia"
};

const mergedUsers = { ...user1, ...user2 };
console.log(mergedUsers);

//output
{ name: 'Andrew', age: 22, location: 'Philadelphia' }
```

### Async event example

```js

console.log('Start');
function asyncFunc(callback) {
  console.log('Executing asyncFunc');
  setTimeout(() => {
    callback('Hello from asyncFunc');
  }, 1000);
}
asyncFunc((result) => {
  console.log(result);
});
console.log('End');

/*
Output: 
Start
End
Executing asyncFunc
Hello from asyncFunc
*/
```

#ref 
[oops](https://www.freecodecamp.org/news/object-oriented-javascript-for-beginners/#some-things-to-keep-in-mind-about-inheritance-)
[prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes)
[prototypes-ii](https://www.freecodecamp.org/news/a-beginners-guide-to-javascripts-prototype/)
[arrow-func](https://www.freecodecamp.org/news/the-difference-between-arrow-functions-and-normal-functions/)
[event-loop](https://medium.com/preezma/node-js-event-loop-architecture-go-deeper-node-core-c96b4cec7aa4)
[event-loop-ii](https://www.builder.io/blog/visual-guide-to-nodejs-event-loop)
[debounce](https://www.30secondsofcode.org/js/s/debounce-function/#:~:text=Debouncing%20is%20a%20technique%20used,artificially%20create%20the%20necessary%20delay.)
[throttling](https://javascript.plainenglish.io/debouncing-and-throttling-in-javascript-3c8f8cf5e645)
[faq1](https://freedium.cfd/https%3A%2F%2Fmedium.com%2F%40lelianto.eko%2Fsome-questions-for-senior-frontend-developer-2d61d28ba456%3Fsource%3Demail-f55e20219663-1690517461724-digest.reader--2d61d28ba456----2-98------------------c70ead38_609e_4fe8_b1ff_f95b24ed7a7a-1)
