> [!summary]
> Search locates text; substitution transforms it across a line, range, selection, or file.

Map: [[Upskill/Linux/Vim/Vim|Vim]]
Connections: [[Upskill/Linux/Vim/Editing Text|Editing Text]], [[Upskill/Linux/Vim/Registers Macros and Repetition|Registers Macros and Repetition]]

## 🔍 Vim: Searching

- `/pattern` → search forward for `pattern`
- `?pattern` → search backward for `pattern`
- `n` / `N` → next / previous search result
- `*` → search forward for the word under cursor
- `#` → search backward for the word under cursor
- `%` → jump to matching bracket/brace/parenthesis
- `:noh` → clear search highlights

---

## 🔧 Vim: Replace / Substitute

```vim
:%s/old/new/g   " Replace all occurrences of 'old' with 'new' in the entire file
:%s/old/new/gc  " Replace all occurrences with confirmation (c for confirm)
:%s/\<word\>/new/g " Replace exact word "word" with "new" in the entire file (word boundaries)
:'<,'>s/^/prefix/ " Add 'prefix' to the beginning of all lines in the visual selection
:'<,'>s/$/suffix/ " Append 'suffix' to the end of all lines in the visual selection
```
y+i+b(block) or any char yanks text inside the char, and using y+a yanks along with char

---
