# Conditional Probability

> [!summary]
> Conditional, joint, marginal, total, and Bayesian probability describe how information changes the likelihood of events.

## 5. Conditional Probability

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

## 6. Joint & Marginal Probability / Independence

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


## 9. Law of Total Probability

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

## 10. Bayes' Rule

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
