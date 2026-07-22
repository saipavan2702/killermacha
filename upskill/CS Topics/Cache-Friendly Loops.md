> [!summary]
> Loop order affects spatial locality: traversing contiguous memory usually matters more than the surface shape of the algorithm.

Map: [[DSA]]
Connections: [[Upskill/CS Topics/Computer Science|Computer Science]]

✅ Best (IKJ order @ ~110-200ms):
```cpp

for (int i = 0; i < rows; i++) {
    for (int k = 0; k < inner; k++) {
        for (int j = 0; j < cols; j++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
```

⚠️ Standard (IJK order @ ~1700ms):
```cpp
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        for (int k = 0; k < inner; k++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
```

❌ Worst (JKI order @ 5000ms+):
```cpp
for (int j = 0; j < cols; j++) {
    for (int k = 0; k < inner; k++) {
        for (int i = 0; i < rows; i++) {
            out[j + i*cols] += a[k + i*inner] * b[j + k*cols];
        }
    }
}
Same math, 50x performance difference just from loop order!
```

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
cppfor (j...)
    for (k...)
        for (i...)  // ← INNERMOST
            C[i][j] += A[i][k] * B[k][j]
            //  ↑ i increments → JUMPS by rows in both C and A!

C[i][j]: i increments → jumps by entire row ❌
A[i][k]: i increments → jumps by entire row ❌
All three arrays accessed poorly!
```



#dsa
