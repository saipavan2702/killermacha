> [!summary]
> A one-bit mask such as `1 << i` targets bit `i`; combine it with OR, AND, XOR, or complement to update and query state.

Map: [[Upskill/DSA/Algorithms/Bitmasking/Bitmasking|Bitmasking]]
Connections: [[Upskill/DSA/Algorithms/Bitmasking/Subset Enumeration|Subset Enumeration]], [[Upskill/DSA/Algorithms/Bitmasking/Bitmask Dynamic Programming|Bitmask Dynamic Programming]]

## Core Operations

```cpp
bool present = (mask & (1 << i)) != 0; // query
mask |= (1 << i);                       // set
mask &= ~(1 << i);                      // clear
mask ^= (1 << i);                       // toggle
```

Think of each bit as a switch:

- `|` turns a switch on
- `& ~` turns it off
- `^` flips it
- `&` inspects it

## Quick Reference

| Operation | Expression | Meaning |
| --- | --- | --- |
| Check parity | `x & 1` | `1` when `x` is odd |
| Clear lowest set bit | `x & (x - 1)` | Removes the rightmost `1` |
| Extract lowest set bit | `x & -x` | Isolates the rightmost `1` |
| Check positive power of two | `x > 0 && !(x & (x - 1))` | Exactly one bit is set |
| Multiply by `2^k` | `x << k` | Left shift |
| Divide by `2^k` | `x >> k` | Integer right shift for non-negative `x` |
| First `n` bits on | `(1 << n) - 1` | Mask `00...011...1` |

## Clear a Range

Clear bits `0` through `i`:

```cpp
x &= ~((1 << (i + 1)) - 1);
```

Clear bit `i` and every more-significant bit:

```cpp
x &= (1 << i) - 1;
```

Use a wider type such as `1LL << i` when `i` may exceed the width of `int`.

## Count Set Bits

Brian Kernighan's algorithm clears one set bit per iteration.

```cpp
int countSetBits(unsigned int x) {
    int count = 0;
    while (x != 0) {
        x &= x - 1;
        ++count;
    }
    return count;
}
```

Useful compiler built-ins include:

```cpp
__builtin_popcount(x);   // set bits in unsigned int
__builtin_popcountll(x); // set bits in unsigned long long
__builtin_clz(x);        // leading zeros; x must be non-zero
__builtin_ctz(x);        // trailing zeros; x must be non-zero
```

## Why `x & -x` Works

In two's-complement arithmetic, `-x` is `~x + 1`. Every bit below the least-significant `1` becomes zero in both values, leaving only that lowest set bit in the AND result.

```cpp
int x = 40;       // 101000
int lsb = x & -x; // 001000 = 8
```

#dsa #bitmasking
