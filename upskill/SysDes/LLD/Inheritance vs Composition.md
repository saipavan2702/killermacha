> [!summary]
> Inheritance models an is-a relationship; composition assembles behavior and usually offers looser coupling and safer evolution.

Map: [[Upskill/SysDes/System Design|System Design]]
Connections: [[Upskill/SysDes/LLD/SOLID Principles|SOLID Principles]], [[Upskill/SysDes/LLD/Design Patterns/Design Patterns|Design Patterns]]

The two different strategies to tackle the same problem i.e, `CODE REUSE`

Let's look at **Inheritance**, say we have a Base class
```java
class Order {
	String orderId;
	List<Items> items;
	double total;

	void calculateTotal() {
		// sums up item price, applies tax
	}

	void generateInvoice() {
		// creates a formatted invoice
	}

	abstract void ship()
	abstract void track()
}
```

And we implemented different types of orders from the parent class.
```java
class StandardOrder extends Order {
    void ship()  { /* ground courier */ }
    void track() { /* courier API    */ }
}

class ExpressOrder extends Order {
    void ship()  { /* next-day air  */ }
    void track() { /* priority API  */ }
}

class InternationalOrder extends Order {
    void ship()  { /* book freight */ }
    void track() { /* customs API  */ }
}
```

Now comes the new requirement - Digital Order
```java
class DigitalOrder extends Order {

    void ship() { // Forced to fake it — send an email and call it "shipping" 🤥 }
    void track() { throw new Exception("Cannot track a download!"); // 🚨 code smell }
}
```

So now developers are forced to implement/add a new layer
```txt
Order
├── PhysicalOrder  ← new layer just to hold ship() and track()
│   ├── StandardOrder
│   ├── ExpressOrder
│   └── InternationalOrder
└── DigitalOrder
```
But now every class that used main base class Order.ship() is broken.

>That's the fragility of inheritance — changing the parent breaks all children.
>When you put behaviour in a parent class, you're predicting that every future child will need it.
>That prediction will eventually be wrong.

The fix is to adapt **Composition**.

Strip `Order` down to just data. Move shipping into its own separate classes.
```java
// Order is now just a plain data container — no abstract methods
class Order {
    String orderId;
    List<Item> items;
    double total;

    public void calculateTotal() { /* still here — all orders need this */ }
    public void generateInvoice() { /* still here — all orders need this */ }
    // ship() and track() are GONE from here
}

// Shipping is now a separate concern
class GroundShipper {
    public void deliver(Order order) { /* ground courier logic */ }
}

class AirShipper {
    public void deliver(Order order) { /* next-day air logic */ }
}
```

> Instead of Shipper being Order it takes a Order

Now we can add DigitalOrder without breaking anything.
```java
class DigitalDelivery {
    public void deliver(Order order) {
        // generate download link
        // send email
        // done ✅ — no faking, no exceptions
    }
}
```

 Bringing back the abstract methods we lost in Composition.

 With composition the shippers don't share a parent, so you use an interface instead.
In Inheritance
```java
List<Order> orders = new ArrayList<>();
orders.add(new StandardOrder());
orders.add(new ExpressOrder());

for (Order o : orders) {
    o.ship(); // works! every Order has ship()
}
```
but in composition this is lost as each ground shipper takes a Order param not derived from Order.
```java
// ❌ What type do you even put here?
List<???> shippers = new ArrayList<>();
shippers.add(new GroundShipper());
shippers.add(new DigitalDelivery());
```

Solution : `INTERFACE`
An interface is just a contract — it says "you must have this method", nothing more.
 ```java
// The contract — no code, just a promise
interface DeliveryMethod {
    void deliver(Order order);
}

// Each shipper signs the contract
class GroundShipper   implements DeliveryMethod { /* ... */ }
class AirShipper      implements DeliveryMethod { /* ... */ }
class DigitalDelivery implements DeliveryMethod { /* ... */ }

// Now you can treat all three the same way:
DeliveryMethod method = new GroundShipper();   // ✅
DeliveryMethod method = new DigitalDelivery(); // ✅ same type, different behaviour
 ```


### Dependency Injection

Instead of service creating delivery method we inject it from outside.

```java
class OrderService {

    // "I don't care HOW you deliver. Just give me something that can."
    public void processOrder(Order order, DeliveryMethod deliveryMethod) {
        // 1. validate order
        // 2. charge payment
        deliveryMethod.deliver(order); // 3. deliver however the caller decides
    }
}
```

We call it from outside
```java
OrderService service = new OrderService();

service.processOrder(order, new GroundShipper()); // Ground shipping
service.processOrder(order, new DigitalDelivery()); // Digital delivery — same method call, different behaviour
```

When is Composition bad?
-  We end up writing more boilerplate code.
-  verbose wrapper methods


#java #oops

---

## References

- [Why the Best Codebases Barely Use Inheritance Anymore](https://www.youtube.com/watch?v=pbsTy5V_pxA) - Inheritance vs composition intuition.
