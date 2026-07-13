# Java Collections and Generics Examples

> [!summary]
> A practical reference for modern Java collections, queues, maps, generics, bounds, and common operations.

```java
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

public class ModernJava21Collections {
    public static void main(String[] args) {
        
        // ========================================
        // 1. ARRAYS (Classic but still used)
        // ========================================
        int[] nums = new int[5];
        String[] names = {"Alice", "Bob"};
        int[][] matrix = new int[3][3];
        
        // ========================================
        // 2. ARRAYLIST (Modern, preferred)
        // ========================================
        List<String> list = new ArrayList<>();
        list.add("apple");
        list.add("banana");
        list.addAll(List.of("cherry", "date"));
        
        // ========================================
        // 3. LINKEDLIST (Use when frequent insertions/deletions)
        // ========================================
        List<Integer> linkedList = new LinkedList<>();
        linkedList.add(10);
        linkedList.add(20);
        
        // ========================================
        // 4. IMMUTABLE COLLECTIONS (Java 9+, preferred)
        // ========================================
        List<String> immutableList = List.of("a", "b", "c");
        Set<String> immutableSet = Set.of("x", "y", "z");
        Map<String, Integer> immutableMap = Map.of("one", 1, "two", 2);
        
        // For more than 10 entries
        List<Integer> largeImmutableList = List.copyOf(List.of(1, 2, 3, 4, 5));
        
        // ========================================
        // 5. HASHSET (Modern, fast lookups)
        // ========================================
        Set<String> set = new HashSet<>();
        set.add("a");
        set.add("b");
        set.contains("a");
        
        // ========================================
        // 6. LINKEDHASHSET (Maintains insertion order)
        // ========================================
        Set<String> linkedSet = new LinkedHashSet<>();
        linkedSet.add("x");
        linkedSet.add("y");
        
        // ========================================
        // 7. TREESET (Sorted, implements NavigableSet)
        // ========================================
        NavigableSet<Integer> treeSet = new TreeSet<>();
        treeSet.add(3);
        treeSet.add(1);
        treeSet.add(2);
        treeSet.first();
        treeSet.last();
        treeSet.higher(2);  // element > 2
        treeSet.lower(2);   // element < 2
        
        // ========================================
        // 8. ENUMSET (Best for enum types)
        // ========================================
        enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }
        EnumSet<Day> weekdays = EnumSet.range(Day.MON, Day.FRI);
        EnumSet<Day> weekend = EnumSet.of(Day.SAT, Day.SUN);
        
        // ========================================
        // 9. HASHMAP (Modern, fast key-value)
        // ========================================
        Map<String, Integer> map = new HashMap<>();
        map.put("ram", 25);
        map.put("sam", 30);
        map.putIfAbsent("ram", 35);  // only if key doesn't exist
        map.getOrDefault("xyz", 0);   // return default if not found
        map.computeIfAbsent("key", k -> 100);
        map.merge("ram", 5, Integer::sum);  // merge values
        
        // ========================================
        // 10. LINKEDHASHMAP (Insertion order preserved)
        // ========================================
        Map<Integer, String> linkedMap = new LinkedHashMap<>();
        linkedMap.put(1, "one");
        linkedMap.put(2, "two");
        
        // ========================================
        // 11. TREEMAP (Sorted by key, NavigableMap)
        // ========================================
        NavigableMap<String, Integer> sortedMap = new TreeMap<>();
        sortedMap.put("charlie", 3);
        sortedMap.put("alice", 1);
        sortedMap.firstEntry();
        sortedMap.lastEntry();
        sortedMap.higherKey("bob");
        
        // ========================================
        // 12. ENUMMAP (Best for enum keys)
        // ========================================
        Map<Day, String> enumMap = new EnumMap<>(Day.class);
        enumMap.put(Day.MON, "Monday");
        enumMap.put(Day.TUE, "Tuesday");
        
        // ========================================
        // 13. QUEUE using LinkedList
        // ========================================
        Queue<String> queue = new LinkedList<>();
        queue.offer("A");  // preferred over add()
        queue.offer("B");
        queue.poll();      // removes and returns head
        queue.peek();      // returns head without removing
        
        // ========================================
        // 14. PRIORITYQUEUE (Min-heap by default)
        // ========================================
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(10);
        minHeap.offer(1);
        minHeap.offer(5);
        
        // Max-heap
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        
        // Custom comparator (Java 21 style)
        PriorityQueue<String> customPQ = new PriorityQueue<>(
            Comparator.comparingInt(String::length).reversed()
        );
        
        // ========================================
        // 15. DEQUE using ArrayDeque (Modern, preferred)
        // ========================================
        Deque<String> deque = new ArrayDeque<>();
        deque.offerFirst("X");
        deque.offerLast("Y");
        deque.pollFirst();
        deque.pollLast();
        deque.peekFirst();
        deque.peekLast();
        
        // ========================================
        // 16. STACK using ArrayDeque (Modern way)
        // ========================================
        Deque<String> stack = new ArrayDeque<>();
        stack.push("A");
        stack.push("B");
        stack.pop();
        stack.peek();
        
        // ========================================
        // 17. CONCURRENTHASHMAP (Thread-safe, modern)
        // ========================================
        ConcurrentMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("key1", 100);
        concurrentMap.computeIfAbsent("key2", k -> 200);
        
        // ========================================
        // 18. COPYONWRITEARRAYLIST (Thread-safe reads)
        // ========================================
        List<String> cowList = new CopyOnWriteArrayList<>();
        cowList.add("thread-safe");
        
        // ========================================
        // 19. COPYONWRITEARRAYSET (Thread-safe reads)
        // ========================================
        Set<String> cowSet = new CopyOnWriteArraySet<>();
        cowSet.add("concurrent");
        
        // ========================================
        // 20. BLOCKINGQUEUE (Producer-Consumer pattern)
        // ========================================
        BlockingQueue<Integer> blockingQueue = new LinkedBlockingQueue<>();
        BlockingQueue<Integer> arrayBlockingQueue = new ArrayBlockingQueue<>(10);
        BlockingQueue<Integer> priorityBlockingQueue = new PriorityBlockingQueue<>();
        
        // ========================================
        // 21. CONCURRENTSKIPLISTMAP (Sorted, concurrent)
        // ========================================
        ConcurrentNavigableMap<String, Integer> skipListMap = new ConcurrentSkipListMap<>();
        skipListMap.put("a", 1);
        
        // ========================================
        // 22. CONCURRENTSKIPLISTSET (Sorted set, concurrent)
        // ========================================
        NavigableSet<Integer> skipListSet = new ConcurrentSkipListSet<>();
        skipListSet.add(5);
        
        // ========================================
        // 23. SEQUENCED COLLECTIONS (Java 21 NEW!)
        // ========================================
        // SequencedCollection interface (Java 21)
        SequencedCollection<String> seqList = new ArrayList<>(List.of("a", "b", "c"));
        seqList.addFirst("start");
        seqList.addLast("end");
        seqList.getFirst();
        seqList.getLast();
        seqList.reversed();  // reversed view
        
        // SequencedSet (Java 21)
        SequencedSet<Integer> seqSet = new LinkedHashSet<>(Set.of(1, 2, 3));
        seqSet.addFirst(0);
        seqSet.reversed();
        
        // SequencedMap (Java 21)
        SequencedMap<String, Integer> seqMap = new LinkedHashMap<>();
        seqMap.put("a", 1);
        seqMap.putFirst("start", 0);
        seqMap.putLast("end", 99);
        seqMap.firstEntry();
        seqMap.lastEntry();
        
        // ========================================
        // 24. GENERICS (Modern patterns)
        // ========================================
        // Generic class
        Box<String> stringBox = new Box<>("Hello");
        Box<Integer> intBox = new Box<>(42);
        
        // Bounded type parameters
        NumberBox<Integer> numBox = new NumberBox<>(100);
        
        // Multiple bounds
        MultiBox<String> multiBox = new MultiBox<>("test");
        
        // Wildcards
        List<? extends Number> numberList = new ArrayList<Integer>();
        List<? super Integer> superList = new ArrayList<Number>();
        List<?> unknownList = new ArrayList<String>();
        
        // Generic method with type inference (diamond operator)
        var result = createPair("key", 123);
        
        // ========================================
        // 25. COLLECTIONS UTILITY (Modern methods)
        // ========================================
        List<Integer> numbers = new ArrayList<>(List.of(5, 2, 8, 1, 9));
        Collections.sort(numbers);
        Collections.reverse(numbers);
        Collections.shuffle(numbers);
        
        // Modern unmodifiable wrappers
        List<String> unmodifiableList = Collections.unmodifiableList(list);
        Set<String> unmodifiableSet = Collections.unmodifiableSet(set);
        Map<String, Integer> unmodifiableMap = Collections.unmodifiableMap(map);
        
        // ========================================
        // 26. STREAMS (Java 8+, essential in modern Java)
        // ========================================
        list.stream()
            .filter(s -> s.startsWith("a"))
            .map(String::toUpperCase)
            .sorted()
            .distinct()
            .limit(10)
            .forEach(System.out::println);
        
        // Collecting to different collections
        List<String> filtered = list.stream()
            .filter(s -> s.length() > 3)
            .toList();  // Java 16+ (immutable)
        
        Set<String> uniqueSet = list.stream()
            .collect(Collectors.toSet());
        
        Map<Integer, String> lengthMap = list.stream()
            .collect(Collectors.toMap(String::length, s -> s, (a, b) -> a));
        
        // ========================================
        // 27. OPTIONAL (Modern null handling)
        // ========================================
        Optional<String> optional = Optional.of("value");
        optional.ifPresent(System.out::println);
        String value = optional.orElse("default");
        String computed = optional.orElseGet(() -> "computed");
        
        // ========================================
        // 28. RECORDS (Java 14+, for data classes)
        // ========================================
        record Person(String name, int age) {}
        
        Person person = new Person("Alice", 30);
        String name = person.name();
        int age = person.age();
        
        List<Person> people = List.of(
            new Person("Alice", 30),
            new Person("Bob", 25)
        );
        
        // ========================================
        // 29. PATTERN MATCHING (Java 21)
        // ========================================
        Object obj = "Hello";
        
        // Pattern matching for instanceof
        if (obj instanceof String s) {
            System.out.println(s.toUpperCase());
        }
        
        // Pattern matching in switch (Java 21)
        String result2 = switch (obj) {
            case String s -> "String: " + s;
            case Integer i -> "Integer: " + i;
            case null -> "Null value";
            default -> "Unknown type";
        };
        
        // Record patterns (Java 21)
        Object personObj = new Person("Charlie", 35);
        if (personObj instanceof Person(String n, int a)) {
            System.out.println(n + " is " + a + " years old");
        }
        
        // ========================================
        // 30. VIRTUAL THREADS (Java 21 - for concurrent tasks)
        // ========================================
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            executor.submit(() -> {
                System.out.println("Running in virtual thread");
                return "result";
            });
        }
        
        // ========================================
        // 31. EXCEPTION HANDLING WITH COLLECTIONS
        // ========================================
        try {
            list.get(100);  // IndexOutOfBoundsException
        } catch (IndexOutOfBoundsException e) {
            System.err.println("Index out of bounds: " + e.getMessage());
        }
        
        try {
            immutableList.add("d");  // UnsupportedOperationException
        } catch (UnsupportedOperationException e) {
            System.err.println("Cannot modify immutable collection");
        }
        
        try {
            TreeSet<String> nullSet = new TreeSet<>();
            // nullSet.add(null);  // NullPointerException
        } catch (NullPointerException e) {
            System.err.println("Null not allowed");
        }
        
        try {
            Queue<String> emptyQueue = new LinkedList<>();
            emptyQueue.element();  // NoSuchElementException
        } catch (NoSuchElementException e) {
            System.err.println("Queue is empty");
        }
        
        // ========================================
        // 32. COMPARATOR (Modern functional style)
        // ========================================
        people.sort(Comparator.comparing(Person::age));
        people.sort(Comparator.comparing(Person::name).reversed());
        people.sort(Comparator.comparing(Person::age)
                              .thenComparing(Person::name));
        
        // ========================================
        // 33. TEXT BLOCKS (Java 15+)
        // ========================================
        String json = """
            {
                "name": "Alice",
                "age": 30,
                "city": "NYC"
            }
            """;
        
        // ========================================
        // 34. VAR (Java 10+, type inference)
        // ========================================
        var autoList = new ArrayList<String>();
        var autoMap = new HashMap<String, Integer>();
        var autoSet = new HashSet<Integer>();
        
        // ========================================
        // PRINT EXAMPLES
        // ========================================
        System.out.println("Modern Java 21 Collections Demo");
        System.out.println("ArrayList: " + list);
        System.out.println("Immutable List: " + immutableList);
        System.out.println("SequencedMap: " + seqMap);
        System.out.println("PriorityQueue: " + minHeap.peek());
    }
    
    // ========================================
    // GENERIC CLASS
    // ========================================
    static class Box<T> {
        private T content;
        
        public Box(T content) {
            this.content = content;
        }
        
        public T getContent() {
            return content;
        }
    }
    
    // ========================================
    // BOUNDED GENERIC CLASS
    // ========================================
    static class NumberBox<T extends Number> {
        private T number;
        
        public NumberBox(T number) {
            this.number = number;
        }
        
        public double getDoubleValue() {
            return number.doubleValue();
        }
    }
    
    // ========================================
    // MULTIPLE BOUNDS
    // ========================================
    static class MultiBox<T extends Comparable<T> & CharSequence> {
        private T value;
        
        public MultiBox(T value) {
            this.value = value;
        }
    }
    
    // ========================================
    // GENERIC METHOD
    // ========================================
    public static <K, V> Map<K, V> createPair(K key, V value) {
        return Map.of(key, value);
    }
    
    // ========================================
    // GENERIC METHOD WITH BOUNDS
    // ========================================
    public static <T extends Comparable<T>> T findMax(List<T> list) {
        return Collections.max(list);
    }
}
```
