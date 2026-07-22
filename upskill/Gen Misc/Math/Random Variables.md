> [!summary]
> Random variables assign values to outcomes; expectation and probability distributions summarize how those values behave.

Map: [[Upskill/Gen Misc/Math/Math|Math]]
Connections: [[Upskill/Gen Misc/Math/Conditional Probability|Conditional Probability]], [[Upskill/Gen Misc/Math/Recursive Probability|Recursive Probability]]

## 7. Random Variables & Expected Value

A **Random Variable** translates random outcomes into numbers. **Expected Value (EV)** is the long-run weighted average.

- **Formula:** $E = \sum (\text{Probability} \times \text{Value})$

> **Example 1 (Random Variable — Coins):** Flip 2 coins. Win $5 per Head, lose $2 per Tail.
> - HH → +$10, HT → +$3, TH → +$3, TT → -$4

> **Example 2 (Fair Game — Die):** Roll a die.
> - Roll 6 → win $12 ($P = \frac{1}{6}$)
> - Roll 4 or 5 → win $3 ($P = \frac{2}{6}$)
> - Roll 1–3 → lose $6 ($P = \frac{3}{6}$)
> $$EV = \frac{1}{6}(12) + \frac{2}{6}(3) + \frac{3}{6}(-6) = 2 + 1 - 3 = \$0$$
> This is a **fair game**.

> **Example 3 (Lottery ticket):** A $2 ticket has: 50% chance to win $0, 40% chance to win $1, 9% chance to win $5, 1% chance to win $20.
> $$EV = 0.5(0) + 0.4(1) + 0.09(5) + 0.01(20) = 0 + 0.4 + 0.45 + 0.2 = \$1.05$$
> You pay $2 to get back $1.05 on average → **bad bet**.

> **Example 4 (Insurance analogy):** Your phone is worth $800. 2% chance it breaks. An insurer charges $20/year. Is it worth it?
> $$EV(\text{no insurance}) = 0.02 \times (-800) + 0.98 \times 0 = -\$16$$
> You lose $16 on average, but insurance costs $20 → mathematically, skip it. But peace of mind has value too!

💡 **Tip (Linearity of Expectation):** $E(X + Y) = E(X) + E(Y)$ always — even if X and Y depend on each other.

---

## 8. Continuous vs. Discrete Variables (PMF vs. PDF)

- **Discrete (PMF):** Exact values you can count (coin flips, die rolls, number of goals scored).
- **Continuous (PDF):** Smooth measurements (time, weight, length). The probability of one **exact** value is mathematically zero — you can only ask for ranges.

> **Example 1 (Bread slicer):** Bread is sliced uniformly between 14 and 18 inches.
> - $P(\text{exactly 16.000... inches}) = 0\%$ (one exact point in a continuous range)
> - $P(\text{between 15 and 17 inches}) = \frac{2}{4} = 50\%$ ← area of rectangle: 2 wide × ¼ tall

> **Example 2 (Bus arrival):** A bus arrives uniformly within 0–10 minutes.
> - $P(\text{wait exactly 3 minutes}) = 0\%$
> - $P(\text{wait less than 4 minutes}) = \frac{4}{10} = 40\%$

> **Example 3 (Discrete — Die rolls):** Roll a die 3 times. X = number of sixes. X can only be 0, 1, 2, or 3 — these are distinct, countable values → **discrete**.

> **Example 4 (Continuous — Exam time):** Students finish an exam in 45–90 minutes (uniform distribution).
> $P(\text{finish in 60–75 min}) = \frac{15}{45} = \frac{1}{3} \approx 33.3\%$

💡 **Tip:** If you can say "exactly," it's probably discrete. If you need "between X and Y," it's continuous.

---
