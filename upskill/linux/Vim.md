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
Perfect for picking up right where you left off.
```vim
:mksession! ~/mysession.vim   " Save current session
vim -S ~/mysession.vim        " Load session later
```
---
### 📁 File Explorer Shortcuts

Use built-in file browsing inside Vim:

- `:Explore` — Open netrw file browser in current window  
- `:Vex` — Open in vertical split  
- `:Sex` — Open in horizontal split  

---
### Vim Shell 
- **`!{motion}`** - Filter text through a shell command in normal mode
- **`!`** (in visual mode) - Filter selected text through a shell command
- **`x`** - Delete selected text (useful before filtering)
- **`gv`** - Reselect the last visual selection
- **`!nl`** - Number lines using the `nl` (number lines) command
- **`!nl -w1 -s.`** - Custom formatting: width of 1, dot separator (e.g., `1.`, `2.`)
- **`:%!uniq`** - Remove duplicate consecutive lines across entire file (`%`)
- Note: `uniq` requires sorted input to work properly; for unsorted files, use `sort | uniq`
- **`:r !{command}`** - Read (insert) output of shell command at cursor position
- **`:0r !{command}`** - Insert at beginning of file
- **`:-1r !{command}`** - Insert above current line
#### Date/Time Insertion
- **`:r !date`** - Insert current date and time
- **`:r !date +%F`** - Insert date in YYYY-MM-DD format
- **`:r !date '+%Y-%m-%d %H:%M:%S'`** - Custom timestamp format

#### File Statistics
- **`:r !wc -l -w -m filename.txt`** - Insert line count, word count, and character count
  - `-l` = lines
  - `-w` = words  
  - `-m` = characters
- **`:r !wc -l *.txt | sort -n`** - Count lines in multiple files and sort numerically

#### Other Useful Examples
- **`:r !ls -la`** - Insert directory listing
- **`:r !whoami`** - Insert current username
- **`:r !pwd`** - Insert current working directory


- **`:sort`** - Sort lines alphabetically
- **`:sort u`** - Sort lines and remove duplicates  similar to **`:%!sort | uniq`**
- **`:sort n`** - Sort numerically
- **`:%s/\s\+/ /g`** - Replace multiple consecutive spaces with a single space
  - `%` = entire file
  - `\s\+` = one or more whitespace characters
  - `/g` = global (all occurrences on each line)
#### Column Command
- **`:%!column -t`** - Format text into aligned columns
- **`:%!column -t -s' '`** - Use space as delimiter
  - `-t` = create table
  - `-s' '` = set delimiter to space
  - Aligns columns at first character of each word

**Before:**
```
Name Age City
John 25 NYC
Jane 30 LA
```

**After `:%!column -t -s' '`:**
```
Name  Age  City
John  25   NYC
Jane  30   LA
```
You can chain shell commands using pipes:
```vim
:%!sort | uniq                    " Sort and remove duplicates
:%!grep "pattern" | wc -l         " Count matching lines
:%!cut -d',' -f1,3 | column -t    " Extract CSV columns and format
```
### Range-Based Operations
- **`:10,20!sort`** - Sort lines 10-20 only
- **`:.,.+5!nl`** - Number current line plus next 5 lines
- **`:'<,'>!column -t`** - Format visual selection as table

| Command Pattern | Purpose                 | Example                   |
| --------------- | ----------------------- | ------------------------- |
| `!{motion}`     | Filter through shell    | `!}sort` (sort paragraph) |
| `:%!{cmd}`      | Filter entire file      | `:%!uniq`                 |
| `:r !{cmd}`     | Read command output     | `:r !date`                |
| `:'<,'>!{cmd}`  | Filter visual selection | `:'<,'>!column -t`        |
| `gv`            | Reselect last selection | After `x`, use `gv!nl`    |
###  Filter a visual selection through a shell command
* `-w1` → number width = 1
* `-s.` → separator is a dot (`1.` instead of `1\t`)
###  Insert word/line/character count of files
```vim
:r !wc -l -w -m path/to/file
```
Outputs:
```
lines  words  characters  filename
```

```vim
:r !wc -l *.txt | sort -n
```
**Explanation**
* `-t` → create table
* `-s' '` → split columns on spaces
```vim
!command      " filter selection
gv            " reselect last visual
:%!command    " run on entire file
:r !command   " insert command output
```

Here are your polished examples for using stdin/stdout with Vim commands:

## Piping Text Through External Commands

**Basic Concept:**
Lines passed as a text blob to stdin (newlines preserved)
- Same as: `echo "line1\nline2\nline3" | cmd`
- Command reads stdin however it wants
- stdout (with newlines) replaces selection

## Practical Examples

**Quick Reference Lookups:**
```vim
:!tldr <C-r><C-w>
```
Get tldr documentation for word under cursor

```vim
:!man <C-r><C-w>
```
Open man page for word under cursor

```vim
:!curl cht.sh/<C-r><C-w>
```
Fetch cheat.sh lookup for word under cursor

**Insert Current Date:**
```vim
:r !date
```
Insert current date at cursor position

