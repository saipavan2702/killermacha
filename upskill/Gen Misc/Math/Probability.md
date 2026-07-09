# Probability

### 1. Events vs. Outcomes & Sample Spaces

Probability is about **events** (sets of outcomes), not single outcomes. The **sample space** is every possible thing that could happen.

- **Formula:** $P(E) = \frac{\text{Outcomes in Event}}{\text{Total Outcomes}}$

> **Example 1 (Marbles):** A bag has 10 unique marbles (5 Red, 3 Blue, 2 Green). Drawing "a red marble" isn't one outcome; it's an event containing 5 specific outcomes (Red 1, Red 2, Red 3, Red 4, Red 5).
> $$P(\text{Red}) = \frac{5}{10} = 50\%$$

> **Example 2 (Coins):** Flip 2 coins. Sample space = {HH, HT, TH, TT}. The event "at least one head" contains 3 outcomes {HH, HT, TH}.
> $$P(\text{At least one head}) = \frac{3}{4} = 75\%$$

> **Example 3 (Die Roll):** Roll a 6-sided die. Sample space = {1, 2, 3, 4, 5, 6}. Event = "rolling an even number" = {2, 4, 6}.
> $$P(\text{Even}) = \frac{3}{6} = 50\%$$

> **Example 4 (Cards):** Draw one card from a standard 52-card deck. Event = "drawing a face card" = {J, Q, K} across 4 suits = 12 cards.
> $$P(\text{Face Card}) = \frac{12}{52} \approx 23.1\%$$

💡 **Tip:** Always define the sample space first. Treat events as groupings, not single points.

---

### 2. The Three Axioms of Probability

Every probability calculation follows three mathematical laws.

1. $P(E) \ge 0$ — Cannot be negative.
2. $P(\text{Sample Space}) = 1$ — Something must happen (100% chance).
3. $P(A \cup B) = P(A) + P(B)$ — If events **cannot overlap**, just add them.

> **Example 1 (Die):** Roll a die. Event A (less than 3) = {1, 2}. Event B (roll a 5) = {5}. They can't happen simultaneously. By Axiom 3:
> $$P(A \text{ or } B) = \frac{2}{6} + \frac{1}{6} = \frac{3}{6} = 50\%$$

> **Example 2 (Cards):** Draw one card. Event A = "draw a Club" = {13 cards}. Event B = "draw a Diamond" = {13 cards}. These can't both happen (a card can't be both suits).
> $$P(\text{Club or Diamond}) = \frac{13}{52} + \frac{13}{52} = \frac{26}{52} = 50\%$$

> **Example 3 (Impossible vs. Certain):** Roll a die. $P(\text{roll a 7}) = 0$ (impossible — violates nothing, just zero). $P(\text{roll 1, 2, 3, 4, 5, or 6}) = 1$ (certain — the whole sample space).

💡 **Tip:** Axiom 3 only works when events have **no overlap**. If they can overlap, use the full OR rule (Section 3).

---

### 3. Combining Events (NOT, AND, OR)

We use set operations when real-life events overlap or get messy.

#### NOT (Complement): $P(\text{not } A) = 1 - P(A)$

> **Example 1 (Cards):** $P(\text{Not a King}) = 1 - \frac{4}{52} = \frac{48}{52} \approx 92.3\%$

> **Example 2 (Coin flips shortcut):** Probability of "at least one head" in 3 coin flips?
> - Complement = all tails = $(\frac{1}{2})^3 = \frac{1}{8}$
> - $P(\text{at least one head}) = 1 - \frac{1}{8} = \frac{7}{8} = 87.5\%$

> **Example 3 (Password):** What's the chance a random 1-digit number is **not** a prime? Primes in {1–9}: {2, 3, 5, 7} → 4 primes.
> $P(\text{not prime}) = 1 - \frac{4}{9} = \frac{5}{9} \approx 55.6\%$

#### AND (Intersection): Both events happen together

> **Example 1 (Cards):** A card that is a King **AND** a Heart → only 1 such card (King of Hearts). $P = \frac{1}{52}$

> **Example 2 (Die + Coin):** Roll an even number AND flip heads.
> $P(\text{even}) = \frac{1}{2}$, $P(\text{heads}) = \frac{1}{2}$. Since independent:
> $P(\text{both}) = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4} = 25\%$

#### OR (Addition Rule): $P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$

> **Example 1 (Cards):** $P(\text{King or Heart})$
> $= \frac{4}{52} + \frac{13}{52} - \frac{1}{52} = \frac{16}{52} \approx 30.8\%$
> *(Subtract 1 because the King of Hearts was counted twice)*

