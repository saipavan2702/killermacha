> [!summary]
> Filters, global commands, normal-mode replay, ranges, and external tools turn Vim into a programmable text-processing environment.

Map: [[Upskill/Linux/Vim/Vim|Vim]]
Connections: [[Upskill/Linux/Vim/Command Line|Command Line]]

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


---
