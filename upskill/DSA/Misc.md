Memory management in cpp while dealing with pointers there can be some memory leaks, so we should be careful.
For example,

```cpp
#include <iostream>

int b = 20;

int main() {
    int *p = new int;

    p = new int(10);
    return 0;
}

```

The previous memory block allocated by new int is still reserved in heap memory.
However, we lost the address of that memory because p now points elsewhere.
Since there's no way to free that memory now, it remains allocated indefinitely → Memory Leak!

Now to deal with this, 
```cpp
delete p;  // Free allocated memory
p = nullptr;  // Avoid dangling pointer issues
```

It is a good practice to assign null to the pointer after deletion. 
A dangling pointer is a pointer that refers to a memory location that has been freed. Setting p = nullptr; ensures that it doesn't point to invalid memory.


### Pass by Value

```cpp
void update(int x) { 
    x = 20; 
}

int main() {
    int c = 10;
    update(c);
    cout << c; // Still prints 10
}
```

Here we are passing c to update func, and that is a frame in stack where it stores x with diff memory address, and when we update x value changes, but c memory address and value doesn't get affected.

### Pass by Pointer

```cpp
void update(int *p) { 
	if(p==nullptr) return;
    *p = 20; 
}

int main() {
    int c = 10;
    update(&c); // address of c 
    cout << c; // Prints 20
}
```

Here we are passing address of c and we are changing the value stored in address using a pointer, so c value changes, but here another memory address for p gets allocated.
Also always check while dereferencing a pointer that it is not null.

### Pass by Reference

```cpp
void update(int &r) { 
    r = 20; 
}

int main() {
    int c = 10;
    update(c); // address of c is passed
    cout << c; // Prints 20
}
```

Here no new variable is created, r is just another alias of c and we are updating the c itself.
While doing pass by reference we have to make sure passing variable is not null.
```cpp
void update(int &r) {
	r = 20;
}

int main() {
	int *p = nullptr;
	update (*p) ; 
}
//This gives error
```




## Concurrency

Concurrency means an application is making progress on more than one task at the same time.
In a computer, the tasks are executed using Central Processing Unit (CPU).
While a single CPU can work on only one task at a time, it achieves concurrency by rapidly switching between tasks.

We use threads for this phenomenon.

```java

class Task implements Runnable {
    private String taskName;
    
    public Task(String taskName) {
        this.taskName = taskName;
    }
    
    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(taskName + " - Step " + i);
            try {
                Thread.sleep(500); // Simulate I/O or computation
            } catch (InterruptedException e) {
                System.out.println(taskName + " interrupted.");
                Thread.currentThread().interrupt(); // Restore interrupted status
                break;
            }
        }
    }
}

public class ConcurrencyExample {
    public static void main(String[] args) {
        Thread task1 = new Thread(new Task("Task A"));
        Thread task2 = new Thread(new Task("Task B"));
        Thread task3 = new Thread(new Task("Task C"));
        
        task1.start();
        task2.start();
        task3.start();
        
        System.out.println("All tasks completed.");
    }
}

/*
Expected Output (Interleaved Execution):
Task A - Step 1
Task B - Step 1
Task C - Step 1
Task A - Step 2
Task B - Step 2
Task C - Step 2
Task A - Step 3
Task B - Step 3
Task C - Step 3
Task A - Step 4
Task B - Step 4
Task C - Step 4
Task A - Step 5
Task B - Step 5
Task C - Step 5
All tasks completed.

Note: The actual output order may vary between runs due to 
thread scheduling and the concurrent nature of execution.
*/

```

## Parallelism

Parallelism means multiple tasks are executed simultaneously.
To achieve parallelism, an application divides its tasks into smaller, independent subtasks. These subtasks are distributed across multiple CPUs, CPU cores, GPU cores, or similar processing units, allowing them to be processed in parallel.

To achieve true parallelism, your application must:
- Utilise more than one thread.
- Ensure each thread is assigned to a separate CPU core or processing unit.


