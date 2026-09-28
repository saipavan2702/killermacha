Tags: #dsa #counting
Map: [[Upskill/DSA/Algorithms/Bucket Sort|Bucket Sort]], [[Upskill/DSA/Algorithms/String Matching|String Matching]]

> [!summary]
> Count pairs whose sum is divisible by k by matching each remainder with its modular complement.
## Complementary Remainders

```cpp
// Find the number of pairs of elements whose sum is divisible by k.

#include <stdexcept>
#include <vector>
using namespace std;

long long countPairsDivisibleByK(const vector<int>& a, int k) {
    if (k <= 0) throw invalid_argument("k must be positive");

    vector<long long> freq(k, 0);
    long long ans = 0;

    for (long long value : a) {
        const int remainder = static_cast<int>((value % k + k) % k);
        const int complement = (k - remainder) % k;
        ans += freq[complement];
        ++freq[remainder];
    }
    return ans;
}
```
