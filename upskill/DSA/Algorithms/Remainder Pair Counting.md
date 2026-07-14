> [!summary]
> Count pairs whose sum is divisible by k by matching each remainder with its modular complement.

Map: [[Upskill/DSA/DSA|DSA]]

## Complementary Remainders

```cpp
// Find the number of pairs of elements whose sum is divisible by k.

#include <bits/stdc++.h>
using namespace std;

int countPairsDivisibleByK(const vector<int>& a, int k) {
    map<int, int> freq;
    int ans = 0;

    for (int val : a) {
        int res = val % k;
        if (res != 0) {
            ans += freq[k - res];
        } else {
            ans += freq[0];
        }
        freq[res]++;
    }
    return ans;
}
```


## Related

- [[Upskill/DSA/Algorithms/Bucket Sort|Bucket Sort]]
- [[Upskill/DSA/Algorithms/String Matching|String Matching]]

#dsa #counting
