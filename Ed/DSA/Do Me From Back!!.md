- **Sudoku solver**
```cpp
#include <vector>
#include <cmath>
using namespace std;

bool fill(vector<vector<int>>& s, int i, int j, int x) {
    int n;
    n = s.size();

    for (int r = 0; r < n; r++) {
        if (s[i][r] == x)
            return 0;
        if (s[r][j] == x)
            return 0;
    }

    int rn, sr, sc;
    rn = sqrt(n);
    sr = (i / rn) * rn;
    sc = (j / rn) * rn;

    for (int r = sr; r < sr + rn; r++) {
        for (int l = sc; l < sc + rn; l++) {
            if (s[r][l] == x)
                return 0;
        }
    }

    return 1;
}

bool solver(vector<vector<int>>& s, int i, int j) {
    int n;
    n = s.size();

    if (i == n)
        return 1;

    if (j == n)
        return solver(s, i + 1, 0);

    if (s[i][j] != 0)
        return solve(s, i, j + 1);

    for (int t = 1; t <= n; t++) {
        if (fill(s, i, j, t)) {
            s[i][j] = t;
            bool after_fill = fill(s, i, j + 1, t);
            if (after_fill)
                return 1;
        }
    }

    s[i][j] = 0;
    return 0;
}

vector<vector<int>> solve(vector<vector<int>>& s) {
    solver(s, 0, 0);
    return s;
}

```