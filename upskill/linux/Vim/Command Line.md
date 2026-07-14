Map: [[Upskill/Linux/Vim/Vim|Vim]]


> [!summary]
> Vim's command line applies Ex commands, ranges, shell commands, and file statistics without leaving the editor.

## ⚡ Running External Commands
```vim
:'<,'>!sort              " Sort lines
:'<,'>!uniq              " Remove duplicates
:'<,'>!jq .              " Prettify JSON
:!<bash_command>         " Run any shell command
```

---


## Vim Shell
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

## Related

- [[Upskill/Linux/Vim/Files Buffers and Windows|Files Buffers and Windows]]
- [[Upskill/Linux/Vim/Shell Filters and Advanced Commands|Shell Filters and Advanced Commands]]