**Key Mapping:**
- `<C-r><C-w>` - Insert word under cursor into command line

---

**Pro Tip:** This works with ANY command-line tool that reads from stdin and writes to stdout—perfect for text transformation, formatting, or quick lookups without leaving Vim!

| Command        | What It Does                                | Use Case                                 |
| -------------- | ------------------------------------------- | ---------------------------------------- |
| `:!cmd`        | Run command, show output (pauses Vim)       | Quick shell access without leaving Vim   |
| `:r !cmd`      | Insert command output below cursor          | Embed external data into your file       |
| `:.!cmd`       | Filter current line through command         | Transform single line in-place           |
| `:%!cmd`       | Filter entire buffer through command        | Apply transformation to whole file       |
| `!!cmd`        | Filter current line (normal mode shortcut)  | Quick single-line filtering              |
| `!{motion}cmd` | Filter motion range through command         | Transform text blocks (paragraphs, etc.) |
| `:.w !cmd`     | Send current line to command (preview only) | Test command without modifying file      |
| `:'<,'>w !cmd` | Send visual selection to command (preview)  | Preview transformation before applying   |
```vim
:!cmd
```
- Runs a shell command
- Shows output in a separate screen
- **Does not modify your file**
- Pauses Vim until you press Enter
- Returns you to editing afterward

### Examples
```vim
:!ls -la                    " List directory contents
:!git status                " Check git status
:!python script.py          " Run a Python script
:!make                      " Compile your project
:!grep "TODO" *.txt         " Search across files
```

```vim
:r !cmd         " Insert below current line
:0r !cmd        " Insert at top of file
:-1r !cmd       " Insert above current line
```
- Executes shell command
- **Inserts output into your buffer** at cursor position
- Does not replace existing text

### Examples
```vim
:r !date                           " Insert current timestamp
:r !date +\%Y-\%m-\%d              " Insert formatted date
:r !ls -1                          " Insert file listing
:r !cat header.txt                 " Insert contents of another file
:r !curl -s api.example.com/data   " Insert API response
:r !seq 1 10                       " Insert numbers 1-10
:r !figlet "Hello"                 " Insert ASCII art banner
```

```vim
:.!cmd          " Filter current line
:5!cmd          " Filter line 5
```
- Sends current line to shell command
- **Replaces line with command output**
- Works on specific line numbers

### Examples
```vim
:.!tr '[:lower:]' '[:upper:]'      " Convert line to UPPERCASE
:.!sort                             " Sort words on current line
:.!rev                              " Reverse characters in line
:.!base64                           " Encode line in base64
:.!jq .                             " Format JSON on current line
```

```vim
:%!cmd
```
- Sends **entire buffer** to shell command
- Replaces all content with command output
- The `%` represents all lines (1 to $)

### Examples
```vim
:%!sort                    " Sort all lines alphabetically
:%!sort -u                 " Sort and remove duplicates
:%!uniq                    " Remove consecutive duplicate lines
:%!column -t               " Format as aligned table
:%!jq .                    " Pretty-print entire JSON file
:%!xmllint --format -      " Format XML document
:%!python -m json.tool     " Format JSON using Python
:%!tr -d '\r'              " Remove Windows carriage returns
```

```vim
!!cmd
```
- **Normal mode shortcut** for `:.!cmd`
- Filters current line through command
- Faster than typing the colon commands

### Examples
```vim
!!sort          " Sort current line
!!uniq          " Remove duplicates from line
!!rev           " Reverse the line
!!nl            " Number the current line
```

```vim
!{motion}cmd
```
- Filters text defined by a Vim motion
- Powerful for operating on logical text blocks
- Combines Vim's movement with shell power

| Motion | What It Selects              |
| ------ | ---------------------------- |
| `ip`   | Inner paragraph              |
| `}`    | Until next blank line        |
| `G`    | From cursor to end of file   |
| `gg`   | From cursor to start of file |
| `5j`   | Current line + 5 lines down  |

### Examples
```vim
!ipsort              " Sort current paragraph
!}column -t          " Format next paragraph as table
!Gsort               " Sort from here to end of file
!5jnl                " Number next 5 lines
!ggtr 'a-z' 'A-Z'    " Uppercase from cursor to top
```

```vim
:.w !cmd              " Preview current line
:5,10w !cmd           " Preview lines 5-10
```
- **Sends line to command but doesn't modify buffer**
- Output appears below (like `:!cmd`)
- Perfect for testing commands before applying them

### Examples
```vim
:.w !wc -w                    " Count words in current line
:.w !python                   " Test Python code on current line
:.w !bash                     " Execute current line as shell script
:1,10w !grep "error"          " Preview grep results on first 10 lines
:.w !column -t                " See how table formatting would look
```

```vim
:'<,'>w !cmd
```
- Sends **visual selection** to command
- Shows output without modifying buffer
- The `'<,'>` automatically appears when you type `:` in visual mode

