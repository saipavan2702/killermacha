Tags: #dsa #backtracking
Map: [[Upskill/DSA/Algorithms/Bitmasking/Bitmasking|Bitmasking]]

> [!summary]
> Backtracking explores one choice at a time and abandons a branch as soon as it violates the problem constraints.
## Sudoku Solver

This solver assumes an `N × N` board where `N` is a perfect square and `0` marks an empty cell.

```cpp
#include <vector>
#include <cmath>
using namespace std;

bool isSafe(const vector<vector<int>>& board, int row, int col, int value) {
    const int n = static_cast<int>(board.size());
    const int boxSize = static_cast<int>(sqrt(n));

    for (int i = 0; i < n; ++i) {
        if (board[row][i] == value || board[i][col] == value) return false;
    }

    const int boxRow = (row / boxSize) * boxSize;
    const int boxCol = (col / boxSize) * boxSize;
    for (int r = boxRow; r < boxRow + boxSize; ++r) {
        for (int c = boxCol; c < boxCol + boxSize; ++c) {
            if (board[r][c] == value) return false;
        }
    }
    return true;
}

bool solveSudoku(vector<vector<int>>& board, int row = 0, int col = 0) {
    const int n = static_cast<int>(board.size());
    if (row == n) return true;

    const int nextRow = col == n - 1 ? row + 1 : row;
    const int nextCol = col == n - 1 ? 0 : col + 1;
    if (board[row][col] != 0) return solveSudoku(board, nextRow, nextCol);

    for (int value = 1; value <= n; ++value) {
        if (isSafe(board, row, col, value)) {
            board[row][col] = value;
            if (solveSudoku(board, nextRow, nextCol)) return true;
            board[row][col] = 0;
        }
    }
    return false;
}
```
