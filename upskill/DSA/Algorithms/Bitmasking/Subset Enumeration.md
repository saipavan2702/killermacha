> [!summary]
> An `n`-item set has `2^n` subsets; the binary representation of each mask states which items belong to one subset.

Map: [[Upskill/DSA/Algorithms/Bitmasking/Bitmasking|Bitmasking]]

## Enumerate Every Subset

```cpp
for (int mask = 0; mask < (1 << n); ++mask) {
    for (int i = 0; i < n; ++i) {
        if (mask & (1 << i)) {
            // item i belongs to this subset
        }
    }
}
```

This takes `O(n * 2^n)` when each mask scans every item.

## Enumerate Submasks

For a fixed mask, visit every non-empty submask:

```cpp
for (int sub = mask; sub != 0; sub = (sub - 1) & mask) {
    // sub is contained in mask
}
```

Process the empty submask separately when needed.

```cpp
int sub = mask;
do {
    // includes sub == 0
    sub = (sub - 1) & mask;
} while (sub != mask);
```

## Sum Across All Subsets

Each element appears in exactly half of all subsets. For `n > 0`, each element therefore contributes to `2^(n-1)` subsets.

```cpp
long long totalSubsetSum(const vector<int>& values) {
    if (values.empty()) return 0;

    long long sum = accumulate(values.begin(), values.end(), 0LL);
    return sum * (1LL << (values.size() - 1));
}
```

For `{a, b, c}`, element `a` appears in `{a}`, `{a,b}`, `{a,c}`, and `{a,b,c}`: four of the eight subsets.

## Complexity Check

- all subsets: `2^n`
- scan all items for every subset: `O(n * 2^n)`
- enumerate all submasks of one mask: `O(2^k)` where `k` is its number of set bits
- enumerate submasks for every `n`-bit mask: `O(3^n)` total

## Related

- [[Upskill/DSA/Algorithms/Backtracking|Backtracking]]
- [[Upskill/DSA/Algorithms/Bitmasking/Bit Operations|Bit Operations]]
- [[Upskill/DSA/Algorithms/Bitmasking/Bitmask Dynamic Programming|Bitmask Dynamic Programming]]

#dsa #subsets