```java
import java.util.concurrent.RecursiveTask;
import java.util.concurrent.ForkJoinPool;

public class ParallelSumExample {
    
    static class ParallelSum extends RecursiveTask<Integer> {
        private int[] numbers;
        private int start, end;
        private static final int THRESHOLD = 10; // Split threshold for divide-and-conquer
        
        ParallelSum(int[] numbers, int start, int end) {
            this.numbers = numbers;
            this.start = start;
            this.end = end;
        }
        
        @Override
        protected Integer compute() {
            // Base case: if segment is small enough, compute directly
            if (end - start <= THRESHOLD) {
                int sum = 0;
                for (int i = start; i < end; i++) {
                    sum += numbers[i];
                }
                System.out.println("Direct computation: range [" + start + ", " + end + ") = " + sum);
                return sum;
            } else {
                // Recursive case: divide the task into two subtasks
                int mid = (start + end) / 2;
                
                ParallelSum leftTask = new ParallelSum(numbers, start, mid);
                ParallelSum rightTask = new ParallelSum(numbers, mid, end);
                
                // Fork the left task to run in parallel
                leftTask.fork(); // Execute left task asynchronously
                
                // Compute right task in current thread and wait for left task result
                int rightResult = rightTask.compute(); // Synchronous execution
                int leftResult = leftTask.join();      // Wait for left task to complete
                
                int totalSum = leftResult + rightResult;
                System.out.println("Combined: [" + start + ", " + mid + ") + [" + mid + ", " + end + ") = " + totalSum);
                
                return totalSum;
            }
        }
    }
    
    public static void main(String[] args) {
        // Create array with numbers 1 to 100
        int[] numbers = java.util.stream.IntStream.rangeClosed(1, 100).toArray();
        
        // Create ForkJoinPool (uses available processor cores by default)
        ForkJoinPool pool = new ForkJoinPool();
        
        System.out.println("Computing sum of numbers 1-100 using ForkJoinPool...");
        System.out.println("Available processors: " + Runtime.getRuntime().availableProcessors());
        System.out.println("Pool parallelism: " + pool.getParallelism());
        System.out.println();
        
        // Start the parallel computation
        long startTime = System.nanoTime();
        int result = pool.invoke(new ParallelSum(numbers, 0, numbers.length));
        long endTime = System.nanoTime();
        
        System.out.println();
        System.out.println("Final Sum: " + result); // Expected: 5050 (sum of 1+2+...+100)
        System.out.println("Execution time: " + (endTime - startTime) / 1_000_000.0 + " ms");
        
        // Compare with sequential computation
        startTime = System.nanoTime();
        int sequentialSum = 0;
        for (int i = 1; i <= 100; i++) {
            sequentialSum += i;
        }
        endTime = System.nanoTime();
        
        System.out.println("Sequential sum: " + sequentialSum);
        System.out.println("Sequential time: " + (endTime - startTime) / 1_000_000.0 + " ms");
        
        // Shutdown the pool
        pool.shutdown();
    }
}

/*
HOW FORKJOINPOOL WORKS - DIVIDE AND CONQUER:

1. TASK SPLITTING:
   - Array is recursively divided into smaller segments
   - Division continues until segment size ≤ THRESHOLD (10 elements)
   - Creates a binary tree of subtasks

2. PARALLEL EXECUTION:
   - fork(): Submits left subtask to thread pool for async execution
   - compute(): Executes right subtask in current thread
   - join(): Waits for left subtask to complete and gets result

3. RESULT COMBINATION:
   - Results bubble up from leaf nodes to root
   - Each parent combines results from its two children
   - Final result is the sum of entire array

4. WORK-STEALING:
   - Idle threads can "steal" work from busy threads' queues
   - Improves load balancing and CPU utilization
   - Especially effective for recursive divide-and-conquer algorithms

EXAMPLE EXECUTION TREE (simplified):
                    [0, 100)
                   /        \
              [0, 50)      [50, 100)
             /      \      /        \
        [0, 25)  [25, 50) [50, 75) [75, 100)
           |        |        |        |
         ...      ...      ...      ...

BENEFITS:
- Utilizes multiple CPU cores effectively
- Automatic load balancing via work-stealing
- Scales with available hardware
- Clean divide-and-conquer pattern
*/
```


## Fetch WaterFall issue

Think of we have a web page the user About section and Friends section need to fetch data separately on `/users/<id> and /users/<id>/friends`, If we fetch data in each component itself, it will cause the request waterfall issue.

To solve this basic solution is to make a call for both of them in a Profile section and pass the results.
```jsx
const Profile = ({ id }: { id: string }) => {
  const [user, setUser] = useState<User | undefined>();
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
        const [user, friends] = await Promise.all([
          get<User>(`/users/${id}`),
          get<User[]>(`/users/${id}/friends`),
        ]);
        setUser(user);
        setFriends(friends);
    };
    fetchUserAndFriends();
  }, [id]);

  return (
    <>
      {user && <About user={user} />}
      <Friends users={friends} />
    </>
  );
};

// still depends on the slowest request to return, but faster than before.
```

Also we can use React lazy and suspense to render the components only when needed

```tsx
const UserDetailCard = React.lazy(() => import("./user-detail-card.tsx"));

export const Friend = ({ user }: { user: User }) => {
  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <button>
          <Brief user={user} />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <Suspense fallback={<div>Loading...</div>}>
          <UserDetailCard id={user.id} />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
};
```

Now we can also use preload data before user interaction, as in above example the data is fetched when Trigger button is pressed or some user interaction. But we can fetch it beforehand.

