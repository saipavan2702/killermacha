## Error Handling

```dataviewjs
const sections = [
  {
    num: "01",
    lang: "TypeScript",
    color: "#3178C6",
    title: "Never forget await on async calls",
    verdict: "DON'T",
    useCase: "A function calls fetchUserProfile() but forgets the await. It returns true synchronously before the fetch completes. If the fetch fails, the error logs to console — where nobody looks.",
    tip: "TypeScript won't always catch a missing await. Enable `@typescript-eslint/no-floating-promises` in your ESLint config — it flags unawaited Promises as errors.",
    good: `// DO: always await async operations
async function loadData(): Promise<boolean> {
  await fetchUserProfile()  // error surfaces properly
  return true
}`,
    bad: `// DON'T: fire-and-forget async call
function loadData() {
  fetchUserProfile()  // ← missing await
  return true         // returns before fetch even starts
  // errors silently logged to console and lost
}`
  },
  {
    num: "02",
    lang: "TypeScript",
    color: "#3178C6",
    title: "Promise.all on mutations without rollback",
    verdict: "DON'T",
    useCase: "chargeCard() and reserveInventory() run in parallel. Card charge throws — Promise.all rejects immediately. But reserveInventory() may have already succeeded, leaving inventory permanently locked.",
    tip: "Promise.all is safe for parallel reads. For mutations with side effects, run sequentially and implement explicit rollback on failure.",
    good: `// DO: sequential mutations with rollback
const charge = await chargeCard()
try {
  await reserveInventory()
} catch (err) {
  await refundCharge(charge.id)  // explicit rollback
  throw err
}`,
    bad: `// DON'T: parallel mutations, no rollback
await Promise.all([
  chargeCard(),        // fails → rejects
  reserveInventory()   // may have already succeeded
])
// result: charged card + locked inventory = broken state`
  },
  {
    num: "03",
    lang: "TypeScript",
    color: "#3178C6",
    title: "Massive catch blocks with instanceof chains",
    verdict: "DON'T",
    useCase: "Giant catch blocks with 5+ instanceof checks for AxiosError, TypeError, SyntaxError, NetworkError, plus an else fallback that nobody understands. Adding a new error type means editing every catch site.",
    tip: "Create a normaliseError() utility that maps raw errors to domain types at the boundary. Catch blocks stay thin; domain errors carry all context your app needs.",
    good: `// DO: normalise at the boundary, catch domain errors
function normaliseError(err: unknown): AppError {
  if (axios.isAxiosError(err))
    return new NetworkError(err.message)
  if (err instanceof SyntaxError)
    return new ParseError(err.message)
  return new UnknownError(String(err))
}

try {
  await fetchData()
} catch (err) {
  throw normaliseError(err)  // thin, consistent
}`,
    bad: `// DON'T: instanceof sprawl in every catch
try {
  await fetchData()
} catch (err) {
  if (err instanceof AxiosError) { ... }
  else if (err instanceof TypeError) { ... }
  else if (err instanceof SyntaxError) { ... }
  else if (err instanceof NetworkError) { ... }
  else { /* nobody knows what happens here */ }
}`
  },
  {
    num: "04",
    lang: "Go",
    color: "#00ADD8",
    title: "Comma-ok assertion + %w wrapping",
    verdict: "DO",
    useCase: "Extracting a typed value from context.Context. Direct assertion panics if the key is absent — common in background jobs and unauthenticated routes that skip auth middleware.",
    tip: "Always use comma-ok form for type assertions. Wrap errors with `fmt.Errorf(\"context: %w\", err)` so errors.Is() and errors.As() work anywhere up the call stack.",
    good: `// DO: comma-ok check + %w wrapping
val, ok := ctx.Value("user").(*User)
if !ok || val == nil {
    return fmt.Errorf("auth: no user in context")
}

if err != nil {
    return fmt.Errorf("process payment: %w", err)
    // %w preserves the chain for errors.Is / errors.As
}`,
    bad: `// DON'T: direct assertion — #1 production panic
val := ctx.Value("user").(*User)
// panics with nil pointer dereference if user absent
// crashes the entire service on unauthenticated routes
// or background jobs that skip auth middleware`
  },
  {
    num: "05",
    lang: "Go",
    color: "#00ADD8",
    title: "Pick one error strategy per codebase",
    verdict: "DON'T",
    useCase: "Four devs, four strategies in the same file: one wraps with %w, one logs and returns a zero value, one panics, one discards with _. At 50 engineers this becomes completely undebuggable.",
    tip: "Agree on one strategy at architecture review time. Write a short ADR (Architecture Decision Record). Enforce it with golangci-lint rules like `errcheck` and `wrapcheck`.",
    good: `// DO: one agreed strategy — always wrap with context
func saveUser(db *DB, u User) error {
    if err := db.Insert(u); err != nil {
        return fmt.Errorf("saveUser: %w", err)
    }
    return nil
}
// consistent: every caller can use errors.Is / errors.As`,
    bad: `// DON'T: four strategies in one codebase
return fmt.Errorf("save user: %w", err) // Dev A
log.Println(err); return User{}          // Dev B — zero value
if err != nil { panic(err) }             // Dev C
result, _ := db.Query(...)               // Dev D — discarded`
  }
];