> **Example 2 (Cards):** $P(\text{Red Card or Face Card})$
> $= \frac{26}{52} + \frac{12}{52} - \frac{6}{52} = \frac{32}{52} \approx 61.5\%$
> *(6 red face cards: J♥ Q♥ K♥ J♦ Q♦ K♦)*

> **Example 3 (Students):** 30 students. 18 play football, 12 play basketball, 5 play both.
> $P(\text{football or basketball}) = \frac{18}{30} + \frac{12}{30} - \frac{5}{30} = \frac{25}{30} \approx 83.3\%$

---

### 4. Counting Rules

Used when possibilities are in the millions. Always ask: **"Can I repeat?"** and **"Does order matter?"**

#### Repetition Allowed: $n^k$

> **Example 1 (PIN):** 4-digit PIN code. 10 choices per digit.
> $10^4 = 10{,}000$ possible PINs.

> **Example 2 (Password):** 3-character password using only lowercase letters (26 choices each).
> $26^3 = 17{,}576$ possible passwords.

> **Example 3 (Coin Flips):** How many outcomes in 5 coin flips?
> $2^5 = 32$ outcomes.

#### No Repetition + Order Matters (Permutations): Multiply down $k$ times

> **Example 1 (Roles):** Choosing President, VP, and Secretary from 10 people. Roles matter (Alice as President ≠ Alice as VP).
> $10 \times 9 \times 8 = 720$ possibilities.

> **Example 2 (Race):** 8 runners. How many ways can 1st, 2nd, and 3rd place be awarded?
> $8 \times 7 \times 6 = 336$ ways.

> **Example 3 (Letters):** How many 4-letter arrangements from {A, B, C, D, E} with no repeats?
> $5 \times 4 \times 3 \times 2 = 120$ arrangements.

#### No Repetition + Order Doesn't Matter (Combinations): Divide by redundant arrangements

> **Example 1 (Committee):** 3-person committee from 10 people. Order doesn't matter (ABC = CAB).
> $\frac{10 \times 9 \times 8}{3!} = \frac{720}{6} = 120$ committees.

> **Example 2 (Lottery):** Pick 6 numbers from 1–49. Order doesn't matter.
> $\frac{49!}{6! \cdot 43!} = 13{,}983{,}816$ combinations — roughly a 1 in 14 million chance!

> **Example 3 (Pizza):** Pizza shop has 8 toppings. You pick any 3. How many unique combinations?
> $\frac{8 \times 7 \times 6}{3!} = \frac{336}{6} = 56$ combinations.

---

### 5. Conditional Probability

Probability **updates** when you get new information, shrinking your "universe".

- **Formula:** $P(A|B) = \frac{P(A \text{ and } B)}{P(B)}$

> **Example 1 (Marbles without replacement):** Bag of 10 marbles (5 red, 5 blue). Draw blue, don't replace. New universe = 9 marbles.
> $P(\text{Red second} \mid \text{Blue first}) = \frac{5}{9}$

> **Example 2 (Family):** A family has 2 children. At least one is a girl. Sample space shrinks from {BB, BG, GB, GG} → {BG, GB, GG}.
> $P(\text{both are girls}) = \frac{1}{3}$

> **Example 3 (Cards):** You draw a card and see it's a face card. What's the probability it's a King?
> - Face cards: 12. Kings that are face cards: 4.
> $P(\text{King} \mid \text{Face Card}) = \frac{4}{12} = \frac{1}{3} \approx 33.3\%$

> **Example 4 (Weather):** 70% chance of rain tomorrow. If it rains, 90% chance of traffic. If no rain, 20% chance of traffic. What's the probability of traffic given it rained?
> Already given: $P(\text{Traffic} \mid \text{Rain}) = 90\%$ — this is directly the conditional probability stated in the problem.

💡 **Tip:** Whenever a problem says "given that…" or "you know that…" — that's a conditional probability problem. Eliminate impossible outcomes from your sample space.

---

### 6. Joint & Marginal Probability / Independence

Used to track **two events at once** via a table. **Joint** = both happen together (cells); **Marginal** = overall chance of one event (row/column totals).

- **Independence Test:** $P(A \text{ and } B) = P(A) \times P(B)$

> **Example 1 (Dependent — Exams):** 100 students take two exams.
> - $P(\text{Pass Midterm}) = 60\%$, $P(\text{Pass Final}) = 55\%$
> - If independent: $60\% \times 55\% = 33\%$ should pass both.
> - Actual: 50% pass both → **Dependent** (studying for one helps the other).

