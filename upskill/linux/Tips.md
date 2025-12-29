---
title: Tips
tags:
  - tips
  - "#bash"
  - "#ref"
date: 2025-12-07
---


```bash
# Some tips and tricks I've picked up along the way
# these are some things I use almost everyday

# see all the commands you've run
# the amount set depends on $HISTSIZE
history

# you can pipe into grep to search in history
history | grep "search-term"

# I use pipe a lot
# this lets me view all subdirectories in less
# and it acts like vim
ls -R | less

# when you found a command you want to rerun from history
!100

# rerun last command:
!!

# rerun last command but with sudo
sudo !!

# redirecting output to a file
uname -a >uname.log

# the > truncates the file, it will erase everything and
# add in the new contents
#
# the >> appends to the file, it will add in after the last
# the file

# awk is useful for parsing text from previous output
nmcli c show | awk '{ print $1 }'
nmcli c show | grep '\-\-' | awk '{ print $2; }' | while read con; do sudo nmcli c delete $con; done

# just run a really long command but made an error?
# fix command -- this will put the command into your system's
# text editor (nano,vim,emacs,etc)
# as soon as you save and quit, it will run with your changes
fc

# how about an on-the-fly shell script?
# hold: control + x + e
# acts much like fc
# write out the script you want and save and quit

# disown
# if you have a really long running process that your server might kick you off
# depending on the ssh timeout
# run control + x to put it in the bg
bg
disown -a
exit

```

| `jobs`         | Lists all background tasks.                             |
| -------------- | ------------------------------------------------------- |
| `fg %<number>` | Brings a background job (e.g., `%3`) to the foreground. |
| `lsof -i`      | Shows which process is using a specific network port.   |

| `df -H`           | Shows disk usage in human-readable units (GB/MB).        |
| ----------------- | -------------------------------------------------------- |
| `du -sh`          | Shows size of each file/folder in the current directory. |
| `free -h`         | Displays memory (RAM) usage in human-readable format.    |
| `uname -a`        | Prints detailed system information.                      |
| `whoami`          | Shows the current logged-in user.                        |
| `id`              | Shows user ID, group ID, and groups.                     |
| `uptime`          | Shows how long the system has been running.              |
| `ping <host>`     | Basic network connectivity test.                         |
| `wget <url>`      | Downloads a file from the internet.                      |
| `curl <url>`      | Transfers data (commonly HTTP requests).                 |
| `which <program>` | Shows the full path of an executable.                    |

| `echo "<message>"`           | Prints a message; widely used in scripts.       |
| ---------------------------- | ----------------------------------------------- |
| `useradd <name>`             | Creates a new user.                             |
| `su <user>`                  | Switches to another user.                       |
| `sudo`                       | Runs a command with superuser privileges.       |
| `systemctl status <service>` | Shows service status.                           |
| `systemctl start <service>`  | Starts a service.                               |
| `systemctl enable <service>` | Enables service to start on boot.               |
| `journalctl -u <service>`    | Shows logs for a systemd service.               |
| `history`                    | Shows recently executed commands.               |
| `crontab -e`                 | Edit cron jobs.                                 |
| `crontab -l`                 | List cron jobs.                                 |
| `!!`                         | Re-runs the previous command.                   |
| `Ctrl + R`                   | Reverse-search your command history.            |
| `man <command>`              | Shows documentation/manual for a command.       |
| `ssh-keygen`                 | Generates an SSH key pair.                      |
| `awk`                        | Text processing (e.g., extract columns).        |
| `sed`                        | Stream editing (e.g., find & replace in files). |

##  Git CLI Quick Reference

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



### `<(command)` - Input Substitution (Read From)

```bash
# Creates a **readable pseudo-file** containing command output.
diff <(sort file1) <(sort file2)
```
### `>(command)` - Output Substitution (Write To)

```bash
# Creates a **writable pseudo-file** that feeds into a command.
./myprogram 2> >(tee errors.log)
```

| Syntax   | Direction         | Purpose                              | Mental Model                  |
| -------- | ----------------- | ------------------------------------ | ----------------------------- |
| `<(cmd)` | **Output → File** | Read command output as a file        | "Give me a file to read from" |
| `>(cmd)` | **File → Input**  | Write to a file that feeds a command | "Give me a file to write to"  |

**Old way:**
```bash
wget https://example.com/config.txt
vi config.txt
rm config.txt  # cleanup
```

**Cool way:**
```bash
vi <(curl https://example.com/config.txt)
```

Opens in Vim as editable buffer. Save with `:w myconfig.txt`. No download clutter.

**Old way:**
```bash
sort file1 > /tmp/sorted1
sort file2 > /tmp/sorted2
diff /tmp/sorted1 /tmp/sorted2
rm /tmp/sorted1 /tmp/sorted2
```

**Cool way:**
```bash
diff <(sort file1) <(sort file2)
```

```bash
diff original.txt <(sed 's/rabbit/groundhog/I' original.txt)
```

Shows exactly what changes without touching `original.txt`. Safe experimentation FTW.


```bash
./myprogram 2> >(tee errors.log) | less
```

```bash
tar cf - mydir | tee >(ssh server1 "tar xf -") >(ssh server2 "tar xf -") > /dev/null
```

**The breakdown:**
- `tar cf -` → Archive to stdout (not a file)
- `tee` → Split stream to multiple destinations
- `>(ssh server1 "tar xf -")` → Appears as writable file, actually pipes over SSH
- Both servers extract **in parallel** while receiving
- `> /dev/null` → Discard the final copy (already went everywhere)


```bash
cat file1 file2 | vi -  # Opens as stdin buffer, awkward to save
```

**Process substitution (smooth):**
```bash
vi <(cat file1 file2)
```
Vim sees a "real file" it can edit and save normally. Full editor powers unlocked.

- **Where they live:** `/dev/fd/11`, `/proc/self/fd/12` (temporary virtual files)
- **Shell support:** Bash, Zsh, Ksh ✅ | POSIX sh ❌
- **Lifetime:** Exists only during command execution
- **Cleanup:** Automatic—no orphaned files
