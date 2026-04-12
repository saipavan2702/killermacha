##  Continued Fractions

> [!quote] The Big Idea
> Every irrational number — no matter how chaotic its decimal looks — can be expressed as an infinite cascade of fractions. These cascades reveal deep patterns invisible in standard decimals.

Instead of writing $\sqrt{2} = 1.41421356\ldots$ (a decimal that goes on forever with no pattern visible), continued fractions express numbers like this:

$$x = a_0 + \cfrac{1}{a_1 + \cfrac{1}{a_2 + \cfrac{1}{a_3 + \ddots}}}$$

The values $a_0, a_1, a_2, \ldots$ are called **partial quotients** — they're always positive integers, and they completely characterize the number.


###  The Algorithm: How to Build One

> [!tip] The Recipe (repeat forever)
> 1. **Split** the number into its integer part and fractional remainder
> 2. **Record** the integer part as your next partial quotient
> 3. **Flip** the fractional remainder (take its reciprocal)
> 4. **Repeat** from step 1 on the new number

For rational numbers, this terminates. For irrational numbers, it never stops — but it often reveals beautiful repeating or structured patterns.

###  Convergents: Chopping the Cascade

When you **stop the cascade early** at any level, you get a regular fraction called a **convergent**.

> [!important] Key Property
> Each convergent $\frac{p}{q}$ is the **best possible rational approximation** of the true value for any denominator up to $q$. You literally cannot do better with a smaller fraction.

---

###  Example 1 — $\sqrt{2}$

Running the algorithm on $\sqrt{2} \approx 1.4142\ldots$:

- Integer part: $1$, remainder: $\approx 0.4142$
- Flip remainder → $\approx 2.4142$ → integer part: $2$, remainder: $\approx 0.4142$
- The remainder **repeats exactly** — so the pattern locks in forever

$$\sqrt{2} = 1 + \cfrac{1}{2 + \cfrac{1}{2 + \cfrac{1}{2 + \ddots}}} = [1; 2, 2, 2, 2, \ldots]$$

#### Convergents of $\sqrt{2}$

| Level | Fraction        | Decimal  | Error     |
| ----- | --------------- | -------- | --------- |
| 1     | $\frac{1}{1}$   | $1.0000$ | $-0.4142$ |
| 2     | $\frac{3}{2}$   | $1.5000$ | $+0.0858$ |
| 3     | $\frac{7}{5}$   | $1.4000$ | $-0.0142$ |
| 4     | $\frac{17}{12}$ | $1.4167$ | $+0.0024$ |
| 5     | $\frac{41}{29}$ | $1.4138$ | $-0.0004$ |

> [!note] Zigzag Convergence
> Notice the errors alternate sign — convergents **zigzag** above and below the true value, closing in rapidly. Each step is roughly **6× more accurate** than the last.

---

###  Example 2 — $\pi$ and the Power of Large Quotients

The decimal $\pi = 3.14159265\ldots$ looks completely chaotic. But its partial quotients reveal something interesting:

$$\pi = [3;\; 7,\; 15,\; 1,\; \mathbf{292},\; 1,\; 1,\; 1,\; 2,\; \ldots]$$

> [!warning] The Golden Rule of Large Quotients
> A **large partial quotient** means the convergent computed **just before it** is an exceptionally accurate approximation.
> 
> The $292$ in $\pi$'s sequence is enormous — so the fraction right before it must be extraordinary.

That fraction is:

$$\pi \approx 3 + \cfrac{1}{7 + \cfrac{1}{15 + \cfrac{1}{1}}} = \frac{355}{113}$$

### $\frac{355}{113}$ vs $\frac{22}{7}$

| Fraction | Decimal | Matches $\pi$ to... |
|----------|---------|----------------------|
| $\frac{22}{7}$ | $3.142857\ldots$ | **2 decimal places** |
| $\frac{355}{113}$ | $3.1415929\ldots$ | **6 decimal places** |

$$\frac{355}{113} \text{ is nearly } \mathbf{3{,}000\times} \text{ more accurate, with only a } 16\times \text{ larger denominator}$$

> [!info] Historical Note
> $\frac{355}{113}$ was discovered by Chinese mathematician **Zu Chongzhi** in the 5th century CE — over a millennium before European mathematicians caught up.

---

###  Example 3 — The Golden Ratio $\phi$ and Hurwitz's Theorem

The golden ratio $\phi = \frac{1+\sqrt{5}}{2} \approx 1.6180\ldots$ produces the **simplest possible** continued fraction:

$$\phi = 1 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{1 + \ddots}}} = [1; 1, 1, 1, 1, \ldots]$$

All partial quotients are $1$ — the smallest they can ever be. Since large partial quotients drive rapid convergence, $\phi$ converges **as slowly as mathematically possible**.

#### Convergents of $\phi$ = Fibonacci Ratios

$$\frac{1}{1},\quad \frac{2}{1},\quad \frac{3}{2},\quad \frac{5}{3},\quad \frac{8}{5},\quad \frac{13}{8},\quad \frac{21}{13},\quad \ldots$$

> [!example] The Most Irrational Number
> $\phi$ is formally called the **"most irrational number"** — it resists rational approximation more stubbornly than any other number. This is why $\phi$ appears in nature (sunflower spirals, leaf arrangements) where plants "want" to avoid accidentally aligning.

#### Hurwitz's Theorem

For **any** irrational number $\alpha$, there are infinitely many fractions $\frac{p}{q}$ satisfying:

$$\left|\alpha - \frac{p}{q}\right| < \frac{1}{\sqrt{5} \cdot q^2}$$

> [!math] The Significance
> The $\sqrt{5}$ here **cannot be replaced by any larger number** without making the theorem false for some numbers.
> 
> And which number sits exactly at this boundary? The **golden ratio** $\phi$ — it is the extremal case. Every other irrational number is "less irrational" than $\phi$.

---

###  Example 4 — Euler's Number $e$

While $\pi$'s continued fraction is chaotic, $e = 2.71828\ldots$ produces a stunning infinite pattern:

$$e = [2;\; 1, 1, 4, 1, 1, 6, 1, 1, 8, 1, 1, 10, \ldots]$$

The pattern: **two 1s, then the next even number, repeat forever.**

$$e = 2 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{4 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{6 + \ddots}}}}}}}}$$

> [!success] Euler's Proof of Irrationality
> Rational numbers always have **terminating** continued fractions.
> Since $e$'s continued fraction is infinite and non-repeating (it keeps growing: $4, 6, 8, 10, \ldots$), Euler used this to **prove $e$ is irrational** — one of the earliest and most elegant proofs.

---

###  Summary — The Four Characters

| Number     | Partial Quotients            | Convergence Speed   | Key Insight                                   |
| ---------- | ---------------------------- | ------------------- | --------------------------------------------- |
| $\sqrt{2}$ | $[1; 2, 2, 2, \ldots]$       | Fast (~6× per step) | Perfect repeating pattern                     |
| $\pi$      | $[3; 7, 15, 1, 292, \ldots]$ | Varies wildly       | Giant $292$ makes $\frac{355}{113}$ magical   |
| $\phi$     | $[1; 1, 1, 1, \ldots]$       | Slowest possible    | Most irrational number; Fibonacci convergents |
| $e$        | $[2; 1,1,4,1,1,6,\ldots]$    | Structured          | Infinite pattern proves irrationality         |

#mathematics #number-theory #continued-fractions #irrational-numbers #golden-ratio #pi

---


## References
https://www.youtube.com/watch?v=MrWJqJOndeI
