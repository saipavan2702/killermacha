- Find count of subarrays with sum equal to target

```cpp
int curr = 0;       // Current prefix sum
int cnt = 0;        // Count of subarrays with sum == s
unordered_map<int, int> freq;  
freq[0] = 1;        // Base case: prefix sum 0 occurs once

for (int i = 0; i < n; i++) {
    curr += a[i];
    cnt += freq[curr - s];
    freq[curr]++;
}
```

- Line-sweep Algorithm 
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
            // Complement remainder needed to form a sum divisible by k
            ans += freq[k - res];
        } else {
            // If remainder is 0, pair with other elements with remainder 0
            ans += freq[0];
        }

        // Record the current remainder frequency
        freq[res]++;
    }

    return ans;
}
```

 - Bucket Sort 
 ```cpp
int s=*min_element(nums.begin(),nums.end());  
int l=*max_element(nums.begin(),nums.end());  
int diff=l-s;
 
double len=(diff)*1.0/(n-1);
 
for(int i=0;i\<n;i++)  
int idx=(nums[i]-s)/len;
```

 