### Examples
```vim
" Select text with v, V, or Ctrl-v, then:
:'<,'>w !wc -l                " Count selected lines
:'<,'>w !sort | uniq -c       " Preview sort + count duplicates
:'<,'>w !python3              " Test selected Python code
:'<,'>w !jq .                 " Preview JSON formatting
:'<,'>w !column -t            " Preview table alignment
```

| Want to...              | Command Pattern     | Example                           |
| ----------------------- | ------------------- | --------------------------------- |
| **Replace** single line | `:.!cmd` or `!!cmd` | `:.!sort`                         |
| **Replace** entire file | `:%!cmd`            | `:%!jq .`                         |
| **Replace** selection   | `:'<,'>!cmd`        | Select text, then `:'<,'>!sort`   |
| **Replace** by motion   | `!{motion}cmd`      | `!ipsort`                         |
| **Preview** single line | `:.w !cmd`          | `:.w !wc -w`                      |
| **Preview** selection   | `:'<,'>w !cmd`      | Select, then `:'<,'>w !column -t` |
```vim
" 1. Preview how it will look
:'<,'>w !column -t

" 2. If good, apply it
:'<,'>!column -t
```

```vim
" 1. Preview formatting
:.w !jq .

" 2. Apply to entire file
:%!jq .
```

```vim
" Position cursor in paragraph, then:
!ipsort
```


✨ **The Difference Between `!` and `w !`**
- `!` = **Filter** (replace text with output)
- `w !` = **Preview** (send text to command, show output, keep original)

✨ **Repeat Last Command**
- After using any `!` command, press `.` to repeat it

✨ **Combine Commands with Pipes**
```vim
:%!sort | uniq -c | sort -rn    " Sort, count, then sort by frequency
```


A collection of powerful Neovim features that require no plugins.
### Shell Filters (`!`)
**Insert command output:**
- `!!date` - Replace current line with date output
- `!!jq .` - Format JSON on current line

**Filter text through commands:**
- `!ip sort` - Sort current paragraph
- `!<motion> <command>` - Filter any text object through a command
### Sequential Numbering
**Steps:**
1. Visually select lines
2. `:norm I0. ` - Insert "0. " at start of each line
3. `gv` - Reselect previous selection
4. `g Ctrl-a` - Auto-increment numbers (1, 2, 3...)

### Global Command (`:g`)
Execute commands on lines matching a pattern.
**Syntax:** `:g/pattern/command`

**Examples:**
- `:g/TODO/d` - Delete all lines containing "TODO"
- `:g/^func/norm A;` - Append semicolon to lines starting with "func"
- `:'a,'bs/old/new/g` - Substitute between marks 'a' and 'b'
### Special Registers

Access dynamic content with `Ctrl-r`.
**In command mode:**
- `Ctrl-r Ctrl-w` - Paste word under cursor

**In insert mode:**
- `Ctrl-r =` - Expression register (evaluate math)
  - Example: `Ctrl-r =` then type `9-9` → inserts `0`
### Normal Command (`:norm`)
Execute normal mode keystrokes on ranges/selections.

**Examples:**
- `:norm I- ` - Add bullet points to selected lines
- `:norm A;` - Append semicolon to each line
- `:'a,'b norm I// ` - Comment out lines between marks
### Navigation with `g`
Quick jumps and selection recovery.

- `gi` - Jump to last insert position and enter insert mode
- `gv` - Reselect last visual selection
### Marks and Jump Points
Automatic bookmarks for efficient navigation.

**Jump commands:**
- ` `` ` (backtick backtick) - Jump to exact character of last edit
- `'.` (backtick dot) - Jump to line of last edit
- `'"` (backtick quote) - Jump to cursor position when file was last closed

**Named marks:**
- `ma` - Set mark 'a'
- `` `a `` - Jump to mark 'a'
- `:'a,'b<command>` - Execute command between marks

### Command-Line Window
Edit command history like a buffer.

**Access:**
- `q:` - Open command history window (normal mode)
- `Ctrl-f` - Open while in command-line mode

**Usage:**
- Navigate with normal mode motions
- Edit any command
- Press `Enter` to execute

### Substitution Preview
Real-time preview of search and replace.

**Setup:** `:set inccommand=nosplit`
**Effect:**
- When typing `:s/fox/cat`, changes preview live in buffer
- See results before confirming

### Copy and Move Commands
Efficient line manipulation.

**Copy (`:t`):**
- `:t.` - Duplicate current line below
- `:1t$` - Copy line 1 to end of file
- `:5t10` - Copy line 5 to after line 10

**Move (`:m`):**
- `:m+1` - Move current line down one position
- `:1m+1` - Swap line 1 with line 2
- `:5m10` - Move line 5 to after line 10

### Bonus: Remote Neovim
Control Neovim from external scripts/terminals.

**Start as server:**
```bash
nvim --listen /tmp/nvimsocket
```

**Send commands remotely:**
```bash
nvim --server /tmp/nvimsocket --remote-send "ggI# Remote<Esc>"
```
This allows AI tools or scripts to control your editor instance.


#ref #vim

#vim #bash #ref