// ── helpers ──────────────────────────────────────────────────────────
const esc = s => s
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

// ── root ─────────────────────────────────────────────────────────────
const root = dv.el("div", "", { attr: { id: "eh-root" } });

root.innerHTML = `
<style>
  #eh-root {
    font-family: var(--font-interface, sans-serif);
    font-size: 14px;
    color: var(--text-normal);
    --bg:     var(--background-primary);
    --bg2:    var(--background-secondary);
    --border: var(--background-modifier-border);
    --muted:  var(--text-muted);
    --code:   var(--code-background, var(--background-secondary));
    --mono:   var(--font-monospace, monospace);
    --r: 8px;
  }

  /* ── top tab strip ── */
  #eh-root .eh-tabs {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding: 14px 14px 0;
    border: 1px solid var(--border);
    border-bottom: none;
    border-radius: var(--r) var(--r) 0 0;
    background: var(--bg2);
  }
  #eh-root .eh-tab {
    padding: 8px 14px;
    border-radius: 99px;
    border: 1px solid var(--border);
    background: var(--bg);
    color: var(--muted);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .05em;
    cursor: pointer;
    transition: all .15s;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 10px;
  }
  #eh-root .eh-tab:hover { color: var(--text-normal); }
  #eh-root .eh-tab.active {
    color: var(--text-normal);
    background: color-mix(in srgb, var(--eh-accent) 14%, var(--bg));
    border-color: color-mix(in srgb, var(--eh-accent) 40%, var(--border));
  }
  #eh-root .eh-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 99px;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  /* ── main panel ── */
  #eh-root .eh-panel { display: none; }
  #eh-root .eh-panel.active { display: block; }

  #eh-root .eh-body {
    border: 1px solid var(--border);
    border-radius: 0 0 var(--r) var(--r);
    background: var(--bg);
    padding: 0;
    overflow: hidden;
  }

  /* ── header strip ── */
  #eh-root .eh-head {
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
  }
  #eh-root .eh-kicker {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  #eh-root .eh-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #eh-root .eh-verdict {
    font-size: 10px;
    font-weight: 800;
    padding: 3px 10px;
    border-radius: 99px;
    letter-spacing: .07em;
  }
  #eh-root .verdict-do   { background: #27AE6020; color: #27AE60; }
  #eh-root .verdict-dont { background: #E74C3C20; color: #E74C3C; }

  #eh-root .eh-meta {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.65;
    margin-bottom: 6px;
  }
  #eh-root .eh-meta b { color: var(--text-normal); font-weight: 600; }

  /* ── code comparison ── */
  #eh-root .eh-compare {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  #eh-root .eh-col {
    border-top: 1px solid var(--border);
    overflow: hidden;
  }
  #eh-root .eh-col + .eh-col {
    border-left: 1px solid var(--border);
  }
  #eh-root .eh-col-head {
    padding: 8px 14px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  #eh-root .eh-col-head.good {
    background: #27AE6012;
    color: #27AE60;
    border-bottom-color: #27AE6030;
  }
  #eh-root .eh-col-head.bad {
    background: #E74C3C12;
    color: #E74C3C;
    border-bottom-color: #E74C3C30;
  }
  #eh-root .eh-col pre {
    margin: 0;
    padding: 14px 16px;
    overflow-x: auto;
    background: var(--code);
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.72;
    white-space: pre;
  }

  /* ── tip footer ── */
  #eh-root .eh-tip {
    border-top: 1px solid var(--border);
    padding: 12px 20px;
    font-size: 12.5px;
    color: var(--muted);
    line-height: 1.6;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    background: var(--bg2);
  }
  #eh-root .eh-tip-icon {
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 1px;
  }
  #eh-root .eh-tip code {
    font-family: var(--mono);
    font-size: 11.5px;
    background: var(--code);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--text-normal);
  }
  #eh-root .eh-tip b { color: var(--text-normal); font-weight: 600; }

  @media (max-width: 700px) {
    #eh-root .eh-compare { grid-template-columns: 1fr; }
    #eh-root .eh-col + .eh-col { border-left: none; border-top: 1px solid var(--border); }
  }
</style>

<!-- Tab strip -->
<div class="eh-tabs">
  ${sections.map((s, i) => `
    <button
      class="eh-tab ${i === 0 ? "active" : ""}"
      data-idx="${i}"
      style="--eh-accent:${s.color}"
    >
      <span style="color:${s.color}">${s.num}</span>
      <span class="eh-badge" style="background:${s.color}20;color:${s.color}">${s.lang}</span>
    </button>
  `).join("")}
</div>

<!-- Panels -->
<div class="eh-body">
  ${sections.map((s, i) => `
    <div class="eh-panel ${i === 0 ? "active" : ""}" data-panel="${i}">
      <div class="eh-head">
        <div class="eh-kicker" style="color:${s.color}">Point ${s.num} · ${s.lang}</div>
        <div class="eh-title">
          ${s.title}
          <span class="eh-verdict ${s.verdict === "DO" ? "verdict-do" : "verdict-dont"}">
            ${s.verdict === "DO" ? "✓ DO" : "✕ DON'T"}
          </span>
        </div>
        <div class="eh-meta">${s.useCase}</div>
      </div>
      <div class="eh-compare">
        <div class="eh-col">
          <div class="eh-col-head good">✓ Good pattern</div>
          <pre><code>${esc(s.good)}</code></pre>
        </div>
        <div class="eh-col">
          <div class="eh-col-head bad">✕ Avoid this</div>
          <pre><code>${esc(s.bad)}</code></pre>
        </div>
      </div>
      <div class="eh-tip">
        <span class="eh-tip-icon" style="color:${s.color}">→</span>
        <div>${s.tip}</div>
      </div>
    </div>
  `).join("")}
</div>
`;

