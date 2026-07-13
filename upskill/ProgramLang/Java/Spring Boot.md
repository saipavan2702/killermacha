# Spring Boot

## Bean vs Component

`@Bean` is a method level annotation used by springboot  to add it to it's context registry. 
Objects that are managed by framework are called `Beans`.
We generally use it under `@Configuration` annotation.

```java
@Configuration
public class AppConfig {
	@Bean
	private CarService carService() {
		return new CarService();
	}
}
```

Generally when spring starts up it will look for  annotations like `@Component`, `@Service`, `@Repository`, and `@Controller`. 
These are all special annotations of `@Component` and spring creates  an instance for each of them.

But `@Bean` it's different. It doesn't  rely on scanning. It is created inside a configured class and when we run it, spring will create and register the bean.
So here we take control instead of giving it to spring.

We use `@Bean` mainly when we are using third party registry/library that we didn't write or can't annotate with `@Component`. In this case `@Bean` gives full control over method and configuration.

For example, If we are using Jackson library for a `ObjectMapper`, then we can use this to register it manually since we can't write  to the library class.

```java
@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        return mapper;
    }
}
```

Both `@Component` and `@Bean` result in Spring-managed beans, so their lifecycle is controlled by the Spring container. This includes things like singleton vs prototype scope, lazy initialization, and dependency injection.

However, because `@Bean` lets you write logic during bean creation, you can perform custom setup inside the method, which is not possible with `@Component `unless you use lifecycle annotations like `@PostConstruct`.

Also 


#java #springboot 
