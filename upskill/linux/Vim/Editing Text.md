# Editing Text in Vim

> [!summary]
> Combine operators, motions, counts, repetition, and visual selections instead of treating editing as isolated shortcuts.

## ✍️  Insert Mode

- `i` → insert before cursor
- `I` → insert at beginning of line (first non-whitespace)
- `a` → insert after cursor
- `A` → insert at end of line
- `o` → open new line below and enter insert mode
- `O` → open new line above and enter insert mode
- `Ctrl + h` → Delete character to the left (backspace)
- `Ctrl + w` → Delete word to the left
- `Ctrl + u` → Delete from cursor to the beginning of the line

---

## ✂️ Vim: Editing Text (Normal Mode)

- `dd` / `2dd` → delete (cut) 1 / 2 lines
- `yy` / `2yy` → yank (copy) 1 / 2 lines
- `p` / `P` → paste after / before cursor (or below/above line if lines yanked)
- `u` → undo
- `Ctrl + r` → redo
- `.` → repeat last change/command
- `J` → join line below with current
- `x` → delete character under cursor
- `X` → delete character before cursor
- `s` → substitute (delete) character and enter insert mode
- `r<char>` → replace current char with `<char>` (e.g., `ra` replaces with 'a')
- `c` → change. Requires a motion or text object.
    - `ciw` → **change inner word** (e.g., changes the word under cursor)
    - `c$` → change to end of line
- `C` → change from the cursor to the end of the line (equivalent to `c$`)

---


## 🔁 Number Manipulation

- `Ctrl + a` → Increment number under cursor  
- `Ctrl + x` → Decrement number  
- `g Ctrl + a` → Increment all selected numbers (visually)

**Bonus:**
- Visual select number list, press `g Ctrl + a` to increment each line cumulatively

---
## ✨ Multiline Editing

**Method 1: Using `:norm`**
```vim
v (select lines)
:norm I<text>     → Prepend text
:norm A<text>     → Append text
```

**Method 2: Visual Block Mode**
```vim
Ctrl + v (select column)
Shift + I or A
<type text>
Esc → Apply to all selected lines

```

**Method 3: Regex Substitute**
```vim
:'<,'>s/^/prefix/     → Add prefix to selected lines
:'<,'>s/$/suffix/     → Add suffix to selected lines

```

**Method 4: Line Range Commands**
```vim
:1,10 normal I//      → Add '//' to lines 1 to 10
```

---

### 🔹 Basic Increment (Normal/Visual Mode)
- Move the cursor over a number.
- Press `Ctrl-a` to increment it by 1.
- Press `Ctrl-x` to decrement it.

## 🚚 Moving Lines with `:m`

Use the `:m` command to move lines:

- `:m +1` — move line down by 1  
- `:m -2` — move line up by 2  
- `:m 3` — move line **after** line 3  

**Steps:**

1. Select lines using `Shift+v`.
2. Press `:` (this pre-fills `:'<,'>`)
3. Type your command, like `m +1`.

---
## 📝 Line Completion (`Ctrl+x Ctrl+l`)

Completes an entire line by searching for matching lines in your **current buffer**  in insert mode.

1. Start typing part of a line.
2. Press `Ctrl+x` then `Ctrl+l`.
3. A popup menu appears with matching lines.
4. Use `Ctrl+n` / `Ctrl+p` to **navigate suggestions**.
5. Press `Enter` to **select** the desired line.

---

### 💡 Example

Given this in your file:
```js
function calculateTotal()
function calculateTax()
function printReceipt()
```

Typing:
```
func + Ctrl+x Ctrl+l
```
Will suggest:
- `function calculateTotal()`
- `function calculateTax()`
- `function printReceipt()`

---

### 🚀 Advanced Features

- Works across **multiple buffers** if `:set complete+=k`
- Supports **partial matches** (e.g., `cal` matches both `calculateTotal` and `calculateTax`)
- Combines well with other completion types:
  - `Ctrl+x Ctrl+f` — File name completion
  - `Ctrl+x Ctrl+o` — Omni-completion (language-aware)
  - `Ctrl+x Ctrl+n` — Keyword completion (current file)

---
