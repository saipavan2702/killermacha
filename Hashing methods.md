
```java
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Reference implementations for:
 *  1. Modulo hashing            -> used for sharding a hot Redis key (rate limiter case)
 *  2. Consistent hashing (ring) -> used when shards hold state (caches, Redis Cluster, DBs)
 *  3. Rendezvous / HRW hashing  -> simpler alternative to consistent hashing, no ring needed
 *  4. Round robin               -> server-to-server request distribution (load balancer)
 *  5. Weighted round robin      -> same, but servers have different capacity
 *  6. Least connections         -> route to whichever server is least busy right now
 */
public class ShardingAndDistribution {

    // ---------------------------------------------------------------
    // 1. MODULO HASHING — good for stateless sharding (our rate limiter case)
    // Downside: changing N remaps almost everything.
    // ---------------------------------------------------------------
    static class ModuloSharding {
        private final int shardCount;

        ModuloSharding(int shardCount) {
            this.shardCount = shardCount;
        }

        int getShard(String key) {
            // Math.floorMod avoids negative results from hashCode()
            return Math.floorMod(key.hashCode(), shardCount);
        }
    }

    // ---------------------------------------------------------------
    // 2. CONSISTENT HASHING — good when shards hold state (cache, DB, Redis Cluster)
    // Only ~K/N keys move when a node is added/removed.
    // Uses virtual nodes so load spreads evenly even with few physical nodes.
    // ---------------------------------------------------------------
    static class ConsistentHashRing {
        private final SortedMap<Long, String> ring = new TreeMap<>();
        private final int virtualNodesPerServer;

        ConsistentHashRing(int virtualNodesPerServer) {
            this.virtualNodesPerServer = virtualNodesPerServer;
        }

        private long hash(String input) {
            // simple 64-bit hash; swap for MurmurHash/CRC32 in production
            return Math.abs((long) input.hashCode()) * 31L + input.length();
        }

        void addServer(String server) {
            for (int i = 0; i < virtualNodesPerServer; i++) {
                ring.put(hash(server + "#" + i), server);
            }
        }

        void removeServer(String server) {
            for (int i = 0; i < virtualNodesPerServer; i++) {
                ring.remove(hash(server + "#" + i));
            }
        }

        String getServer(String key) {
            if (ring.isEmpty()) throw new IllegalStateException("No servers in ring");
            long h = hash(key);
            // find first node clockwise from key's hash position
            SortedMap<Long, String> tail = ring.tailMap(h);
            Long nodeKey = tail.isEmpty() ? ring.firstKey() : tail.firstKey();
            return ring.get(nodeKey);
        }
    }

    // ---------------------------------------------------------------
    // 3. RENDEZVOUS (HRW - Highest Random Weight) HASHING
    // No ring/data structure to maintain. For each key, score every node,
    // pick the highest scorer. Adding/removing a node only affects keys
    // that were mapped to it (or now score higher on the new node).
    // Simpler than consistent hashing, slightly more CPU per lookup (O(N) nodes).
    // ---------------------------------------------------------------
    static class RendezvousHashing {
        private final List<String> nodes = new ArrayList<>();

        void addNode(String node) { nodes.add(node); }
        void removeNode(String node) { nodes.remove(node); }

        private long weight(String node, String key) {
            return Objects.hash(node, key); // combine deterministically
        }

        String getNode(String key) {
            String best = null;
            long bestWeight = Long.MIN_VALUE;
            for (String node : nodes) {
                long w = weight(node, key);
                if (w > bestWeight) {
                    bestWeight = w;
                    best = node;
                }
            }
            return best;
        }
    }

    // ---------------------------------------------------------------
    // 4. ROUND ROBIN — load balancer distributing requests across servers
    // ---------------------------------------------------------------
    static class RoundRobinBalancer {
        private final List<String> servers;
        private final AtomicInteger index = new AtomicInteger(0);

        RoundRobinBalancer(List<String> servers) {
            this.servers = servers;
        }

        String nextServer() {
            int i = Math.floorMod(index.getAndIncrement(), servers.size());
            return servers.get(i);
        }
    }

    // ---------------------------------------------------------------
    // 5. WEIGHTED ROUND ROBIN — servers get traffic proportional to capacity
    // e.g. server A (weight 3) gets 3x the requests of server B (weight 1)
    // ---------------------------------------------------------------
    static class WeightedRoundRobinBalancer {
        private final List<String> expanded = new ArrayList<>();
        private final AtomicInteger index = new AtomicInteger(0);

        WeightedRoundRobinBalancer(Map<String, Integer> serverWeights) {
            for (Map.Entry<String, Integer> e : serverWeights.entrySet()) {
                for (int i = 0; i < e.getValue(); i++) {
                    expanded.add(e.getKey());
                }
            }
        }

        String nextServer() {
            int i = Math.floorMod(index.getAndIncrement(), expanded.size());
            return expanded.get(i);
        }
    }

    // ---------------------------------------------------------------
    // 6. LEAST CONNECTIONS — route to whichever server has fewest active requests
    // Needs live connection counts (from health checks / server-reported state)
    // ---------------------------------------------------------------
    static class LeastConnectionsBalancer {
        private final Map<String, AtomicInteger> activeConnections = new HashMap<>();

        LeastConnectionsBalancer(List<String> servers) {
            for (String s : servers) activeConnections.put(s, new AtomicInteger(0));
        }

        String acquireServer() {
            String chosen = Collections.min(
                activeConnections.entrySet(),
                Comparator.comparingInt(e -> e.getValue().get())
            ).getKey();
            activeConnections.get(chosen).incrementAndGet();
            return chosen;
        }

        void release(String server) {
            activeConnections.get(server).decrementAndGet();
        }
    }

    // ---------------------------------------------------------------
    // DEMO
    // ---------------------------------------------------------------
    public static void main(String[] args) {
        System.out.println("=== Modulo sharding (rate limiter case) ===");
        ModuloSharding modulo = new ModuloSharding(4);
        for (String reqId : List.of("req-1", "req-2", "req-3", "req-4", "req-5")) {
            System.out.println(reqId + " -> shard " + modulo.getShard(reqId));
        }

        System.out.println("\n=== Consistent hashing ===");
        ConsistentHashRing ring = new ConsistentHashRing(100);
        ring.addServer("cacheA");
        ring.addServer("cacheB");
        ring.addServer("cacheC");
        for (String key : List.of("user:1001", "user:1002", "user:1003")) {
            System.out.println(key + " -> " + ring.getServer(key));
        }
        // simulate adding a node and see how few keys shift
        ring.addServer("cacheD");
        System.out.println("After adding cacheD:");
        for (String key : List.of("user:1001", "user:1002", "user:1003")) {
            System.out.println(key + " -> " + ring.getServer(key));
        }

        System.out.println("\n=== Rendezvous hashing ===");
        RendezvousHashing hrw = new RendezvousHashing();
        hrw.addNode("cacheA");
        hrw.addNode("cacheB");
        hrw.addNode("cacheC");
        for (String key : List.of("user:1001", "user:1002", "user:1003")) {
            System.out.println(key + " -> " + hrw.getNode(key));
        }

        System.out.println("\n=== Round robin ===");
        RoundRobinBalancer rr = new RoundRobinBalancer(List.of("s1", "s2", "s3"));
        for (int i = 0; i < 6; i++) System.out.println("request " + i + " -> " + rr.nextServer());

        System.out.println("\n=== Weighted round robin ===");
        WeightedRoundRobinBalancer wrr = new WeightedRoundRobinBalancer(
            Map.of("s1", 3, "s2", 1)
        );
        for (int i = 0; i < 8; i++) System.out.println("request " + i + " -> " + wrr.nextServer());

        System.out.println("\n=== Least connections ===");
        LeastConnectionsBalancer lc = new LeastConnectionsBalancer(List.of("s1", "s2", "s3"));
        String a = lc.acquireServer();
        String b = lc.acquireServer();
        System.out.println("acquired: " + a + ", " + b);
        lc.release(a);
        String c = lc.acquireServer();
        System.out.println("acquired next: " + c + " (freed slot reused)");
    }
}
```