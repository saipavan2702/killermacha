> [!summary]
> Euler's number is the natural base for continuous growth, calculus, logarithms, probability, and complex analysis.

Map: [[Upskill/Gen Misc/Math/Math|Math]]

## 1. Where It All Began: The Compound Interest Problem (1683)

Jacob Bernoulli asked a deceptively simple question:

> If a bank gives you **100% interest** on \$1 over one year, what happens if the interest is compounded more and more frequently?

### The Formula

If interest is compounded $n$ times per year at a rate of 100%, the final amount is:

$$A = \left(1 + \frac{1}{n}\right)^n$$

### What Happens as $n$ Grows?

| Compounding | $n$ | Amount |
|---|---|---|
| Annually | 1 | \$2.000000 |
| Semi-annually | 2 | \$2.250000 |
| Monthly | 12 | \$2.613035 |
| Daily | 365 | \$2.714567 |
| Every second | 86,400 | \$2.718279 |
| Continuously ($n \to \infty$) | $\infty$ | **\$2.71828...** |

The value doesn't shoot off to infinity — it **settles toward a fixed limit**. That limit is $e$:

$$e = \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n \approx 2.71828182845904523536\ldots$$

---

## 2. Euler Gives It a Name and a Formula

Leonard Euler (who studied under Jacob Bernoulli's brother Johann) realised this wasn't a financial quirk — it was a **universal constant** of continuous change.

### The Infinite Series for $e$

Euler found that the same number appeared when you sum an infinite series built from **factorials**:

$$e = \frac{1}{0!} + \frac{1}{1!} + \frac{1}{2!} + \frac{1}{3!} + \frac{1}{4!} + \cdots = \sum_{k=0}^{\infty} \frac{1}{k!}$$

Let's verify:

$$e = 1 + 1 + \frac{1}{2} + \frac{1}{6} + \frac{1}{24} + \frac{1}{120} + \cdots \approx 2.71828\ldots$$

This series converges **extremely fast**, which is why Euler could calculate $e$ to 23 decimal places by 1748.

### Euler's Definition (1731)

In a 1731 letter, Euler defined $e$ as:

$$\ln(e) = 1$$

In other words, **$e$ is the unique positive number whose natural logarithm equals exactly 1**.

---

## 3. Why $e$ is Special in Calculus

### Exponential Functions and Their Slopes

For any exponential function $f(x) = a^x$, the slope (derivative) at any point is **always proportional to the current height** of the curve:

$$\frac{d}{dx}(a^x) = a^x \cdot \ln(a)$$

The multiplier $\ln(a)$ tells you the ratio of slope to height:

| Base $a$ | Multiplier $\ln(a)$ | Meaning |
|---|---|---|
| $2$ | $\approx 0.693$ | Slope is ~69% of height |
| $3$ | $\approx 1.099$ | Slope is ~110% of height |
| $e$ | $= 1.000$ | **Slope equals height exactly** |

### The Magical Property of $e^x$

When the base is $e$, the multiplier becomes $\ln(e) = 1$, so:

$$\boxed{\frac{d}{dx}(e^x) = e^x}$$

This is the defining property of $e^x$: **the function is its own derivative**. Its rate of change at every point is exactly equal to its own value.

### Proof via the Infinite Series

Using the series representation:

$$e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \frac{x^4}{4!} + \cdots$$

Differentiate term by term:

$$\frac{d}{dx}(e^x) = 0 + 1 + \frac{2x}{2!} + \frac{3x^2}{3!} + \frac{4x^3}{4!} + \cdots = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots = e^x$$

The constant term vanishes, every other term shifts down one place — and you get **the exact same series back**. The function perfectly rebuilds itself.

---

## 4. $e$ in Geometry: The Area Under $y = \frac{1}{x}$

There's a beautiful geometric way to see $e$. Consider the curve:

$$y = \frac{1}{x}$$

The **area under this curve** from $x = 1$ to some point $x = t$ is:

$$\int_1^t \frac{1}{x}\, dx = \ln(t)$$

So, **$e$ is the unique point where the accumulated area under the curve equals exactly 1**:

$$\int_1^e \frac{1}{x}\, dx = 1$$

This gives a definition of $e$ that requires no algebra — just geometry.

---

## 5. $e$ is Irrational — But Beautifully Patterned

In 1737, Euler proved that $e$ is **irrational** — it cannot be written as a fraction $\frac{p}{q}$ for any integers $p$ and $q$.

Yet when written as a **continued fraction** (an infinitely nested fraction), it reveals a strikingly regular pattern:

$$e = 2 + \cfrac{1}{1 + \cfrac{1}{2 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{4 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{6 + \cdots}}}}}}}}$$

The pattern in the numerators is: $1, 2, 1, 1, 4, 1, 1, 6, 1, 1, 8, \ldots$

Unlike truly "random" irrationals, $e$ has a **rhythmic, non-chaotic structure** — a hint that it's deeply woven into mathematics.

---

## 6. Euler's Identity: $e$ Meets the Complex Plane

The most celebrated equation in all of mathematics connects $e$, $\pi$, and $i$ (the imaginary unit $\sqrt{-1}$).

### Euler's Formula (General Form)

$$e^{ix} = \cos(x) + i\sin(x)$$

This says that raising $e$ to an imaginary power **traces a circle** in the complex plane. As $x$ increases, $e^{ix}$ rotates around the origin.

### Euler's Identity (at $x = \pi$)

$$\boxed{e^{i\pi} + 1 = 0}$$

This single equation unites:

| Symbol | Meaning |
|---|---|
| $e$ | The base of natural growth |
| $i$ | The imaginary unit, $\sqrt{-1}$ |
| $\pi$ | The ratio of a circle's circumference to its diameter |
| $1$ | The multiplicative identity |
| $0$ | The additive identity |

---

## Summary: Why $e$ Keeps Appearing Everywhere

| Context | How $e$ Shows Up |
|---|---|
| **Finance** | Limit of continuous compounding: $e = \lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n$ |
| **Series** | Sum of reciprocal factorials: $e = \sum_{k=0}^{\infty} \frac{1}{k!}$ |
| **Calculus** | $\frac{d}{dx}e^x = e^x$ — the only function equal to its own derivative |
| **Geometry** | Area under $y=1/x$ from 1 to $e$ equals exactly 1 |
| **Number Theory** | Irrational, but with a perfectly rhythmic continued fraction |
| **Complex Numbers** | $e^{i\pi} + 1 = 0$ — uniting the five fundamental constants |

> $e$ is not a curiosity. It is the natural language in which continuous change speaks.


## Related

- [[Upskill/Gen Misc/Math/Continued Fractions|Continued Fractions]]

#mathematics #calculus
