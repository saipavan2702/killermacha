Tags: #webdev #interview
Map: [[Upskill/WebDev/Frontend/Frontend Architecture|Frontend Architecture]], [[Upskill/Mock Interviews|Mock Interviews]]

What is react?
It is an Open-Source JavaScript library used for building user interfaces. It was developed by facebook and maintained by facebook.
It gives us flexibilty to create re-usable UI components. 
It uses Virtual DOM to efficently update and render UI components.
Instead of directly manipulating the actual DOM, React creates a lightweight virtual representation of it. 

When there are changes to the data or state of a component, React compares the virtual DOM with the actual DOM, 
identifies the differences (known as the "diffing" process), and then updates only the necessary parts of the actual DOM.

One of the key advantages of React is its strong community support, which provides a wealth of third-party libraries, components, 
and tutorials to help developers build powerful and interactive web applications with ease.

What is Rendering?
Rendereing is handled by packages like React DOM. Reconcilation process is implemented by this. They generate tree of elements.

What is Diffing algorithm?
If react observes two elements with different types. React will rebuild the tree from scratch. All compenent instances in old tree gets destroyed,
along with current state. These components gets unmount.

Node.js event loop architecture?
Threads run in processes; one process can have many threads in it, and as they are in same process, they share a memory.
In reality, Node.js has a V8 in it, and the code runs in the main thread where event-loop runs ( that’s why we say that it is single-threaded).
But As we know, the Node.js is not just V8. There are many APIs (C++), and all this stuff is managed by Event Loop, implemented via libuv (C++).
Node.js is single threaded, but it can run multi-threaded processes when asked.
This is because although the callback will be immediately sent to the event queue, 
the event loop won’t send it to the call stack unless the call stack is empty i.e. until the provided input script comes to an end.

what is asynchronous javscript?
AJAX requests are performed asynchronously, meaning the browser can continue executing other tasks while waiting for the server's response. 
This allows for a non-blocking user experience.

what is MongoDB/NoSQL? or diff between SQL and NoSQL?
SQL databases are relational that store data in tables with pre-defined schemas. Each row represents record and column represents attribute of
record. The relationships are defined through foreign keys.
Any changes to the schema often require altering the entire database and may lead to downtime during the process.
Traditional SQL databases are generally vertically scalable, meaning that they can handle increased loads by upgrading the hardware (e.g., adding more memory, CPU, or storage). 
However, there are limits to vertical scaling, and it can be expensive.

NoSQL databases are relational that store data in typically more-flexible and schema less format, allowing for dynamic changes to the data structure.
This flexibility is particularly useful when dealing with rapidly changing data or applications with evolving requirements.

what is redux?
It is a predictable state maangement library for JavaScript applications. It is used to avoid prop-drilling, which means passing props down the 
tree even to the components where they are unused. This makes debugging easier and more efficient. Explain the eaxmple of tree.
First we create store, then we create reducers and last we determine the actions performed by reducers. 

What is a database?
Database is a collection of data which is stored electronically and can be accessed from local computer or remote computer.

What is DBMS?
It is a software that enables users to interact with the database, providing an interface to store, retrieve, update and manage data efficently.
It allows user to define structure of database including data types, constraints it should follow.

what is an attribute?
It is a characteristic or property which can be used to define or describe the specific aspect of entity.

What is atomicity?
Atomicity treats transaction as single indivisible unit of work.It ensures no transaction occures partially.
Ex: Bank Transaction.

what is consistency?
It ensures integrity constraints are maintained. It also ensures databse remains consistent before and after transaction.
Ex: If we try to add employee to non existing department transaction will be rejected.

what is isolation?
It ensures that no two concurrent transactions interferer with each other.
Ex: If 2 users trying to update the same data the transactions are isolated to maintain data integrity.

what is Durability?
It ensures that when transaction is completed and stored permanently, the data is made sure never lost in case of system crash etc.
Ex:Updated password.

What is serial scheduling and parallel scheduling?
->serial
    - Transactions execute serially one after another
    - It is consistent, recoverable, cascades, and strict always..
->parallel
    - Multiple Transactions execute concurrently
    - Which means operations are interleaved.
    - Not always consistent, recoverable, cascades, and strict.

what is dirty read?
If a transaction T1 does some op then later T2 reads and writes based on the data operated by T1, but T1 rolls back and ops done by T2 are invalid.

What is unrepeatable read?
Say T1 transaction reads data as T2 does some op and value is changed, but T1 checks on same data and changed while no op is performed by T1.

what is phantom read?
Say T1 reads something and T2 reads it too, now T1 deletes it and T2 tries to read it but which is deleted, means reading something not existing.

Cascading decreases CPU utilisation(when rolled back).


->DDL
    -create,alter,drop,truncate
->DCL
    -grant,revoke
->DML
    -Insert,update,delete,select
