## Minimum Ball Deletions — Interval DP

###  Problem Statement
You are given an array of **N colored balls**.
- You can **manually delete** any ball (costs **1 operation**).
- When you delete a ball, its neighbors fall together. If they share the same color, they **automatically collide and disappear** (costs **0 operations**), and this **chain reaction** continues.
**Goal:** Find the **minimum number of manual deletions** to clear the entire array.
### Why Greedy Fails
Greedy strategies (always making the locally best move) fail here because they ignore future chain reactions. A suboptimal move now can unlock a cascade that saves multiple operations later.
**The fix:** Use **Interval Dynamic Programming**.
###  The DP Formulation
Define:
```
dp[L][R] = minimum manual deletions to clear all balls from index L to R
```
**Base cases:**
- `dp[i][i] = 1` — a single ball always costs 1 manual deletion.
- `dp[L][R] = 0` when `L > R` — empty interval costs nothing (handled by global 0-init).
### Recurrence / Transition

For every interval `[L, R]`, focus on the **leftmost ball at index `L`** and consider:
#### Option 1 — Manual Delete `L`
Delete `L` directly and solve the rest:
```
dp[L][R] = 1 + dp[L+1][R]
```
#### Option 2 — Collision with a Matching Ball at `M`
Find any `M` in `(L, R]` where `colors[M] == colors[L]`.
Clear the middle segment `[L+1, M-1]` to make them neighbors → they auto-collide for free.
Then clear the right segment `[M+1, R]`:
```
dp[L][R] = min(dp[L][R],  dp[L+1][M-1] + dp[M+1][R])
```

Take the **minimum over all valid `M`**.
### Solution Code (C++)

```cpp
#include <bits/stdc++.h>
using namespace std;

int dp[105][105];   // globally initialized to 0
int colors[105];

int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) cin >> colors[i];

    // Step 1: Base case — single balls
    for (int i = 0; i < n; i++)
        dp[i][i] = 1;

    // Step 2: Fill DP for increasing interval lengths
    for (int len = 2; len <= n; len++) {
        for (int l = 0; l <= n - len; l++) {
            int r = l + len - 1;

            // Option 1: Manually delete leftmost ball
            dp[l][r] = 1 + dp[l + 1][r];

            // Option 2: Collide L with a matching ball M
            for (int m = l + 1; m <= r; m++) {
                if (colors[l] == colors[m]) {
                    int moves = dp[l + 1][m - 1] + dp[m + 1][r];
                    dp[l][r] = min(dp[l][r], moves);
                }
            }
        }
    }

    cout << dp[0][n - 1] << endl;
    return 0;
}
```

> **Note:** When `m = l + 1`, `dp[l+1][m-1]` becomes `dp[l+1][l]` (i.e., `L > R`), which correctly evaluates to **0** due to global initialization — representing an empty segment.
###  Worked Test Case

**Input:**
```
6
1 2 1 3 2 1
```
*(6 balls with colors: 1, 2, 1, 3, 2, 1)*
**Expected Output:** `2`
**Trace (one optimal path):**

| Step | Action | Array State |
|------|--------|-------------|
| Start | — | `[1, 2, 1, 3, 2, 1]` |
| Delete `3` (index 3) | Manual (cost 1) | `[1, 2, 1, 2, 1]` → `2`s collide → `[1, 1]` → `1`s collide → `[]`... |

Wait — let's trace more carefully:

```
Initial:  [1, 2, 1, 3, 2, 1]

Move 1 — Delete ball '3':
→ Neighbors are '1' and '2' — no match, no chain.
→ Array: [1, 2, 1, 2, 1]

Move 2 — Delete ball '1' (middle):
→ Neighbors '2' and '2' collide (free)
→ Remaining '1' and '1' collide (free chain)
→ Array: [] ✅
```

**Total manual deletions: 2** ✓
### 🚀 Quick Memory Tips

#### 1. The "Focus on the Left End" Pattern
In interval DP on sequences, always **anchor to one end** (usually left) and ask: *"What's the last/first thing that happens to this ball?"*
#### 2. Remember the Two Choices
```
Either:  DELETE it alone   →  1 + dp[L+1][R]
Or:      PAIR it with M    →  dp[L+1][M-1] + dp[M+1][R]   (M matches L's color)
```
Think: **"go alone or find a partner."**
#### 3. The Empty Interval Trick
Global `int dp[N][N]` initializes to 0 automatically in C++ — this handles the `L > R` base case for free. No special check needed.
#### 4. Build Bottom-Up by Length
Always iterate by **interval length** (short → long), so smaller subproblems are solved before larger ones that depend on them.
#### 5. The Mental Model
> *"I'm looking at the leftmost ball. I can either pay 1 to kill it, or spend some moves to bring a same-colored friend next to it so they both die for free."*

---

#IntervalDP #dsa #dynamicprogramming 



### Ref
https://www.youtube.com/watch?v=dv_dGwrazuE
#ref 