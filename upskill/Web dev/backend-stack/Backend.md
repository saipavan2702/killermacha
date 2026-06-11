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


## Quick Peek to Docker

A way to package application with all the necessary dependencies and configurations. A Portable artifact easily shared and moved around. 

A container is it's own isolated operating system layer with linux-based images. Previously development and operations teams are used to be in different environments, but after docker there is only one environment which reduces the load of environmental configuration on server. Only env configuration needed will be docker runtime config. 

A container is a layer of images. Base image based on linux and application image on top. Docker image is where actual package(files, dependencies)  which can be moved around.

Docker container is where actually application we pulled starts and creates container environment. Container is the running environment for image.

### Docker vs VM
The primitive difference would be that docker does not have its own kernel but as for VM they can have their own kernel. Docker is built upon application layer and uses hosts kernel. 

```bash
docker run (-d,-p,--name)
docker start
docker pull
docker stop
docker ps (-a)
docker logs
docker exec -it(interactive)
```


### port binding
`docker run -p{host port}:{container port} image version`
 We sometimes see that two containers running on same port but its fine as we just have to bind them to different host ports along with some configuration.


#ref 
[urlsearch](https://nodejs.org/api/url.html#class-urlsearchparams)
[querystring](https://nodejs.org/api/querystring.html)
[arivappa-blog](https://blog.arivappa.tech/docker-commands)

#typescript 
In typescript env we use `npm i --save-dev ts-node`.