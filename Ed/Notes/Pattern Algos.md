- KMP algo

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Function to compute the longest prefix-suffix (LPS) array for the pattern
void computeLPS(const string& pattern, vector<int>& lps) {
    int length = 0; // length of the previous longest prefix suffix
    int i = 1;
    lps[0] = 0; // lps[0] is always 0

    while (i < pattern.size()) {
        if (pattern[i] == pattern[length]) {
            length++;
            lps[i] = length;
            i++;
        } else {
            if (length != 0) {
                length = lps[length - 1]; // fall back in the lps array
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
}

int strStr(string haystack, string needle) {
    int n = haystack.size();
    int m = needle.size();

    if (m == 0) return 0; 

    vector<int> lps(m);
    computeLPS(needle, lps);

    int i = 0; // index for haystack
    int j = 0; // index for needle

    while (i < n) {
        if (haystack[i] == needle[j]) {
            i++;
            j++;
        }

        if (j == m) {
            return i - j; // match found
        } else if (i < n && haystack[i] != needle[j]) {
            if (j != 0) {
                j = lps[j - 1]; // fall back in the pattern
            } else {
                i++;
            }
        }
    }

    return -1;
}

```

- Robin-Karp
```cpp
#include <iostream>
#include <climits>
using namespace std;

int d = 256; // Number of characters in the input alphabet
long long int MOD = INT_MAX; // A large prime for hashing

// Rabin-Karp implementation of strStr
int strStr(string haystack, string needle) {
    long long int n = haystack.size();
    long long int m = needle.size();

    if (m == 0) return 0;
    if (n < m) return -1;

    long long int p = 0; // Hash value for needle (pattern)
    long long int t = 0; // Hash value for current text window
    long long int h = 1; // Value of d^(m-1)
    long long int j;

    // Precompute h = pow(d, m-1) % MOD
    for (int i = 0; i < m - 1; i++) {
        h = (h * d) % MOD;
    }

    // Calculate initial hash values for pattern and first window
    for (int i = 0; i < m; i++) {
        p = (d * p + needle[i]) % MOD;
        t = (d * t + haystack[i]) % MOD;
    }

    // Slide the pattern over the text
    for (int i = 0; i <= n - m; i++) {
        // If the hash values match, check characters one by one
        if (p == t) {
            for (j = 0; j < m; j++) {
                if (haystack[i + j] != needle[j])
                    break;
            }

            // If full match is found
            if (j == m) return i;
        }

        // Calculate hash for next window: Remove leading digit, add trailing digit
        if (i < n - m) {
            t = ((d * (t - haystack[i] * h) + haystack[i + m]) % MOD);

            // If hash is negative, convert it to positive
            if (t < 0) {
                t = t + MOD;
            }
        }
    }

    return -1; // No match found
}
```
