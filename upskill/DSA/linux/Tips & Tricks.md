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
