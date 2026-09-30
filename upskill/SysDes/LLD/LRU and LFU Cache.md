Tags: #sysdes #data-structures
Map: [[Upskill/SysDes/HLD/Caching|Caching]], [[Upskill/DSA/Data Structures/Linked List|Linked List]], [[Upskill/SysDes/LLD/Rate Limiter|Rate Limiter]]

## LRU vs LFU

A bounded cache needs a rule for choosing a victim when it is full. **LRU remembers when an item was used; LFU remembers how often it was used.** Neither policy decides whether a value is still fresh; expiration and invalidation are separate concerns.

| | LRU — Least Recently Used | LFU — Least Frequently Used |
| --- | --- | --- |
| Evict | The item accessed longest ago | The item with the smallest access count |
| State | One ordered list of entries | A count per entry and an ordered bucket per count |
| Strength | Adapts quickly when the working set changes | Protects repeatedly popular entries from occasional accesses |
| Weakness | A one-time scan can displace useful entries | Old popularity can outlive current usefulness |
| Tie rule | Recency determines the order | This note uses LRU among equal-frequency entries |

The examples below count insertion as the first use. Reading an existing key or updating its value counts as another access. A miss does not change the order or counts. These are explicit API choices, matching the [LFU practice problem](https://leetcode.com/problems/lfu-cache/description/).

## One Trace, Different Victims

Capacity is **2**. Perform `put(A)`, `put(B)`, `get(A)`, `get(A)`, `get(B)`, then `put(C)`.

- Before inserting C, A has been used three times and B twice, but B is more recent.
- **LRU evicts A** because B was touched last.
- **LFU evicts B** because its count is lower.
- If the counts were equal, our LFU would evict the less recently used item.

## LRU Design

Use a hash map from key to list node and a doubly linked list ordered from least recent to most recent. A hit detaches its node and appends it at the recent end. Insertion at capacity removes the least-recent node from both structures.

The map avoids searching the list; previous/next pointers let a known node move without scanning. With normal hash-table assumptions, `get` and `put` are average **O(1)**, with **O(capacity)** storage.

Java's access-ordered `LinkedHashMap` already supplies this arrangement. The third constructor argument must be `true`; the default insertion order does not track reads. See the [Java API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/LinkedHashMap.html).

```java
import java.util.LinkedHashMap;

final class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> entries =
        new LinkedHashMap<>(16, 0.75f, true);

    LRUCache(int capacity) {
        if (capacity < 0) throw new IllegalArgumentException("negative capacity");
        this.capacity = capacity;
    }

    int get(int key) {
        return entries.getOrDefault(key, -1);
    }

    void put(int key, int value) {
        if (capacity == 0) return;
        entries.put(key, value);
        if (entries.size() > capacity) {
            var oldest = entries.keySet().iterator();
            oldest.next();
            oldest.remove();
        }
    }
}
```

## LFU Design

Keep a key-to-entry map, a frequency-to-bucket map, and `minFrequency`. Each bucket orders its keys by recency, oldest first. Accessing a key moves it from frequency `f` to `f + 1`, at the newest end of that bucket.

If the old bucket empties, remove it. When it was the minimum bucket, the accessed key guarantees that `f + 1` is now occupied, so the minimum can advance by one. Inserting a new key resets the minimum to one. This avoids scanning all keys for a victim. The [constant-time LFU paper](https://arxiv.org/abs/2110.11602) describes the underlying frequency-bucket approach.

```java
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;

final class LFUCache {
    private static final class Entry {
        int value;
        long frequency = 1;
        Entry(int value) { this.value = value; }
    }

    private final int capacity;
    private long minFrequency;
    private final Map<Integer, Entry> entries = new HashMap<>();
    private final Map<Long, LinkedHashSet<Integer>> buckets = new HashMap<>();

    LFUCache(int capacity) {
        if (capacity < 0) throw new IllegalArgumentException("negative capacity");
        this.capacity = capacity;
    }

    int get(int key) {
        Entry entry = entries.get(key);
        if (entry == null) return -1;
        touch(key, entry);
        return entry.value;
    }

    void put(int key, int value) {
        if (capacity == 0) return;
        Entry existing = entries.get(key);
        if (existing != null) {
            existing.value = value;
            touch(key, existing);
            return;
        }

        if (entries.size() == capacity) {
            LinkedHashSet<Integer> victims = buckets.get(minFrequency);
            var oldest = victims.iterator();
            int victim = oldest.next();
            oldest.remove();
            entries.remove(victim);
            if (victims.isEmpty()) buckets.remove(minFrequency);
        }

        entries.put(key, new Entry(value));
        buckets.computeIfAbsent(1L, ignored -> new LinkedHashSet<>()).add(key);
        minFrequency = 1;
    }

    private void touch(int key, Entry entry) {
        long oldFrequency = entry.frequency;
        LinkedHashSet<Integer> oldBucket = buckets.get(oldFrequency);
        oldBucket.remove(key);
        if (oldBucket.isEmpty()) {
            buckets.remove(oldFrequency);
            if (minFrequency == oldFrequency) minFrequency = oldFrequency + 1;
        }
        entry.frequency++;
        buckets.computeIfAbsent(entry.frequency, ignored -> new LinkedHashSet<>())
               .add(key);
    }
}
```

Both operations are average **O(1)** under hash-table assumptions. Removing empty buckets keeps storage **O(capacity)**. The minimum update relies on this API having only reads, inserts, and updates: arbitrary deletion or expiration would require additional bookkeeping. Counts are exact for the lifetime of a resident entry; this teaching implementation has no decay or counter-overflow handling.

## Checks and Production Trade-offs

- Test zero capacity, capacity one, misses, updating an existing key, LFU ties, and repeated access to the only key in a frequency bucket.
- These integer examples reserve `-1` for a miss. A general API should distinguish a missing entry from a stored value explicitly.
- They are single-threaded examples. Reads mutate eviction state too; a concurrent map alone does not make either cache thread-safe.
- A real memory budget may need byte weights rather than an entry count.
- Exact LFU can retain formerly popular data. Redis uses approximate frequency counters with decay, and its LRU policy is also approximate. Measure hit rate and eviction behavior against the actual workload; see [Redis eviction](https://redis.io/docs/latest/develop/reference/eviction/).
- Eviction, TTL, cache invalidation, and request rate limiting solve different problems. For freshness and write strategies, use [[Upskill/SysDes/HLD/Caching|Caching]].

## References

- [Java 17 LinkedHashMap](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/LinkedHashMap.html) — Access order, operation cost, and synchronization semantics.
- [An O(1) algorithm for implementing the LFU cache eviction scheme](https://arxiv.org/abs/2110.11602) — Matani, Shah, and Mitra; frequency-bucket design.
- [Redis key eviction](https://redis.io/docs/latest/develop/reference/eviction/) — Practical policy selection, approximation, and LFU decay.
- [LRU Cache — LeetCode 146](https://leetcode.com/problems/lru-cache/) and [LFU Cache — LeetCode 460](https://leetcode.com/problems/lfu-cache/) — Implement and test the contracts.
- [LRU with a doubly linked list — GeeksforGeeks](https://www.geeksforgeeks.org/dsa/lru-cache-implementation-using-double-linked-lists/) — Further walkthrough.
- [LFU implementation — GeeksforGeeks](https://www.geeksforgeeks.org/dsa/least-frequently-used-lfu-cache-implementation/) — Further implementation practice.
- [Caching: Data Input and Eviction Strategies — Ryan Lai, Medium](https://forreya.medium.com/caching-data-input-and-eviction-strategies-8603cd7f7433) — Broader reading on cache strategies.
