---
title: Bit masking
tags:
  - "#dsa"
  - "#ref"
date: 2026-02-06
---
##  What is a Bitmasking?

Imagine you have **4 light bulbs** in a row:
```cpp
[🔴] [🟢] [🔴] [🟢]
  3    2    1    0   ← Positions
```
Each bulb can be **ON (1)** or **OFF (0)**. We can use a number to remember which bulbs are ON!
```cpp

# Setting a Bit (Turn ON a bulb)
int mask = 0;          // All bulbs OFF: 0000
mask = mask | (1 << 2); // Turn ON bulb at position 2
// 1 << 2 means: 0001 → 0100
// mask | 0100 = 0100 (bulb 2 is ON)

# Clearing a Bit (Turn OFF a bulb)
int mask = 7;          // 0111 (bulbs 0,1,2 are ON)
mask = mask & ~(1 << 1); // Turn OFF bulb at position 1
// ~(1 << 1) = ~(0010) = 1101
// 0111 & 1101 = 0101 (bulb 1 is OFF)

# Toggling a Bit (Flip the switch)
int mask = 5;          // 0101
mask = mask ^ (1 << 0); // Toggle bulb at position 0
// 0101 ^ 0001 = 0100 (bulb 0 flips ON→OFF)

# Checking a Bit (Is bulb ON?)
int mask = 6;          // 0110
bool isOn = mask & (1 << 1); // Check bulb at position 1
// 0110 & 0010 = 0010 (not zero, so bulb 1 is ON)
```

| Operation    | Example          | Binary         | Result | What Happened     |
| ------------ | ---------------- | -------------- | ------ | ----------------- |
| Set bit 2    | `mask \| (1<<2)` | `0100 \| 0000` | `0100` | Bulb 2 turned ON  |
| Clear bit 1  | `mask & ~(1<<1)` | `0111 & 1101`  | `0101` | Bulb 1 turned OFF |
| Toggle bit 0 | `mask ^ (1<<0)`  | `0101 ^ 0001`  | `0100` | Bulb 0 flipped    |
| Check bit 1  | `mask & (1<<1)`  | `0110 & 0010`  | `0010` | Yes, it's ON!     |

> [!abstract] Overview
> Bit manipulation allows for high-performance operations by treating data at the binary level. In Competitive Programming, these tricks can reduce time complexity and simplify logic.
## ⚡ Quick Reference: One-Liner Hacks

| Operation | Code Snippet | Result |
| --- | --- | --- |
| **Parity Check** | `x & 1` | `1` if odd, `0` if even |
| **Clear Lowest Set Bit** | `x & (x - 1)` | Removes the rightmost `1` bit |
| **Extract Lowest Set Bit** | `x & -x` | Isolates the rightmost `1` bit |
| **Power of 2 Check** | `x && !(x & (x - 1))` | Returns `true` if  |
| **Divide by 2** | `x >> 1` | Integer division by 2 |
| **Multiply by 2** | `x << 1` | Multiplication by 2 |
| **Upper to Lower** | `ch | ' '` | Sets 5th bit (e.g., 'A' → 'a') |
| **Lower to Upper** | `ch & '_'` | Clears 5th bit (e.g., 'a' → 'A') |

## 🎯 Manipulating the -th Bit

*Note: Using 1-based indexing for .*

> [!tip] Logic
> To target a specific bit, use a **mask**: `(1 << (k - 1))`.

* **Check if -th bit is set:** `(n & (1 << (k - 1))) != 0`
* **Turn ON -th bit:** `n | (1 << (k - 1))`
* **Turn OFF -th bit:** `n & ~(1 << (k - 1))`
* **Toggle -th bit:** `n ^ (1 << (k - 1))`

## 🧹 Clearing Ranges

* **Clear LSB to -th bit:**
```cpp
mask = ~((1 << (i + 1)) - 1);
x &= mask;

```

* **Clear MSB to -th bit:**
```cpp
mask = (1 << i) - 1;
x &= mask;

```

### 1. Brian Kernighan’s Algorithm (Count Set Bits)

