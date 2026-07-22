Map: [[Upskill/ProgramLang/Java/Java|Java]]
Connections: [[Upskill/ProgramLang/Java/Spring Boot|Spring Boot]]

In Java we can achieve concurrency by using threads and there are different ways to have concurrency.

For example.
```java
import java.util.concurrent.*;

public class Main {

    public static void main(String[] args) throws InterruptedException {
        System.out.println("========== DEMO 1: CountDownLatch ==========");
        countDownLatchDemo();

        Thread.sleep(1000);
        System.out.println("\n========== DEMO 2: CyclicBarrier ==========");
        cyclicBarrierDemo();
    }

    // ---------- DEMO 1: CountDownLatch ----------
    // Gate is opened by an OUTSIDE decision (main), not by the workers themselves.
    // Threads arriving late don't wait at all — the gate is already open.
    static void countDownLatchDemo() throws InterruptedException {
        int threads = 5;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CountDownLatch startGate = new CountDownLatch(1);
        CountDownLatch doneLatch = new CountDownLatch(threads);

        for (int i = 1; i <= threads; i++) {
            int id = i;
            executor.submit(() -> {
                try {
                    Thread.sleep(id * 300L); // staggered arrival
                    System.out.println("Thread " + id + " arrived at t=" + (id * 300) + "ms, checking gate...");
                    startGate.await();
                    System.out.println("Thread " + id + " passed the gate, working...");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        Thread.sleep(700); // main decides, independently, when to open the gate
        System.out.println(">>> Main is opening the gate NOW (t=700ms) — doesn't care who has arrived <<<");
        startGate.countDown();

        doneLatch.await();
        executor.shutdown();
        System.out.println("All threads done (CountDownLatch demo)");
    }

    // ---------- DEMO 2: CyclicBarrier ----------
    // No external decision-maker. The LAST thread to arrive is what opens the gate.
    // Fast threads (1, 2) are forced to sit and wait for the slowest (5).
    static void cyclicBarrierDemo() throws InterruptedException {
        int threads = 5;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        CyclicBarrier barrier = new CyclicBarrier(threads, () ->
                System.out.println(">>> Last thread arrived — barrier releases everyone at once <<<"));
        CountDownLatch doneLatch = new CountDownLatch(threads);

        for (int i = 1; i <= threads; i++) {
            int id = i;
            executor.submit(() -> {
                try {
                    Thread.sleep(id * 300L); // staggered arrival
                    System.out.println("Thread " + id + " arrived at t=" + (id * 300) + "ms, waiting at barrier...");
                    barrier.await(); // fast threads block here until the slowest one shows up
                    System.out.println("Thread " + id + " passed the barrier, working...");
                } catch (Exception e) {
                    Thread.currentThread().interrupt();
                } finally {
                    doneLatch.countDown();
                }
            });
        }

        doneLatch.await();
        executor.shutdown();
        System.out.println("All threads done (CyclicBarrier demo)");
    }
}
```
Here we can see two examples where one type waits fro all threads to arrive and starts the process, while the others moves on with whatever process it has active that is waiting for concurrency. But the catch is here at the end all things needed to wait/gets synchronised.
- Workers wait on `startGate.await()` — they pause until something else (main) says go. That's a wait.
- Main waits on `doneLatch.await()` — it pauses until all 5 workers finish. That's also a wait.

So we can go for another type of scenario where nothing waits for another.
```java
import java.util.concurrent.*;
import java.util.List;
import java.util.stream.*;

public class IndependentPipelineDemo {

    // Simulates a thread pool for DB calls (I/O bound — can be larger)
    static ExecutorService dbPool = Executors.newFixedThreadPool(5);

    // Simulates a separate pool for parsing (CPU bound — usually sized to cores)
    static ExecutorService parsePool = Executors.newFixedThreadPool(3);

    public static void main(String[] args) throws Exception {
        int numRequests = 6;

        List<CompletableFuture<String>> pipelines = IntStream.rangeClosed(1, numRequests)
                .mapToObj(id -> handleRequest(id))
                .collect(Collectors.toList());

        // We only wait here because main() needs to exit cleanly.
        // Each pipeline above already ran independently — none waited for another.
        CompletableFuture.allOf(pipelines.toArray(new CompletableFuture[0])).join();

        dbPool.shutdown();
        parsePool.shutdown();
        System.out.println("\nAll requests fully processed.");
    }

    static CompletableFuture<String> handleRequest(int requestId) {
        return CompletableFuture
                .supplyAsync(() -> fetchFromDb(requestId), dbPool)   // step 1: DB read
                .thenApplyAsync(rawData -> parse(requestId, rawData), parsePool); // step 2: parse
    }

    // ---- STEP 1: simulate a DB read with variable latency ----
    static String fetchFromDb(int requestId) {
        int latencyMs = ThreadLocalRandom.current().nextInt(100, 2000); // unpredictable, like real DB
        try {
            Thread.sleep(latencyMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("[DB] request " + requestId + " got response after " + latencyMs + "ms"
                + " on " + Thread.currentThread().getName());
        return "raw_data_for_" + requestId;
    }

    // ---- STEP 2: simulate parsing that response ----
    static String parse(int requestId, String rawData) {
        try {
            Thread.sleep(150); // pretend parse work
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        String parsed = "parsed(" + rawData + ")";
        System.out.println("  [PARSE] request " + requestId + " parsed on "
                + Thread.currentThread().getName());
        return parsed;
    }
}
```


#concurrency #java
