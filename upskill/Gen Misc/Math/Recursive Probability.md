> [!summary]
> Recursive probability defines an expected result in terms of returning to the same state after an incomplete attempt.

Map: [[Upskill/Gen Misc/Math/Math|Math]]
Connections: [[Upskill/Gen Misc/Math/Random Variables|Random Variables]]

## 11. Recursive Probability

A shortcut for **infinite sequences** where the answer depends on itself. Set up an algebraic equation based on the very first step.

> **Example 1 (First Heads):** How many coin flips expected until the first Heads?
> Let $E$ = expected flips.
> - Flip costs 1 flip always.
> - Heads (½ chance): done, 0 more flips.
> - Tails (½ chance): restart, expect $E$ more.
> $$E = 1 + \frac{1}{2}(0) + \frac{1}{2}(E) \implies \frac{E}{2} = 1 \implies E = 2$$

> **Example 2 (Rolling a 6):** How many die rolls expected to get a 6?
> Let $E$ = expected rolls.
> - Each roll costs 1.
> - Roll 6 ($\frac{1}{6}$ chance): done.
> - Don't roll 6 ($\frac{5}{6}$ chance): restart, expect $E$ more.
> $$E = 1 + \frac{5}{6}(E) \implies \frac{E}{6} = 1 \implies E = 6 \text{ rolls}$$

> **Example 3 (General Rule):** For any event with probability $p$, the expected number of tries until it happens = $\frac{1}{p}$.
> - $P = \frac{1}{2}$ (coin flip) → $E = 2$
> - $P = \frac{1}{6}$ (die) → $E = 6$
> - $P = \frac{1}{52}$ (specific card) → $E = 52$

> **Example 4 (Two Heads in a row):** Expected flips to get HH consecutively?
> Let $E$ = expected flips from scratch.
> - Flip Tails ($\frac{1}{2}$): restart → $E$ more.
> - Flip Heads ($\frac{1}{2}$): now need one more.
>   - Flip Heads again ($\frac{1}{2}$): done! Total extra = 1.
>   - Flip Tails ($\frac{1}{2}$): restart → $E$ more. Total extra = 1 + $E$.
> $$E = 1 + \frac{1}{2}(E) + \frac{1}{2}\left[1 + \frac{1}{2}(1) + \frac{1}{2}(1 + E)\right]$$
> Solving: $E = 6$ flips expected to get HH in a row.

*💡 General Study Tip: For each topic, try to create your own example — change the numbers or context. If you can make up a problem and solve it, you truly understand the concept.*