Repeatedly clears the lowest set bit until the number becomes zero.
```cpp
int countSetBits(int x) {
    int count = 0;
    while (x) {
        x &= (x - 1); 
        count++;
    }
    return count;
}

```

### 2. Find Log base 2 (Integer)

```cpp
int log2(int x) {
    int res = 0;
    while (x >>= 1) res++;
    return res;
}

```
## 💡 Important Logic Notes

* **Negative Numbers:** In C++, `-x` is represented as 2's complement (`~x + 1`). This is why `x & -x` extracts the lowest set bit.
* **LSB (Least Significant Bit):** The rightmost bit.
* **MSB (Most Significant Bit):** The leftmost bit.
* **Built-in Functions (GCC):**
* `__builtin_popcount(x)`: Counts set bits.
* `__builtin_clz(x)`: Counts leading zeros.
* `__builtin_ctz(x)`: Counts trailing zeros.

```cpp
#include <iostream>
using namespace std;

int main() {
    // Let's track which toys we played with today
    // Toys: Car(0), Doll(1), Ball(2), Blocks(3)
    
    int toys = 0; // Start with no toys played: 0000
    
    // Played with Car (bit 0)
    toys |= (1 << 0); // toys = 0001
    
    // Played with Blocks (bit 3)
    toys |= (1 << 3); // toys = 1001
    
    // Did we play with Ball (bit 2)?
    if (toys & (1 << 2)) {
        cout << "Yes, played with Ball!\n";
    } else {
        cout << "No Ball today\n"; // This prints
    }
    
    // Stop playing with Car
    toys &= ~(1 << 0); // toys = 1000
    
    // Toggle Doll (play if not playing, stop if playing)
    toys ^= (1 << 1); // toys = 1010
    
    // Print all toys we're playing with
    cout << "Current toys: ";
    for (int i = 0; i < 4; i++) {
        if (toys & (1 << i)) {
            cout << "Toy#" << i << " ";
        }
    }
    // Output: Toy#1 Toy#3 (Doll and Blocks)
    
    return 0;
}

// Common operations:
int mask = 0;

// Set bit i:          mask |= (1 << i)
// Clear bit i:        mask &= ~(1 << i)
// Toggle bit i:       mask ^= (1 << i)
// Check bit i:        if (mask & (1 << i))
// Clear all bits:     mask = 0
// Set all n bits:     mask = (1 << n) - 1
// Count set bits:     __builtin_popcount(mask)
```

##  Visual Memory Trick

Think of each bit as a **light switch**:
- `|` is the **ON switch**
- `& ~` is the **OFF switch**
- `^` is the **FLIP switch**
- `&` is the **LOOK switch** (just looking, not changing!)

#### Get Least Significant Bit (LSB)
```cpp
int A = 40;           // 000...000101000
int lsb = A & (-A);   // 8 (000...000001000)
// Finds the rightmost '1' bit

// How it works:
//  A =  40: 000...000101000
// -A = -40: 111...111011000 (two's complement)
//           ----------------- AND
// Result:   000...000001000 (isolates rightmost 1)
```

#### Turn On All Bits in Set of Size n
```cpp
int n = 5;
int all_on = (1 << n) - 1;  // 11111 (decimal 31)
// ⚠️ Be careful with overflow!
```

#### Iterate Through All Subsets
```cpp
// Generate all 2^n subsets
int n = 4;
for (int mask = 0; mask < (1 << n); mask++) {
    // mask goes: 0000, 0001, 0010, 0011, ..., 1111
    cout << "Subset: " << mask << endl;
}
```

#### Iterate Through Subsets of a Subset
```cpp
// Given subset y, iterate through all its subsets
int y = 13;  // 1101
for (int x = y; x > 0; x = (y & (x - 1))) {
    cout << x << " ";  // Prints: 13, 12, 9, 8, 5, 4, 1
}
// Excludes empty set (0)
```

