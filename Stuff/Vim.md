h, j, k, l - cursor movement
shift+h - jump to top of screen
shift+l - jump to bottom of screen
shift+m - middle of the screen
shift+j - joins next line to current line with space
shift+k - searches and turns up manual/help fro the word
**i -** Inserting before the cursor
**I -** inserting at the beginning of a line
**a -** inserting after the cursor
**A -** inserting at the end of the line
**w -** Jumping to start of nxt word (shift+w also works but slight diff)
**e -** Jumping to end of nxt word
b - jumping to start of prev word (shift+b works but slight diff)
gg - goes to first line
dd - cuts the line
shift+G - goes to last line ( 1 shift g - goes to first line, 8 shift g - goes to 8th line )
yy - copy line (2yy copies 2 lines and so on)
dd - delete line / cut line (2dd cuts 2 lines and vice-versa)
p - paste the lines
u - undo
ctrl + r - redo
f-jumps → f + ‘char’ goes to that next char and to move forward - ; backward - ,
y+i+b(block) or any char yanks text inside the char, and using y+a yanks along with char
c+i+w changes word under our cursor  
. → replays what we done previously  

%s/<word>/<word_need_to_replace>/gc
v+i+w select word visually; y - yanks(copies); p-paste
:reg to know the contents of register in vim
use type command in the list and “ + <no> + p to paste the reg content
now to yank them go to visual mode, select text, “ + <reg_no> + y
also, use * reg to throughout accessibility “ + * + y
to paste file name “ + % + y
let @*=@% gives file name to global clipboard
to record a macro use q + <any_variable> and record and q to end; now @<any_variable> to use again, 5+@+<variable> does 5 times
to make same changes for multiple lines at the start or end - v(visual mode) + :norm + I(shift + i insert at start) or A(shift +a insert and end) + type what needs to be appended.  
:bd! to delete buffer  
or we can use ctrl + v to select each first line and then shift+i to insert at first position and esc to apply changes  
or :1,10 normal I text_to_append  
or select in visual mode and : s/^/text_to_append/  
press $ sign to select full line  

you can inc/dec num value using C-x,C-a  
you can select some lines with numbers and use C-a to increment all of them by 1, or press G and C-a to cumulatively increase them by 1  
o for switching selection direction  
% for selection on basis of braces [,{,(  

v+i+“ - selecting inside quotes only, v+a+” - selecting quotes too  
w- next limited char  
W- next white space  
select in visual mode and in command mode : !jq . prettifies json  
same we can use ! sort ! uniq bash commands in vim  
C-o (backkward in jumplist)
C-i (forward in jumplist)
Click * on a word and you can search for that word  
  
  

- **Open both files in Vim:**
    
    ```Bash
    vim file1.txt file2.txt
    ```
    
- **Switch to the first file (if not already there):**
    - Use `:bn` (buffer next) or `:bp` (buffer previous) to navigate between files.
- **Copy all lines from** `**file1.txt**`**:**
    - Press `ggVGy`
- **Switch to the second file (**`**file2.txt**`**):**
    - Type `:bn` or `:e file2.txt`
- **Paste the copied lines:**
    - Move the cursor to the desired location and press `p`

  
If we select something for example, shift+v and j selects some lines now unselect them after this we can do g and v to reselect them.  
Also,  
  

Moving up and down: `[:m](http://vimdoc.sourceforge.net/htmldoc/change.html#:m)` for move

`:m +1` - moves down 1 line

`:m -2` - move up 1 lines  
  
`:m 3` - move the line after 3rd line (replace 3 to any line you'd like)

Moving multiple lines:

`[V](http://vimdoc.sourceforge.net/htmldoc/visual.html#V)` (i.e. Shift-V) and move courser up and down to select multiple lines in VIM

once selected hit : and run the commands above, `m +1` etc  
  
In insert mode, we can use  
`ctrl+H` to remove just left char, `ctrl+W` to remove entire word, `ctrl+U` to remove entire line to left.  
  
While opening a file we can specify the line no to focus on going into, vi <file_name> +line_no  
  
Also, we can use :17t. to copy 17th line to current line  

vi `-o` <file-1> <file-2> opens two files in same tab with horizontal split and use `-O` to do it in vertical split

  

When you open multiple files in Vim using the `-o` option, Vim opens them in **horizontal split windows**.

### **Opening Files in Horizontal Split**

```Shell
vim -o file1 file2 file3
```

✅ This opens `file1`, `file2`, and `file3` in separate **horizontal** split windows.

---

### **Navigation Between Split Windows**

Once you have multiple files open in split windows, you can navigate between them using:

### **1️⃣ Move Between Windows**

- `Ctrl + w + w` → Switch to the **next** split window.
- `Ctrl + w + h` → Move to the **left** window.
- `Ctrl + w + l` → Move to the **right** window.
- `Ctrl + w + j` → Move to the **below** window.
- `Ctrl + w + k` → Move to the **above** window.

---

### **2️⃣ Resizing Windows**

- `Ctrl + w + =` → Equalize all windows.
- `Ctrl + w + _` → Maximize the current window **vertically**.
- `Ctrl + w + |` → Maximize the current window **horizontally**.
- `Ctrl + w + +` → Increase the window height.
- `Ctrl + w + -` → Decrease the window height.

---

### **3️⃣ Closing a Window**

- `Ctrl + w + c` → Close the current window.
- `:q` → Close the current window (if multiple windows are open).
- `:qall` → Quit all windows.

---

### **Alternative: Opening Files in Vertical Split**

If you prefer **vertical** splits, use `-O` instead:

```Shell
vim -O file1 file2 file3
```

✅ This opens the files in **vertical split windows**.

For navigating in vertical splits, the same `**Ctrl + w**` shortcuts work.

---

### **Summary**

- `vim -o file1 file2` → Open in **horizontal split**.
- `vim -O file1 file2` → Open in **vertical split**.
- Use `Ctrl + w + {h, j, k, l}` to navigate.
- Resize using `Ctrl + w + +`, `Ctrl + w + -`, or `Ctrl + w +`

### 💡 How to use spell check:

```Bash

set spell
set nospell \#to turn it off
set spelllang=en_us
```

This checks spelling in the current buffer.

Available options:

- `en_us`, `en_gb`, `es`, `fr`, `de`, etc.
- Vim needs a matching dictionary (usually already installed, or you can download it).

### 🔍 Navigating misspellings:

- Move to next misspelling: `]s`
- Move to previous misspelling: `[s`
- Show suggestions: `z=`
- Add word to dictionary: `zg`
- Mark word as bad: `zw`

  

  

  

==**Git**==

---

git add . (stages all changes)

git restore --staged (unstages changes)

git log

git reset <commit-id>

git stash (stashes changes up until and resets master and can pop back changes)

git stash clear

git remote add origin <url> (origin is the name of the url we are about to give)

git push origin master (pushing changes into origin-url from master branch)

  

  

git fetch --all --prune

git reset -- hard upstream/main

  

git pull upstream main (pulls latest into main form upstream-url)

git rebase -i <commit_id> (squashing commits)

  

  

==**References**==

[https://www.digitalocean.com/community/tutorials/linux-commands#the-cat-echo-and-less-commands](https://www.digitalocean.com/community/tutorials/linux-commands#the-cat-echo-and-less-commands)