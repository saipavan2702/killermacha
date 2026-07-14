> [!summary]
> A bitmask represents a set of boolean choices inside an integer, making membership checks, subset enumeration, and compact DP states efficient.

Map: [[Upskill/DSA/DSA|DSA]]

## Topics

- [[Upskill/DSA/Algorithms/Bitmasking/Bit Operations|Bit Operations]] - Set, clear, toggle, query, and common bit tricks.
- [[Upskill/DSA/Algorithms/Bitmasking/Subset Enumeration|Subset Enumeration]] - Generate subsets and reason about subset counts.
- [[Upskill/DSA/Algorithms/Bitmasking/Bitmask Dynamic Programming|Bitmask Dynamic Programming]] - Use masks as dynamic-programming state.

## When a Bitmask Fits

Use a bitmask when:

- each item is either selected or not selected
- the number of items is small enough that `2^n` states are practical
- transitions add, remove, or inspect individual items
- a compact hashable representation helps memoization

For a mask named `mask`, bit `i` represents whether item `i` is present.

## Related

- [[Upskill/DSA/Algorithms/Dynamic Programming|Dynamic Programming]]
- [[Upskill/DSA/Algorithms/Backtracking|Backtracking]]
- [[Upskill/DSA/Data Structures/Segment Tree|Segment Tree]]

#dsa #bitmasking

---

## References

- [Bitmasking and Dynamic Programming](https://cp-algorithms.com/) - Competitive-programming reference collection.