// ── tab switching ──────────────────────────────────────────────────────
root.querySelectorAll(".eh-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const idx = parseInt(tab.dataset.idx);
    const s   = sections[idx];

    root.querySelectorAll(".eh-tab").forEach((t, j) => {
      t.classList.toggle("active", j === idx);
      t.style.setProperty("--eh-accent", sections[j].color);
    });

    root.querySelectorAll(".eh-panel").forEach((p, j) => {
      p.classList.toggle("active", j === idx);
    });
  });
});
```


Good error handling is mostly about consistency: make failures visible, preserve context, and avoid hidden partial success.

## 1. Never Forget `await` on Async Calls

**Language:** TypeScript  
**Verdict:** Do not fire-and-forget promises unless that is intentional.

A function can call `fetchUserProfile()` without `await`, return successfully, and lose the real failure in a console log.

### Good Pattern

```ts
async function loadData(): Promise<boolean> {
  await fetchUserProfile();
  return true;
}
```

### Avoid This

```ts
function loadData() {
  fetchUserProfile();
  return true;
}
```

Tip: enable `@typescript-eslint/no-floating-promises` so unawaited promises become lint errors.

## 2. Avoid `Promise.all` for Mutations Without Rollback

**Language:** TypeScript  
**Verdict:** Parallel reads are fine; parallel side effects need compensation.

If `chargeCard()` fails but `reserveInventory()` already succeeded, the system can end up with a broken partial state.

### Good Pattern

```ts
const charge = await chargeCard();

try {
  await reserveInventory();
} catch (err) {
  await refundCharge(charge.id);
  throw err;
}
```

### Avoid This

```ts
await Promise.all([
  chargeCard(),
  reserveInventory()
]);
```

Tip: for side effects, run sequentially or use explicit rollback/compensation.

## 3. Avoid Massive Catch Blocks With `instanceof` Chains

**Language:** TypeScript  
**Verdict:** Normalize errors at boundaries.

Large catch blocks with many `instanceof` checks are hard to maintain. Every new error type forces changes in many places.

### Good Pattern

```ts
function normaliseError(err: unknown): AppError {
  if (axios.isAxiosError(err)) {
    return new NetworkError(err.message);
  }

  if (err instanceof SyntaxError) {
    return new ParseError(err.message);
  }

  return new UnknownError(String(err));
}

try {
  await fetchData();
} catch (err) {
  throw normaliseError(err);
}
```

### Avoid This

```ts
try {
  await fetchData();
} catch (err) {
  if (err instanceof AxiosError) {
    // ...
  } else if (err instanceof TypeError) {
    // ...
  } else if (err instanceof SyntaxError) {
    // ...
  } else {
    // unclear fallback
  }
}
```

Tip: map raw library errors to domain errors once at the boundary.

## 4. Use Comma-Ok Assertions and `%w` Wrapping

**Language:** Go  
**Verdict:** Do this.

Direct type assertions can panic if the value is missing or has the wrong type.

### Good Pattern

```go
val, ok := ctx.Value("user").(*User)
if !ok || val == nil {
    return fmt.Errorf("auth: no user in context")
}

if err != nil {
    return fmt.Errorf("process payment: %w", err)
}
```

### Avoid This

```go
val := ctx.Value("user").(*User)
```

Tip: `%w` preserves the error chain so `errors.Is` and `errors.As` work up the call stack.

## 5. Pick One Error Strategy Per Codebase

**Language:** Go  
**Verdict:** Do not mix strategies randomly.

A codebase where one function wraps errors, another logs and returns zero values, another panics, and another discards errors becomes impossible to debug.

### Good Pattern

```go
func saveUser(db *DB, u User) error {
    if err := db.Insert(u); err != nil {
        return fmt.Errorf("saveUser: %w", err)
    }
    return nil
}
```

### Avoid This

```go
return fmt.Errorf("save user: %w", err)
log.Println(err); return User{}
if err != nil { panic(err) }
result, _ := db.Query(...)
```

Tip: agree on one strategy in an ADR and enforce it with lint rules like `errcheck` and `wrapcheck`.

---

## References

> [!info] Source trail
> Error-handling references that support this note.

- [The Error Handling Problem That Followed Me Everywhere](https://www.youtube.com/watch?v=XDTov7xaD7g) - Cross-language error-handling ideas.

#sysdes #api #error-handling
