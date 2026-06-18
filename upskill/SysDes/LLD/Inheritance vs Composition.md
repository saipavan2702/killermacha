The two different strategies to tackle the same problem i.e, `CODE REUSE`

Let's say we have a Base class
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

