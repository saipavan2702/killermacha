> [!summary]
> Depending on interfaces instead of concrete implementations makes Java code easier to replace, test, and extend.

Map: [[Upskill/ProgramLang/Java/Java|Java]]
Connections: [[Upskill/ProgramLang/Java/Inversion of Control|Inversion of Control]]

## Tight Coupling vs Loose Coupling

```java
package com.tight.coupling;

// 1. Database Class
class UserDatabase {
    public String getUserDetails() {
        return "User details from database";
    }
}

// 2. Manager Class (Tightly Coupled)
class UserManager {
    // The dependency is hardcoded directly inside the class
    private UserDatabase userDatabase = new UserDatabase();

    public String getUserInfo() {
        return userDatabase.getUserDetails();
    }
}

// 3. Main Example Class
public class TightCouplingExample {
    public static void main(String[] args) {
        UserManager userManager = new UserManager();
        System.out.println(userManager.getUserInfo());
    }
}
```

Now for loose coupling:
```java
package com.loose.coupling;

// 1. The Interface (Contract)
public interface UserDataProvider {
    String getUserDetails();
}

// 2. Implementation A: Original Database
public class UserDatabaseProvider implements UserDataProvider {
    @Override
    public String getUserDetails() {
        return "User details from database";
    }
}

// 3. Implementation B: Web Service
public class WebServiceDataProvider implements UserDataProvider {
    @Override
    public String getUserDetails() {
        return "Fetching data from web service";
    }
}

// 4. Implementation C: New Database (e.g., MongoDB)
public class NewDatabaseProvider implements UserDataProvider {
    @Override
    public String getUserDetails() {
        return "New database in action";
    }
}

// 5. Manager Class (Loosely Coupled)
public class UserManager {
    // Depends on the interface, not a specific class
    private UserDataProvider userDataProvider;

    // Constructor Injection
    public UserManager(UserDataProvider userDataProvider) {
        this.userDataProvider = userDataProvider;
    }

    public String getUserInfo() {
        return userDataProvider.getUserDetails();
    }
}

// 6. Main Example Class
public class LooseCouplingExample {
    public static void main(String[] args) {
        // Example 1: Using the original database
        UserDataProvider databaseProvider = new UserDatabaseProvider();
        UserManager userManagerWithDB = new UserManager(databaseProvider);
        System.out.println(userManagerWithDB.getUserInfo());

        // Example 2: Easily switching to a Web Service
        UserDataProvider webServiceProvider = new WebServiceDataProvider();
        UserManager userManagerWithWS = new UserManager(webServiceProvider);
        System.out.println(userManagerWithWS.getUserInfo());

        // Example 3: Easily switching to a New Database
        UserDataProvider newDatabaseProvider = new NewDatabaseProvider();
        UserManager userManagerWithNewDB = new UserManager(newDatabaseProvider);
        System.out.println(userManagerWithNewDB.getUserInfo());
    }
}
```
