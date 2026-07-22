> [!summary]
> Vim becomes fast when movement expresses intent: words, lines, screens, jumps, and text objects.

Map: [[Upskill/Linux/Vim/Vim|Vim]]
Connections: [[Upskill/Linux/Vim/Editing Text|Editing Text]]

## 🔀  Cursor Movement

- `h` → move left
- `j` → move down
- `k` → move up
- `l` → move right
- `w` / `W` → next word (W ignores punctuation)
- `e` / `E` → end of next word (E ignores punctuation)
- `b` / `B` → beginning of previous word (B ignores punctuation)
- `0` → start of line (first character)
- `^` → first non-whitespace character in line
- `$` → end of line
- `gg` → go to first line of the file
- `G` → go to last line of the file
- `nG` → go to nth line (e.g., `8G` = 8th line)
- `f<char>` → Find next occurrence of `<char>` on current line and move to it (e.g., `fa`)
- `F<char>` → Find previous occurrence of `<char>` on current line and move to it
- `t<char>` → Move to *before* next occurrence of `<char>` on current line
- `T<char>` → Move to *after* previous occurrence of `<char>` on current line
- `;` → Repeat the last `f`, `F`, `t`, or `T` command in the same direction
- `,` → Repeat the last `f`, `F`, `t`, or `T` command in the opposite direction
> **Tip:** `f-jumps`: `f + ‘char’` goes to that next char. To move forward after a jump, use `;`. To move backward, use `,`.

---
## 📄  Screen Navigation

- `H` → top of screen (High)
- `M` → middle of screen (Middle)
- `L` → bottom of screen (Low)
- `Ctrl + d` → scroll half page down
- `Ctrl + u` → scroll half page up
- `Ctrl + f` → scroll a full page forward
- `Ctrl + b` → scroll a full page backward

---
## 📐 Visual Mode Selection

- `v` → Start character-wise selection
- `V` → Start line-wise selection
- `Ctrl + v` → Start block (column) selection
- `o` → Switch selection anchor
- `y`, `d`, `p` → Yank, delete, or paste selection

**Text Objects:**
- `viw`, `vaw` → Visual inside / around word
- `vi"`, `va"` → Inside / around quotes
- `vi(`, `va(`, `vi{`, `va{` → Inside / around brackets/braces

###  Inside (`i`) vs Around (`a`)
- `yiw`: Yank inside word (does not include whitespace)
- `yaw`: Yank around word (includes whitespace)
- `yi"`: Yank inside double quotes (does not include the quotes)
- `ya"`: Yank around double quotes (includes the quotes)
- `ciw`: Change inside word
- `di(`: Delete inside parentheses

---



## 🚀 Jumplist Navigation
```vim
Ctrl + o        " Jump back in jumplist
Ctrl + i        " Jump forward in jumplist
```

---

## 🎯 The Power of `g` Commands

- `g~` → Toggle case
- `gu` → Lowercase
- `gU` → Uppercase

Apply them to motions like `w`, `aw`, or visual selections.

**Examples:**
```vim
gUw     " Uppercase next word
guap    " Lowercase around paragraph
g~i"    " Toggle case inside double quotes
```

---
