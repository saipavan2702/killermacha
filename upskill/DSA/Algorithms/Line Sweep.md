> [!summary]
> Line sweep sorts events along an axis and maintains only the active state needed to solve interval and geometry problems efficiently.

Map: [[Upskill/DSA/DSA|DSA]]

## Maximum Overlapping Segments

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

## Active-Set Intersection Example

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

#dsa #line-sweep

## Related

- [[Upskill/DSA/Algorithms/Binary Search|Binary Search]]
