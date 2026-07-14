> [!summary]
> Bitmask DP stores which small set of items has been used, while the rest of the state records position, cost, or another problem-specific dimension.

Map: [[Upskill/DSA/Algorithms/Bitmasking/Bitmasking|Bitmasking]]

## State Pattern

A common assignment state is:

```text
dp[mask] = best result after assigning the items present in mask
```

The next position is often `popcount(mask)`. A transition chooses one unused item and sets its bit.

```cpp
for (int mask = 0; mask < (1 << n); ++mask) {
    int position = __builtin_popcount(mask);

    for (int item = 0; item < n; ++item) {
        if (mask & (1 << item)) continue;

        int next = mask | (1 << item);
        dp[next] = min(dp[next], dp[mask] + cost[position][item]);
    }
}
```

This assignment pattern has `2^n` states and up to `n` transitions per state, for `O(n * 2^n)` time.

## Typical Problems

- assignment and matching with small `n`
- travelling salesperson variants
- visit-all-nodes shortest paths
- tiling profiles
- probability states over surviving participants

## Practice Path

1. [AtCoder DP O - Matching](https://atcoder.jp/contests/dp/tasks/dp_o)
2. [AtCoder DP U - Grouping](https://atcoder.jp/contests/dp/tasks/dp_u)
3. [Codeforces 16E - Fish](https://codeforces.com/contest/16/problem/E)
4. [CodeChef T-Shirts](https://www.codechef.com/problems/TSHIRTS)
5. [CSES Counting Tilings](https://cses.fi/problemset/task/2181)
6. [SPOJ HIST2](https://www.spoj.com/problems/HIST2/)
7. [Codeforces 895C](https://codeforces.com/problemset/problem/895/C)

## Related

- [[Upskill/DSA/Algorithms/Dynamic Programming|Dynamic Programming]]
- [[Upskill/DSA/Algorithms/Bitmasking/Subset Enumeration|Subset Enumeration]]
- [[Upskill/DSA/Algorithms/Bitmasking/Bit Operations|Bit Operations]]

#dsa #dynamic-programming

---

## References

- [Job Assignment Walkthrough](https://youtu.be/685x-rzOIlY) - Assignment-state introduction.
- [Travelling Salesperson with Bitmask DP](https://youtu.be/QukpHtZMAtM) - State and recurrence walkthrough.
- [Fish Solution](https://youtu.be/d7kvyp6dfz8) - Probability DP over masks.
- [T-Shirts Solution](https://youtu.be/Smem2tVQQXU) - Matching people to shirts.
- [Counting Tilings Solution](https://youtu.be/lPLhmuWMRag) - Profile DP with masks.