> **Example 2 (Independent — Die + Coin):** Roll a die and flip a coin.
> $P(\text{6 and Heads}) = \frac{1}{6} \times \frac{1}{2} = \frac{1}{12}$. Confirmed independent.

> **Example 3 (Reading a joint table):**
>
> |              | Coffee | No Coffee | Total |
> |--------------|--------|-----------|-------|
> | Morning person | 40   | 10        | 50    |
> | Night person   | 20   | 30        | 50    |
> | **Total**      | 60   | 40        | 100   |
>
> - $P(\text{Coffee and Morning}) = \frac{40}{100} = 40\%$ ← **Joint**
> - $P(\text{Morning}) = \frac{50}{100} = 50\%$ ← **Marginal**
> - Test: $P(\text{Coffee}) \times P(\text{Morning}) = 60\% \times 50\% = 30\% \ne 40\%$ → **Dependent**

---

### 7. Random Variables & Expected Value

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

### 8. Continuous vs. Discrete Variables (PMF vs. PDF)

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

### 9. Law of Total Probability

Break multi-path problems down, calculate each route, and sum them.

$$P(B) = P(B \mid A_1)P(A_1) + P(B \mid A_2)P(A_2) + \ldots$$

> **Example 1 (Two Bags):** Bag A (70% chance to pick, 50% Blue). Bag B (30% chance, 87.5% Blue).
> - Path 1: Pick A & draw Blue = $0.70 \times 0.50 = 35\%$
> - Path 2: Pick B & draw Blue = $0.30 \times 0.875 = 26.25\%$
> - **Total:** $35\% + 26.25\% = \mathbf{61.25\%}$

> **Example 2 (Factory defects):** Factory A makes 60% of products (3% defect rate). Factory B makes 40% (5% defect rate). What's the overall defect rate?
> - Path 1: From A & defective = $0.60 \times 0.03 = 1.8\%$
> - Path 2: From B & defective = $0.40 \times 0.05 = 2.0\%$
> - **Total defect rate:** $1.8\% + 2.0\% = \mathbf{3.8\%}$

> **Example 3 (Umbrella):** 60% chance of rain (in which case 95% chance you bring an umbrella). 40% no rain (in which case 10% chance you bring one anyway).
> $P(\text{umbrella}) = 0.60 \times 0.95 + 0.40 \times 0.10 = 0.57 + 0.04 = \mathbf{61\%}$

---

### 10. Bayes' Rule

The formula for **updating beliefs** when given new evidence. Flips a conditional probability around.

$$P(A|B) = \frac{P(B|A) \times P(A)}{P(B)}$$

> **Example 1 (Disease Test):** Disease affects 1% of people. Test is 99% accurate.
> Out of 1000 people:
> - 10 have the disease → ~10 test positive ✅
> - 990 don't → ~10 false positives ❌
> - Total positives: ~20. Actually sick: 10.
> $$P(\text{Disease} \mid \text{Positive}) = \frac{10}{20} = 50\%$$
> Even a very accurate test can be misleading with rare diseases!

> **Example 2 (Marbles — reverse the question):** From the Law of Total Probability example, $P(\text{Blue}) = 61.25\%$. If you drew Blue, what's the chance it came from Bag A?
> $$P(\text{Bag A} \mid \text{Blue}) = \frac{P(\text{Blue} \mid \text{Bag A}) \times P(\text{Bag A})}{P(\text{Blue})} = \frac{35\%}{61.25\%} \approx 57.1\%$$

> **Example 3 (Email spam):** 30% of emails are spam. Spam emails contain the word "FREE" 80% of the time. Legitimate emails contain it 5% of the time. An email says "FREE" — is it spam?
> - $P(\text{"FREE"} \mid \text{Spam}) = 0.80$, $P(\text{Spam}) = 0.30$
> - $P(\text{"FREE"}) = 0.30 \times 0.80 + 0.70 \times 0.05 = 0.24 + 0.035 = 0.275$
> $$P(\text{Spam} \mid \text{"FREE"}) = \frac{0.80 \times 0.30}{0.275} \approx \mathbf{87.3\%}$$

> **Example 4 (Intuition):** Bayes' Rule = "How surprised should I be by this evidence?" Rare causes stay unlikely even with evidence — but evidence does update them.

---

### 11. Recursive Probability

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


---

## References

> [!info] Source trail
> Kept here because it directly supports this note.

- [Give Me 1 Hour, I'll Make Probability Click Forever](https://www.youtube.com/watch?v=H6pWY2VQ9xI) - Probability intuition.

#probability #mathematics
