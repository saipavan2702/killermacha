# Vim Registers, Macros, and Repetition

> [!summary]
> Registers store text, macros record actions, and the dot command repeats the last change.

## 📋 Registers & Clipboard
```vim

:reg             " View all register contents
"0p             " Paste last yanked text (not deleted)
""p             " Paste last yanked/deleted text

"*y              " Yank to system clipboard (X11 primary)
"+y              " Yank to system clipboard (X11 clipboard)
"*p              " Paste from system clipboard (X11 primary)
"+p              " Paste from system clipboard (X11 clipboard)

"ay              " Yank into register 'a'
"ap              " Paste from register 'a'

"%y              " Yank current file name
".y              " Yank last inserted text
":y              " Yank last command

let @* = @%       " Copy current file name to system clipboard
let @a = @%       " Copy current file name to register 'a'

v                 " Enter visual mode
<select text>     " Highlight desired text
"ay               " Yank into register 'a'
"ap               " Paste from register 'a'
let @" = @%       " Default register

```

---

## 🎥 Macros
```vim
q<char>         " Start recording macro into register <char>
q               " Stop recording
@<char>         " Play macro
n@<char>        " Play macro n times (e.g., 5@a)
```

---


## 🔁 Dot Formula

Make repeatable changes with the `.` command (repeat last change).

**Example:**
```vim
cwnew<Esc>   " Changes the current word to 'new'
.            " Repeats that change on the next word
```

---
