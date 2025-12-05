The below problem will give the maximum lines are intersected when we sweep a line across the segments.
 ```cpp
#include <vector>
#include <set>
#include <algorithm>

using namespace std;

// Define the node structure
struct node {
    int val;
    int left;
    int right;
    bool isleft = false;
};

// Comparator function to sort by val
bool use(const node& a, const node& b) {
    return a.val < b.val;
}

// Linesweep function
int Linesweep(vector<vector<int>>& T) {
    vector<node> ret;

    // Flatten input intervals into events
    for (auto x : T) {
        for (auto r : x) {
            node p;
            p.left = x[0];
            p.right = x[1];
            p.val = r;

            if (r == x[0])
                p.isleft = true;

            ret.push_back(p);
        }
    }

    // Sort events based on val
    sort(ret.begin(), ret.end(), use);

    set<int> st;
    int res = 0;

    // Sweep line algorithm
    for (const node& p : ret) {
        if (p.isleft) {
            st.insert(p.val);
        } else {
            st.erase(p.left);
        }
        res = max(res, static_cast<int>(st.size()) + 1);
    }

    return res;
}
```
 
- Another ref for line sweep

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Point {
    int x, y;
};

bool compare_points(const Point& a, const Point& b) {
    return a.x < b.x;
}

int main() {
    vector<Point> points;
    int n;
    cin >> n;

    for (int i = 0; i < n; i++) {
        int x, y;
        cin >> x >> y;
        points.push_back({x, y});
    }

    // Sort points by their x-coordinate
    sort(points.begin(), points.end(), compare_points);

    vector<Point> active;

    for (Point p : points) {
        // Remove points from active set that are to the left of p
        active.erase(
            remove_if(active.begin(), active.end(),
                      [&](const Point& q) { return q.x < p.x; }),
            active.end());

        // Check for intersections with points in the active set
        for (Point q : active) {
            if (p.y > q.y) {
                // p is above q, so there is an intersection
                cout << "Intersection at (" << p.x << ", " << q.y << ")" << endl;
            }
        }

        // Add current point to active set
        active.push_back(p);
    }

    return 0;
}
```

- We can use lower_bound /upper_bound to find index and frequency of a repeated element
```cpp
// Explanation:
// We can use lower_bound / upper_bound to find the index and frequency of a repeated element.
// Example usage:
// auto it = lower_bound(arr, arr + n, key);
// cout << "The lower_bound gives the first position >= key: " << (it - arr) << endl;
// Similarly, upper_bound gives the first position > key.
// Frequency of 'key' in the sorted array can be found by:
// frequency = upper_bound(...) - lower_bound(...);

// Problem:
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

 - Bucket Sort 
 ```cpp

#include <iostream>
using namespace std;
void bucketsort(int a[], int n){ // function to implement bucket sort
   int max = a[0]; 
   for (int i = 1; i < n; i++)
      if (a[i] > max)
         max = a[i];
   int b[max], i;
   for (int i = 0; i <= max; i++) {
      b[i] = 0;
   }
   for (int i = 0; i < n; i++) {
      b[a[i]]++;
   }
   for (int i = 0, j = 0; i <= max; i++) {
      while (b[i] > 0) {
         a[j++] = i;
         b[i]--;
      }
   }
}
int main(){
   int a[] = {12, 45, 33, 87, 56, 9, 11, 7, 67};
   int n = sizeof(a) / sizeof(a[0]); // n is the size of array
   cout << "Before sorting array elements are: \n";
   for (int i = 0; i < n; ++i)
      cout << a[i] << " ";
   bucketsort(a, n);
   cout << "\nAfter sorting array elements are: \n";
   for (int i = 0; i < n; ++i)
      cout << a[i] << " ";
}

//Another method

#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

void bucketSort(vector<int>& nums) {
    int n = nums.size();
    if (n <= 1) return;

    int s = *min_element(nums.begin(), nums.end());
    int l = *max_element(nums.begin(), nums.end());
    int diff = l - s;

    if (diff == 0) return; 

    double len = (diff) * 1.0 / (n - 1);
    vector<vector<int>> buckets(n);

    for (int i = 0; i < n; i++) {
        int idx = (nums[i] - s) / len;
        if (idx >= n) idx = n - 1; // Prevent index overflow for max value
        buckets[idx].push_back(nums[i]);
    }

    // Sort individual buckets and concatenate results
    nums.clear();
    for (int i = 0; i < n; i++) {
        sort(buckets[i].begin(), buckets[i].end());
        nums.insert(nums.end(), buckets[i].begin(), buckets[i].end());
    }
}

int main() {
    vector<int> nums = {42, 32, 23, 52, 25, 47, 51};
    bucketSort(nums);

    cout << "Sorted array: ";
    for (int num : nums)
        cout << num << " ";
    cout << endl;

    return 0;
}
```


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


