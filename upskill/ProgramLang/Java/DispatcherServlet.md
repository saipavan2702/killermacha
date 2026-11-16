Tags: #java #springboot
Map: [[Upskill/ProgramLang/Java/Spring Boot|Spring Boot]], [[Upskill/ProgramLang/Java/Inversion of Control|Inversion of Control]]

# DispatcherServlet

**DispatcherServlet is Spring MVC's receptionist: it routes an incoming request to the right controller and coordinates the response.** This is called the **front controller** pattern.

Think of a hospital: reception finds the right doctor; the doctor does the actual treatment. Similarly, DispatcherServlet coordinates; your controller handles the request, usually calling a service for business logic.

## Where does it fit?

- **Servlet:** a Java component that handles requests. HTTP servlets commonly extend `HttpServlet`.
- **Tomcat:** the server and servlet container that receives HTTP requests and runs servlets.
- **DispatcherServlet:** Spring MVC's servlet, managed by the container.
- **Controller:** a Spring-managed class with methods such as `@GetMapping("/hello")`. It does not need to extend `HttpServlet`.

In a typical Spring Boot MVC app, Boot configures and registers DispatcherServlet automatically. You normally write controllers, without a `web.xml`.

## Example 1: return JSON

Inside a Spring Boot MVC app with JSON support, put this controller in a package scanned by Spring:

```java
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello, Macha!");
    }
}
```

Request: `GET /hello` → response body: `{"message":"Hello, Macha!"}`.

What happens behind the scenes:

1. **Tomcat** receives the request and passes it through applicable filters to **DispatcherServlet**.
2. DispatcherServlet asks **HandlerMapping** which handler matches. Here, `GET /hello` matches `hello()`.
3. A **HandlerAdapter** invokes that method.
4. The method returns a Java `Map`.
5. Spring uses an **HttpMessageConverter** to turn the map into JSON and write the response body.
6. Tomcat sends the HTTP response to the client.

`@RestController` includes `@ResponseBody` behavior: the result becomes response content, so there is no view lookup or template rendering.

## Example 2: return an HTML page

With a configured template engine such as Thymeleaf:

```java
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/home")
    public String home(Model model) {
        model.addAttribute("name", "Macha");
        return "home";
    }
}
```

Here, `"home"` is a **view name**. A **ViewResolver** finds the view; the view renders the model data into HTML. With Boot's default Thymeleaf setup, create `src/main/resources/templates/home.html` containing:

```html
<p xmlns:th="http://www.thymeleaf.org" th:text="'Hello, ' + ${name}"></p>
```

`GET /home` displays **Hello, Macha**.

> **Remember:** returning `"home"` from this `@Controller` means “render the home view.” Returning it from a `@RestController` means “send the text home.”

## Filter vs interceptor

For a normal controller request, the incoming path is:

```text
Client → Tomcat → Filter → DispatcherServlet
                              ↓
                       HandlerMapping
                              ↓
                     Interceptor.preHandle
                              ↓
                       HandlerAdapter → Controller
```

- **Filter:** wraps servlet processing; can inspect or block a request before DispatcherServlet runs.
- **Interceptor:** a Spring MVC hook that runs after a handler is selected; can inspect the chosen handler before invocation.

Both can also run logic after downstream processing.

## Three details to remember

- DispatcherServlet handles **requests mapped to it**. A filter can stop a request first, and other servlets can have their own mappings.
- One DispatcherServlet can route to many controllers. You do not need one servlet per URL, even in plain servlet applications.
- This explanation covers **Spring MVC**. Spring WebFlux uses a different request-processing stack.

## Sources

- [Spring: DispatcherServlet and registration](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet.html)
- [Spring: request processing](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-servlet/sequence.html)
- [Spring: response bodies and message converters](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/responsebody.html)
- [Spring Boot: servlet web applications](https://docs.spring.io/spring-boot/reference/web/servlet.html)
