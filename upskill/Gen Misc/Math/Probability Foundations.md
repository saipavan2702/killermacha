> [!summary]
> Events, axioms, set operations, and counting rules form the vocabulary needed for every later probability problem.

Map: [[Upskill/Gen Misc/Math/Math|Math]]

## 1. Events vs. Outcomes & Sample Spaces

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

## 2. The Three Axioms of Probability

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

## 3. Combining Events (NOT, AND, OR)

We use set operations when real-life events overlap or get messy.

### NOT (Complement): $P(\text{not } A) = 1 - P(A)$

> **Example 1 (Cards):** $P(\text{Not a King}) = 1 - \frac{4}{52} = \frac{48}{52} \approx 92.3\%$

> **Example 2 (Coin flips shortcut):** Probability of "at least one head" in 3 coin flips?
> - Complement = all tails = $(\frac{1}{2})^3 = \frac{1}{8}$
> - $P(\text{at least one head}) = 1 - \frac{1}{8} = \frac{7}{8} = 87.5\%$

> **Example 3 (Password):** What's the chance a random 1-digit number is **not** a prime? Primes in {1–9}: {2, 3, 5, 7} → 4 primes.
> $P(\text{not prime}) = 1 - \frac{4}{9} = \frac{5}{9} \approx 55.6\%$

### AND (Intersection): Both events happen together

> **Example 1 (Cards):** A card that is a King **AND** a Heart → only 1 such card (King of Hearts). $P = \frac{1}{52}$

> **Example 2 (Die + Coin):** Roll an even number AND flip heads.
> $P(\text{even}) = \frac{1}{2}$, $P(\text{heads}) = \frac{1}{2}$. Since independent:
> $P(\text{both}) = \frac{1}{2} \times \frac{1}{2} = \frac{1}{4} = 25\%$

### OR (Addition Rule): $P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B)$

> **Example 1 (Cards):** $P(\text{King or Heart})$
> $= \frac{4}{52} + \frac{13}{52} - \frac{1}{52} = \frac{16}{52} \approx 30.8\%$
> *(Subtract 1 because the King of Hearts was counted twice)*

> **Example 2 (Cards):** $P(\text{Red Card or Face Card})$
> $= \frac{26}{52} + \frac{12}{52} - \frac{6}{52} = \frac{32}{52} \approx 61.5\%$
> *(6 red face cards: J♥ Q♥ K♥ J♦ Q♦ K♦)*

> **Example 3 (Students):** 30 students. 18 play football, 12 play basketball, 5 play both.
> $P(\text{football or basketball}) = \frac{18}{30} + \frac{12}{30} - \frac{5}{30} = \frac{25}{30} \approx 83.3\%$

---

## 4. Counting Rules

Used when possibilities are in the millions. Always ask: **"Can I repeat?"** and **"Does order matter?"**

### Repetition Allowed: $n^k$

> **Example 1 (PIN):** 4-digit PIN code. 10 choices per digit.
> $10^4 = 10{,}000$ possible PINs.

> **Example 2 (Password):** 3-character password using only lowercase letters (26 choices each).
> $26^3 = 17{,}576$ possible passwords.

> **Example 3 (Coin Flips):** How many outcomes in 5 coin flips?
> $2^5 = 32$ outcomes.

### No Repetition + Order Matters (Permutations): Multiply down $k$ times

> **Example 1 (Roles):** Choosing President, VP, and Secretary from 10 people. Roles matter (Alice as President ≠ Alice as VP).
> $10 \times 9 \times 8 = 720$ possibilities.

> **Example 2 (Race):** 8 runners. How many ways can 1st, 2nd, and 3rd place be awarded?
> $8 \times 7 \times 6 = 336$ ways.

> **Example 3 (Letters):** How many 4-letter arrangements from {A, B, C, D, E} with no repeats?
> $5 \times 4 \times 3 \times 2 = 120$ arrangements.

### No Repetition + Order Doesn't Matter (Combinations): Divide by redundant arrangements

> **Example 1 (Committee):** 3-person committee from 10 people. Order doesn't matter (ABC = CAB).
> $\frac{10 \times 9 \times 8}{3!} = \frac{720}{6} = 120$ committees.

> **Example 2 (Lottery):** Pick 6 numbers from 1–49. Order doesn't matter.
> $\frac{49!}{6! \cdot 43!} = 13{,}983{,}816$ combinations — roughly a 1 in 14 million chance!

> **Example 3 (Pizza):** Pizza shop has 8 toppings. You pick any 3. How many unique combinations?
> $\frac{8 \times 7 \times 6}{3!} = \frac{336}{6} = 56$ combinations.

---

## Related

- [[Upskill/Gen Misc/Math/Probability|Probability]]
