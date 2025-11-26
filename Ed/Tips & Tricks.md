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