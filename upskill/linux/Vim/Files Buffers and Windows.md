Map: [[Upskill/Linux/Vim/Vim|Vim]]


> [!summary]
> Buffers hold files, windows display buffers, and sessions preserve a working layout.

## 🗂️ File and Buffer Management

- `:e <file>` → Open a file
- `:w !sudo tee %` → Save with root privileges
- `:saveas <filename>` → Save current file under a new name

### Buffer Commands

- `:ls` or `:buffers` → List open buffers
- `:b <number>` → Switch to buffer by number
- `:bn` → Go to next buffer
- `:bp` → Go to previous buffer
- `:bd` → Delete (close) current buffer
- `:bd!` → Force delete buffer without saving

> 💡 Buffers are like open files. Deleting a buffer doesn't delete the file, it just removes it from memory.

---

## ✅ Tips & Good Practices

- `gf` → Open file under cursor (path must exist)
- `*` → Search for word under cursor
- `%` → Jump to matching bracket/brace/paren
- `"*y`, `"*p` → Copy/paste via system clipboard
- `:set clipboard=unnamedplus` → Use system clipboard automatically

---

## 🔄 Window & Split Management
```bash
vim -o f1 f2     # Horizontal split
vim -O f1 f2     # Vertical split
```

```vim
Ctrl + w + w     " Switch window
Ctrl + w + h/j/k/l  " Move to direction
Ctrl + w + =     " Equalize window sizes
Ctrl + w + _     " Maximize vertical
Ctrl + w + |     " Maximize horizontal
Ctrl + w + +     " Increase height
Ctrl + w + -     " Decrease height
Ctrl + w + c     " Close current window
:qall            " Quit all splits
```

---


## 📎 Copying Between Files

```vim
vim file1 file2
:bn / :bp                " Switch buffer
ggVGy                    " Copy entire file1
:e file2.txt             " Open target file
p                        " Paste content
```

---

Advanced Vim Techniques

```vim
:tabnew       " Open new tab
gt            " Next tab
gT            " Previous tab
gv            " Reselecting visual selection
:tabclose     " Close current tab

ma            " Set mark 'a' at current position
'a            " Jump to mark 'a'
:marks        " List all marks

:r !date      " Insert current date
:r !ls        " Insert directory listing
:!make        " Run make from within Vim

:earlier 5m - Undo to 5 minutes ago
q: - Browse command history
```

---

## 💾 Session Management

Save and restore your Vim session easily:
Perfect for picking up right where you left off.
```vim
:mksession! ~/mysession.vim   " Save current session
vim -S ~/mysession.vim        " Load session later
```
---
## 📁 File Explorer Shortcuts

Use built-in file browsing inside Vim:

- `:Explore` — Open netrw file browser in current window
- `:Vex` — Open in vertical split
- `:Sex` — Open in horizontal split

---

## Related

- [[Upskill/Linux/Vim/Registers Macros and Repetition|Registers Macros and Repetition]]
- [[Upskill/Linux/Vim/Command Line|Command Line]]