->TCL
    -commit, rollback, savepoint

What is serialisability?
If n parallel transactions can be done in m series transactions then it is deemed to be serialisability.
conflcit serialisability- Build a precendence graph and check if it has cycle or not? if it has cycle then not serialisable: else serialisabl & consistent.
sorting graph in topological order gives us conflict serialisability.

What is indexing?
It improves database performance by minimising no.of disc visits required to fulfill a query. It is used to locate and quickly access data.
In primary index is ordered on a key-filed as database has unique occurence of the key.
In clustered index file is ordered on a non-key field as database has multiple occurences of non-key field.

What is a checkpoint?
The primary purpose of a checkpoint is to establish a known consistent state of the database on disk.If a system failure occurs (e.g., power outage or hardware failure), 
the database can use the information from the latest checkpoint to recover the database quickly without having to replay all transactions from the beginning.

Delete<Drop<Truncate(fast)


what is repeater?
Its job is to regenrate signal over same network before it becomes too weak. It does not amplify the signal, it regenerates it bit by bit.
Operates @physical layer. No collison domain affetcs or broadcast domain affects. No intelligence.

What is Hub?
It is multi-port repeater.over same network.

What is bridge?
Operates @data link layer. A bridge is a repeatator with func. of filtering content by reading MAC-Addresses of src and dest. Collison domain reduced.
No affect on broadcast domain. Over same network.

What is Router?
It has many func like connecting devices over different network services. Operates @network layer. Limits broadcast msgs to control network traffic.

Gateway-In the context of computer networks, a gateway is a device or a network node that serves as an entry or exit point between two different networks. 

Ports
Port 80: HTTP (Hypertext Transfer Protocol)
Port 443: HTTPS (Hypertext Transfer Protocol Secure)
Port 53: DNS (Domain Name System)
Port 25: SMTP (Simple Mail Transfer Protocol)
Port 110: Post Office Protocol (POP)
Port 143: Internet Message Access Protocol (IMAP)


0-1023(reserved)
1024-49151(registered)
else usable

OSI Model(Open Systems Interconnection)
Application- Interacts directly with the user.(HTTP,SMTP)
Presentation- It does Translation, encryption and decryption.
Session- Authentication and authorization and Checkpoints session management.
Transport- Segmentation, flow access(mobile internet speed config) and checksum is calculated here.Multiplexing and demultiplexing.(heart)
           TCP/UDP protocol.
Network- Data transmitted in form of packets. adaptive routing, classful IP addresses, routing of data packets.
DataLink- Deals with MAC addresses, logical addressing, data in frames.12 digit alphanumeric string.
Physical- Wiring..


DHCP- Within a LAN network IP addresses are allocated locally by  router using this protocol. NAT is used here. 
100-info
200-success
300-redirecting
400-client error
500-server error

VPN stands for Virtual Private Network. It is a technology that allows for secure and private communication over a public network such as the internet.
A VPN creates a secure, encrypted tunnel between a user's device and a remote server, enabling users to access resources, services, 
or websites as if they were directly connected to a private network.

url hit Enter -> translates to IP address -> DNS cache on browser -> DNS lookup on ISP -> using UDP -> and server send response via TCP
UDP is stateless.

Address resolution protocol(ARP)- maps IP address to MAC address

Private IP address
10.0.0.0/8 -> 10.255.255.255
172.16.0.0/12 -> 172.31.255.255
192.168.0.0/16 -> 192.168.255.255

Loopback address
127.0.0.0 -> 127.255.255.255


Encapsulation
->It is defined as wrapping up of data and func in a single unit, it means binding data and providing control over accessibility and 
prevents ext. code from direclty modifying internal data.
->In this data cannot be accessed directly. We use restrictive methods to make it visible according to attribute we desire. Data hiding is
achieved.

Abstraction
->Abstraction is the process of simplifying complex systems by presenting only the essential features while hiding unnecessary details.
->It allows developers to focus on what an object does rather than how it does it.

Inheritance
->Inheritance is the process in which allowing a derived class to access the data from its parents class. 
->The subclass can extend the functionality of the superclass by adding new attributes or methods or overriding existing ones.

Polymorphism
->Polymorphism allows objects of different classes to be treated as instances of a common superclass through a unified interface. 
->It allows a single function or method to operate on objects of different types. 
->Op overloading *,.,?:,sizeof,:: cant be overloaded.

this pointer
1. It can be used to pass the current object as a parameter to another method 
2. It can be used to refer to the current class instance variable. 
3. It can be used to declare indexers. 

virtual keyword
-> By using the "virtual" keyword, you enable dynamic method dispatch, 
where the appropriate method implementation is determined at runtime based on the actual type of the object being referred to. 
-> The overridden method in the derived class should have the same name, return type, and parameters as the virtual method in the base class.

