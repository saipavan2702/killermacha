Tags: #computer-science

> [!summary]
> Loop order affects spatial locality: traversing contiguous memory usually matters more than the surface shape of the algorithm.

For row-major matrices, the `i-k-j` loop order reuses `A[i][k]` and reads across rows of `B` and `C` contiguously. It is often faster than `i-j-k`, but the actual gain depends on matrix size, compiler, and hardware; benchmark representative workloads before drawing conclusions.

## Recorded comparison

These are the timings preserved from the original note. The machine, compiler, matrix dimensions, and benchmark method were not recorded, so treat them as historical results—not a portable promise. Re-run the same workload on your target system before comparing implementations.

| Classification | Loop order | Recorded time |
| --- | --- | ---: |
| Best | `i-k-j` | ~110–200 ms |
| Standard | `i-j-k` | ~1,700 ms |
| Worst | `j-k-i` | 5,000 ms+ |

## `i-k-j` order

```cpp
for (int i = 0; i < rows; i++) {
    for (int k = 0; k < inner; k++) {
        for (int j = 0; j < cols; j++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
```

## `i-j-k` order

```cpp
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        for (int k = 0; k < inner; k++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
```

## `j-k-i` order

```cpp
for (int j = 0; j < cols; j++) {
    for (int k = 0; k < inner; k++) {
        for (int i = 0; i < rows; i++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
```

All three orders compute the same matrix product. Their memory-access patterns differ; there is no fixed performance multiplier that applies to every machine or input size.

For `C = A × B`, you have three nested loops with indices `i, j, k`:

The core operation:
`C[i][j] += A[i][k] * B[k][j]`

Why IKJ is fastest:
```cpp
for (i...)
    for (k...)
        for (j...)  // ← INNERMOST
            C[i][j] += A[i][k] * B[k][j]
            //  ↑ j increments → sequential in both C and B!

C[i][j]: j increments → sequential access ✅
B[k][j]: j increments → sequential access ✅
A[i][k]: k is constant in inner loop → same value reused ✅
```

Why JKI is worst:
```cpp
for (j...)
    for (k...)
        for (i...)  // ← INNERMOST
            C[i][j] += A[i][k] * B[k][j]
            //  ↑ i increments → JUMPS by rows in both C and A!

C[i][j]: i increments → jumps by an entire row ❌
A[i][k]: i increments → jumps by an entire row ❌
B[k][j]: j and k are fixed in the inner loop, so this value is reused.
```
