
**Process states in OS**
 
New state-\>Ready(Queue)-\>Running(CPU)-\>Terminate(Deallocate)  
The above is normal condition.  
But if we give a high priority task the CPU sends the current task back to the Ready queue while it executes the high priority case. The state diagram follows as  
New -\>Ready-\>Running-\>Terminate  
Priority
 
**Pre-emptive**  
If there occurs a priority type state then it falls under this scheduling.  
**Non pre-emptive**  
If there is no priority case dispatching it comes under this category.
 
I/O request-access file, hardware, or monitor access.  
Now if a I/O request is passed in the middle of scheduling(above discussed),CPU passes the request to wait(queue) in RAM in other words, it is suspended or unenrolled. This is sent in auxiliary storage(wait/block)queue and it is sent to ready queue. This process is called swapping.
   

Degree of multi-programming-no.of process in memory;  
**Long-term scheduling(Job scheduler)**  
It brings all the process into Ready queue from job scheduler. It has main control over multi-programming.
 
**Short-term scheduling(Dispatch/CPU scheduler)**  
It ensures the system performance is run according to chosen set of criteria(like priority/assigned time quantum).  
It is faster than Long term scheduling. It decreases the degree of multi-programming.
 
**Medium-term scheduling(Swapping scheduler)**  
It decreases the degree of multi-programming and speed is higher than job scheduling. Slower than short term scheduling. It is part of time sharing system. It uses auxiliary memory to carry out I/O requests.
 
**Linux commands**  
There are 3 types of ways a programme can be stored/given permission.  
Read, write, and execute.[r-4, w-2, x-1];  
There are 3 types of persons who can read, write and execute.  
User, group, others.[u, g, o];  
Chmod is used to change permissions to a directory.
   

**System Calls**  
(i)File related  
(ii)Device related  
(iii)Information related  
(iv)Process control(fork system call)*  
(v)Communication
 
**Fork() System call**  
Upon calling this function once a new child call is created with its parent being alive.  
This holds same for any number of calls.  
For 2 calls  
P-\> P, C1  
C2,P C3,C1
 
Que on fork() system call  
```c
#include\<stdio.h\>  
#include\<unistd.h\>  
int main()  
{  
if(fork() and fork())  
fork();  
printf("Hello");  
return 0;  
}
```
Now we consider child as 0 and parent as +ve.  
In the above Hello is printed 4 times becoz,  
P-\> P, C1  
P, C2  
C3, P
 
At first, in if statement fork call is processed and gives P,C1. They are processed in parallel, as C1 has value 0 it's and has also 0 it gives wrong and prints hello. Next, for P it has positive so it goes for another fork() in the same if statement which generates P and C2 where with P and P it gives C3 and P and for C2 is 0 and it terminates by printing "Hello".
   

**User mode vs. Kernel Mode**  
In user mode we can give request in form of system call which in turn goes into kernel mode. The thing is first we use some API(Application programming interface) and gives some user process to execute which makes a system call. Up until now the process is in user mode now, it goes to kernel mode and access the hardware component(reading a file in hard disk). It returns to user mode from executing system call.
 
**Process vs. Threads**  
Processes are dispatched from ready state and scheduled for execution in CPU. It involves system call. It creates a child process which is exact copy of first means it is not interlinked. They may have same data, stack, and code but they work separately. They do not have need to share data as both have same code and attributes. Context switching is slower to threads. Here old data is stored in PCB(process control block).
 
But as for threads, they are created by sharing same code and data but they have different stack and registers. It does not include a system call. All user level threads are treated same by OS. No role of OS as no system call is involved. Switching of context is faster. Blocking a thread will block entire process as they are dependent.  
 - How can you find the size of the file using lseek() system call?
- off_t size = lseek(fd, 0, SEEK_END); 
**User level & Kernel level**  
User level threads are managed by user level library. These are typically fast. Context switching is faster too. If a user level thread is blocked then entire process gets blocked.
 
But for kernel level they are managed by operating system and accessed via system call. Context switching is slower compared to user level.