A way to package application with all the necessary dependencies and configurations. A Portable artifact easily shared and moved around. 

A container is it's own isolated operating system layer with linux-based images. Previously development and operations teams are used to be in different environments, but after docker there is only one environment which reduces the load of environmental configuration on server. Only env configuration needed will be docker runtime config. 

A container is a layer of images. Base image based on linux and application image on top. Docker image is where actual package(files, dependencies)  which can be moved around.

Docker container is where actually application we pulled starts and creates container environment. Container is the running environment for image.

## Docker vs VM
The primitive difference would be that docker does not have its own kernel but as for VM they can have their own kernel. Docker is built upon application layer and uses hosts kernel. 

### docker commands
- #### docker run (-d,-p,--name)
- #### docker start
- #### docker pull
- #### docker stop
- #### docker ps (-a)
- #### docker logs
- #### docker exec -it(interactive)

### port binding
`docker run -p{host port}:{container port} image version`
 We sometimes see that two containers running on same port but its fine as we just have to bind them to different host ports along with some configuration.


#ref  
[arivappa-blog](https://blog.arivappa.tech/docker-commands)
