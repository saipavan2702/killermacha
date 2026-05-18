## Morse Code 

## The Core Idea

Every Morse code letter is just a path through a tree. Starting from the top, each step you take either adds a **dot** (go left) or a **dash** (go right). When you stop, you've spelled out the code.

## The Two Rules

| Direction | Morse Symbol |
|-----------|-------------|
| ← Left    | · (dot)     |
| → Right   | − (dash)    |

---

## The Tree (Visual Map)

```
                        [ ]
                       /   \
                      E     T
                    (·)     (−)
                   /   \   /   \
                  I     A  N    M
                /  \  /  \ | \  | \
               S   U  R   W D  K  G  O
```

### Full Tree — Level by Level

```
Level 1:  E  T
Level 2:  I  A  N  M
Level 3:  S  U  R  W  D  K  G  O
Level 4:  H  V  F  _  L  _  P  J  B  X  C  Y  Z  Q
```

> `_` = intentional blank space (no letter assigned at that position)

---

## How to Read the Tree

Each letter's Morse code = the path from the **top** down to **that letter**.

| Letter | Path | Morse Code |
|--------|------|------------|
| E | Left | `·` |
| T | Right | `−` |
| I | Left, Left | `· ·` |
| A | Left, Right | `· −` |
| N | Right, Left | `− ·` |
| M | Right, Right | `− −` |
| S | Left, Left, Left | `· · ·` |
| O | Right, Right, Right | `− − −` |
| B | Right, Left, Left, Left | `− · · ·` |

---

## The Mnemonic Story (Memorize the Letter Order)

To remember which letter goes where in the tree *(read left-to-right, level by level)*, use this bizarre story:

> 1. Imagine an **E.T.** whose name is **Ian** → **E – T – I – A – N**
> 2. He is open-minded and says, **"Mm, sure"** → **M – S – U – R**
> 3. He grabs a can of **WD-40** and says **"Kay, go"** → **W – D – K – G – O**
> 4. He uses the oil to turn on a **High Voltage Frequency** (then pauses — blank space) → **H – V – F – [blank]**
> 5. He laughs **"L-O-L"** (then pauses again — another blank space) → **L – [blank]**
> 6. He puts on his **PJs** and gets into a **box** → **P – J – B – X**
> 7. The box is size **Q**, but remember the slight stretch: → **C – Y – Z – Q**

Reading left to right across Level 4 gives:
`H  V  F  _  L  _  P  J  B  X  C  Y  Z  Q`

---

## Worked Examples

### E = `·`
- Start at top → go **Left** (dot)
- Code: **·**

### S = `· · ·`
- Top → **Left** (dot) → reach E
- E → **Left** (dot) → reach I
- I → **Left** (dot) → reach S
- Code: **· · ·**

### O = `− − −`
- Top → **Right** (dash) → reach T
- T → **Right** (dash) → reach M
- M → **Right** (dash) → reach O
- Code: **− − −**

### B = `− · · ·`
- Top → **Right** → T
- T → **Left** → N
- N → **Left** → D
- D → **Left** → B
- Code: **− · · ·**

---

## Complete Morse Code Reference

| Letter | Code    | Letter | Code    |
|--------|---------|--------|---------|
| A      | `· −`   | N      | `− ·`   |
| B      | `− · · ·` | O    | `− − −` |
| C      | `− · − ·` | P    | `· − − ·` |
| D      | `− · ·` | Q      | `− − · −` |
| E      | `·`     | R      | `· − ·` |
| F      | `· · − ·` | S    | `· · ·` |
| G      | `− − ·` | T      | `−`     |
| H      | `· · · ·` | U    | `· · −` |
| I      | `· ·`   | V      | `· · · −` |
| J      | `· − − −` | W    | `· − −` |
| K      | `− · −` | X      | `− · · −` |
| L      | `· − · ·` | Y    | `− · − −` |
| M      | `− −`   | Z      | `− − · ·` |

---

## Practice Tips

1. **Draw the tree from memory** using only the mnemonic story.
2. **Trace before you look** — guess a letter's code by walking the tree in your head, then check.
3. **Start with common letters** — E, T, I, A, N, M, S, O cover a huge portion of English text.
4. **Work in reverse** — hear a code (e.g. `− · · ·`) and walk right-left-left-left to land on **B**.