```cpp

// Common operations:
int mask = 0;
// Set bit i:          mask |= (1 << i)
// Clear bit i:        mask &= ~(1 << i)
// Toggle bit i:       mask ^= (1 << i)
// Check bit i:        if (mask & (1 << i))
// Clear all bits:     mask = 0
// Set all n bits:     mask = (1 << n) - 1
// Count set bits:     __builtin_popcount(mask)
// Get LSB:            mask & (-mask)

### 🧮 Real Problem: Sum of All Subsets
// Given a set of numbers, find sum of all subsets
int sum_of_all_subsets(vector s) {
    int n = s.size();
    int results[1 << n];  // Array for 2^n subsets
    memset(results, 0, sizeof(results));
    
    // Iterate through all 2^n subsets
    for (int i = 0; i < (1 << n); i++) {      // O(2^n)
        for (int j = 0; j < n; j++) {         // O(n)
            if ((i & (1 << j)) != 0) {        // Is jth item in subset i?
                results[i] += s[j];           // Add it to sum
            }
        }
    }
    
    // Better approach using math:
    // Each element appears in 2^(n-1) subsets
    // Total sum = 2^(n-1) × (sum of all elements)
}
```

### 📊 Understanding "Each Element in 2^(n-1) Subsets"
For set {a, b, c} (n=3):
- Element **a** appears in: {a}, {a,b}, {a,c}, {a,b,c} → **4 = 2^(3-1)** subsets
- Why? For each element, others can be IN or OUT → 2^(n-1) combinations

So: **Total sum = 2^(n-1) × (a + b + c)**

## 🎯 Quick Reference Card
```cpp
// Set operations (modify mask)
mask |= (1 << i)      // Add element i
mask &= ~(1 << i)     // Remove element i  
mask ^= (1 << i)      // Toggle element i
mask = 0              // Empty set
mask = (1 << n) - 1   // Full set of n elements

// Query operations (check without modifying)
if (mask & (1 << i))  // Is element i present?
int lsb = mask & (-mask)  // Get rightmost set bit
int count = __builtin_popcount(mask)  // Count set bits

// Iteration patterns
for (int m = 0; m < (1 << n); m++)           // All subsets
for (int m = mask; m > 0; m = (mask & (m-1))) // Subsets of mask

// Fast arithmetic
x << k  // Multiply by 2^k
x >> k  // Divide by 2^k (rounds down)
```

### Illustration: Solving the Job Assignment Problem
Using a simple problem, I will illustrate how to solve and implement problems which use dp+bitmask concepts.
Problem link: https://docs.google.com/document/d/1zuw8hBXHsiTYTH8u986fQhn8TWfpOk9BQBIRH3lo_W8/edit?tab=t.0
Solution: https://youtu.be/685x-rzOIlY

### Illustration: Travelling Salesman Problem
Another great problem to illustrate bitmask dp.
I will discuss the following:
1. What is the TSP?
2. Brute force solution.
3. Intuition towards an efficient solution.
4. Define a DP state, write a recurrence.
5. How do I implement this? ANS: bitmasking!
6. Analyzing time and space complexities.

Link: https://youtu.be/QukpHtZMAtM

#### Codeforces Problem: Div2E
I'll discuss a problem named Fish that comes from a Codeforces Division 2 round.
Problem link: https://codeforces.com/contest/16/problem/E
Solution: https://youtu.be/d7kvyp6dfz8

#### Codechef long Challenge: Medium
The problem comes from Codechef long challenge and is rated MEDIUM by codechef.
Problem link: https://www.codechef.com/problems/TSHIRTS
Solution: https://youtu.be/Smem2tVQQXU

#### CSES: Counting Tilings
The problem comes from CSES problemset and was introduced to the problemset in 2021.
Problem link: https://cses.fi/problemset/task/2181
Solution: https://youtu.be/lPLhmuWMRag

#### Practice Problems:
1. https://atcoder.jp/contests/dp/tasks/dp_o
2. https://atcoder.jp/contests/dp/tasks/dp_u
3. https://www.codechef.com/JAN13/problems/LEALCO
4. https://www.spoj.com/problems/HIST2/
5. https://codeforces.com/problemset/problem/895/C

**References** 
https://codeforces.com/blog/entry/18169
https://codeforces.com/blog/entry/81516
https://github.com/yash7xm/cp_notes

#ref #dsa 