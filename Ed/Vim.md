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

## 🔁 Number Manipulation

- `Ctrl + a` → Increment number under cursor  
- `Ctrl + x` → Decrement number  
- `g Ctrl + a` → Increment all selected numbers (visually)

**Bonus:**
- Visual select number list, press `g Ctrl + a` to increment each line cumulatively

---

## 📎 External Commands from Vim

- `:!jq .` → Prettify JSON content  
- `:!sort` → Sort selected lines  
- `:!uniq` → Remove duplicate lines  
- `:!<bash command>` → Run any terminal command

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

## 🚀 Jumplist Navigation
```vim
Ctrl + o        " Jump back in jumplist
Ctrl + i        " Jump forward in jumplist
```

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

## 📚 Help & Manual
```vim
K                " Open help for word under cursor
:help <cmd>      " Help for command
:help user-manual
```

---
## 🪄 Spell Check Shortcuts
```vim
]s / [s         " Next / previous misspelled word
z=              " Show suggestions
zg              " Add word to dictionary
zw              " Mark word as incorrect
```

---

## ⚡ Running External Commands
```vim
:'<,'>!sort              " Sort lines
:'<,'>!uniq              " Remove duplicates
:'<,'>!jq .              " Prettify JSON
:!<bash_command>         " Run any shell command
```

---

## 📎 Copying Between Files

```vim
vim file1 file2
:bn / :bp                " Switch buffer
ggVGy                   " Copy entire file1
:e file2.txt             " Open target file
p                        " Paste content
```

---

# 🧬 Git CLI Quick Reference

```bash
git add .                    # Stage all changes
git restore --staged <file>  # Unstage file
git log                      # View commit log
git reset <commit>           # Reset to commit
git stash                    # Stash current changes
git stash pop                # Reapply stashed changes
git stash clear              # Delete all stashes

git remote add origin <url>  # Add remote repo
git push origin master       # Push to remote master

git fetch --all --prune      # Fetch & clean old branches
git pull upstream main       # Pull latest from upstream
git reset --hard upstream/main  # Reset to upstream state

git rebase -i <commit>       # Interactive rebase (e.g., squash commits)
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
### 🔹 Basic Increment (Normal/Visual Mode)
- Move the cursor over a number.
- Press `Ctrl-a` to increment it by 1.
- Press `Ctrl-x` to decrement it.

---
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
### 🔁 Dot Formula

Make repeatable changes with the `.` command (repeat last change).

**Example:**
```vim
cwnew<Esc>   " Changes the current word to 'new'
.            " Repeats that change on the next word
```

---

### 🎯 The Power of `g` Commands

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

### 💾 Session Management

Save and restore your Vim session easily:

```vim
:mksession! ~/mysession.vim   " Save current session
vim -S ~/mysession.vim        " Load session later
```

Perfect for picking up right where you left off.

---

### 📁 File Explorer Shortcuts

Use built-in file browsing inside Vim:

- `:Explore` — Open netrw file browser in current window  
- `:Vex` — Open in vertical split  
- `:Sex` — Open in horizontal split  

> 🚀 Tip: Use these to quickly navigate and open files without leaving Vim!


_**References**_
#ref 