```tsx
import { preload } from "swr";

const UserDetailCard = React.lazy(() => import("./user-detail-card.tsx"));
const Friend = ({ user }: { user: User }) => {

  const handleMouseEnter = () => {
    preload(`/user/${user.id}/details`, () => getUserDetail(user.id));
  };

  return (
    <NextUIProvider>
      <Popover placement="bottom" showArrow offset={10}>
        <PopoverTrigger>
          <button
            onMouseEnter={handleMouseEnter}
          >
            <Brief user={user} />
          </button>
        </PopoverTrigger>
        <PopoverContent>
          {/* UserDetailCard */}
        </PopoverContent>
      </Popover>
    </NextUIProvider>
  );
};
```

Now let's move to SSG(static site generation) for websites that doesn't change much.

```tsx
async function getQuotes(): Promise<QuoteType[]> {
  const res = await fetch(
    "https://api.quotable.io/quotes/random?tags=happiness,famous-quotes&limit=3"
  );

  return res.json();
}

export default async function Home() {
  const quotes = await getQuotes();
  return (
    <Quote initQuotes={quotes} />
  );
}
```

Now final one, React Server Component this allows rendering components on the server and streaming them to clients.

```tsx
import { Suspense } from "react";

async function UserInfo({ id }: { id: string }) {
  const user = await getUser(id);

  return (
    <>
      <About user={user} />
      <Suspense fallback={<FeedsSkeleton />}>
        <Feeds category={user.interests[0]} />
      </Suspense>
    </>
  );
}

async function Friends({ id }: { id: string }) {
  const friends = await getFriends(id);

  return (
    <div>
      <h2>Friends</h2>
      <div>
        {friends.map((user) => (
          <Friend user={user} key={user.id} />
        ))}
      </div>
    </div>
  );
}

export async function Profile({ id }: { id: string }) {
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <div>
          <Suspense fallback={<UserInfoSkeleton />}>
            <UserInfo id={id} />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<FriendsSkeleton />}>
            <Friends id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
```

In a scenario where Profile, UserInfo, and Friends are React Server Components.
Server-Side Execution: These components would execute on the server. This means the server handles fetching the user information and friends' data, rather than offloading these tasks to the client's browser.


## Xor Linked List

In classical doubly linked list we store two addresses one for prev node and one for next node, but in xor linked list we store only one address which is xor of two addresses

```c
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>

typedef struct {
    int value;
    uintptr_t xored;
} Node;

Node *node_create(int value)
{
    Node *node = malloc(sizeof(*node));
    memset(node, 0, sizeof(*node));
    node->value = value;
    return node;
}

typedef struct {
    Node *begin;
    Node *end;
} Linked_List;

void ll_append(Linked_List *ll, int value)
{
    if (ll->end == NULL) {
        assert(ll->begin == NULL);
        ll->end = node_create(value);
        ll->begin = ll->end;
    } else {
        Node *node = node_create(value);
        node->xored     = (uintptr_t)ll->end;
        ll->end->xored ^= (uintptr_t)node;
        ll->end         = node;
    }
}

Node *node_next(Node *node, uintptr_t *prev)
{
    Node *next = (Node*)(node->xored^(*prev));
    *prev = (uintptr_t)node;
    return next;
}

int main()
{
    Linked_List xs = {0};
    for (int x = 5; x <= 10; ++x) {
        ll_append(&xs, x);
    }
    uintptr_t prev = 0;
    for(Node *iter = xs.end; iter; iter = node_next(iter, &prev)) {
        printf("%d\n", iter->value);
    }
    return 0;
}
```

## Cache utilisation in loops

 ✅ Best (IKJ order @ ~110-200ms):
```cpp

for (int i = 0; i < rows; i++) {
    for (int k = 0; k < inner; k++) {
        for (int j = 0; j < cols; j++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
```

⚠️ Standard (IJK order @ ~1700ms):
```cpp
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        for (int k = 0; k < inner; k++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
```

❌ Worst (JKI order @ 5000ms+):
```cpp
cfor (int j = 0; j < cols; j++) {
    for (int k = 0; k < inner; k++) {
        for (int i = 0; i < rows; i++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
Same math, 50x performance difference just from loop order!
```

For `C = A × B`, you have three nested loops with indices `i, j, k`:

The core operation:
`C[i][j] += A[i][k] * B[k][j]`

Why IKJ is fastest:
```cpp
for (i...) 
    for (k...)
        for (j...)  // ← INNERMOST
            C[i][j] += A[i][k] * B[k][j]
            //  ↑ j increments → sequential in both C and B!

C[i][j]: j increments → sequential access ✅
B[k][j]: j increments → sequential access ✅
A[i][k]: k is constant in inner loop → same value reused ✅
```

Why JKI is worst:
```cpp
cppfor (j...)
    for (k...)
        for (i...)  // ← INNERMOST
            C[i][j] += A[i][k] * B[k][j]
            //  ↑ i increments → JUMPS by rows in both C and A!

C[i][j]: i increments → jumps by entire row ❌
A[i][k]: i increments → jumps by entire row ❌
All three arrays accessed poorly!
```