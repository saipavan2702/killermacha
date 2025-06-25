### nodemon
`npm i nodemon` is used to install nodemon in backend.

In typescript nodemon had to be installed and we need to update scripts in package.json in order to make sure nodemon runs in required env.

`"nodemon  --watch \"server/**\" --ext \"ts,json\" --exec \"ts-node index.ts\""`

Above script to enable nodemon in typescript env. as --watch on folder server if we give file like index.ts it watches over file and triggers when change happens in any of those files, and --ext is where dictates which type of files should be monitored ts,json files, and --exec executes needed command ts-node index.ts to run index file.


### URLSearchParams 

while performing search we take up many parameters and filter elements to which we have to fetch database.

```js
const {URLSearchParams}=require("url");

//queryString to obj
const queryString="status=solved&difficulty=easy"; 
//It kind of splits string at "&"
const params= new URLSearchParams(queryString);

console.log(params.get("status"));

//obj to queryString

const obj={staus:"solved", difficulty:"easy"};
const paramString= new URLSearchParams(obj);

console.log(paramString.toString()); //status=solved&difficulty=easy
```

### QueryString

```js
const queryString= require("querystring");

const queryString1="name=John&age=30"
const parsed=queryString.parse(queryString1);
console.log(parsed);

const obj={name:"Alice", age:25};
const queryString2=queryString.stringify(obj)
console.log(queryString2);

queryString.stringify({foo:"bar",baz:["code","for","real"]});
queryString.stringify({foo:"bar",baz:"real"},';',':');

```
QueryString is more performant than URLSearchParams but it is not standard API, but URLSearchParams is available in browsers and we use it when performance is not critical and it is more browser compatible.



#ref 
[urlsearch](https://nodejs.org/api/url.html#class-urlsearchparams)
[querystring](https://nodejs.org/api/querystring.html)


#typescript 
In typescript env we use `npm i --save-dev ts-node`.