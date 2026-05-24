# Git Commands Cheat Sheet

This combines the commands from the Reddit cheat sheets plus useful commands suggested in the comments.

Beginner note: prefer `git switch` for branch movement and `git restore` for file restoration. `git checkout` still works, but it does several unrelated jobs, so it is easier to teach later as legacy/multi-purpose Git.

## Setup and Help

| Command | What it does |
| --- | --- |
| `git config --global user.name "Your Name"` | Set your Git author name globally |
| `git config --global user.email "you@example.com"` | Set your Git author email globally |
| `git config --global --edit` | Edit global Git config |
| `git config --local --edit` | Edit repo-local Git config |
| `git config --list` | List Git config values |
| `git help <command>` | Show help for a Git command |
| `git <command> --help` | Show manual page for a Git command |
| `git config alias.co checkout` | Create an alias, for example `git co` |

## Starting a Repo

| Command | What it does |
| --- | --- |
| `git init` | Start a new local repository |
| `git init --bare` | Start a bare repository, usually for shared/remotes |
| `git clone <url>` | Clone a remote repository |
| `git clone <url> <folder>` | Clone into a specific folder |
| `git clone --branch <branch> <url>` | Clone and check out a specific branch |
| `git clone --branch <branch> --single-branch <url>` | Clone only one branch |
| `git clone --depth=1 <url>` | Shallow clone with limited history |

## Daily Workflow

| Command | What it does |
| --- | --- |
| `git status` | Check repo status |
| `git add <file>` | Stage a file |
| `git add .` | Stage changes under the current directory |
| `git add -u` | Stage modified/deleted tracked files |
| `git add --all` | Stage all changes, including deletions |
| `git add -p` | Interactively stage chunks |
| `git commit` | Commit staged changes using your editor |
| `git commit -v` | Commit with diff context in the editor |
| `git commit -m "message"` | Commit staged changes with a message |
| `git commit -am "message"` | Stage and commit modified tracked files |
| `git commit --amend` | Edit the last commit |
| `git commit --amend --no-edit` | Add staged changes to the last commit without changing its message |
| `git commit --amend --no-edit --reset-author` | Amend last commit and reset author metadata |
| `git commit --fixup <commit>` | Create a fixup commit for later autosquash |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |
| `git diff --cached` | Same as `git diff --staged` |
| `git log` | Show commit history |
| `git log --oneline` | Show one line per commit |
| `git log --oneline --graph --decorate` | Compact branch graph |
| `git log --graph --decorate --all` | Graph view of all refs |
| `git log -1 -p` | Show the latest commit with patch |
| `git log -p <file>` | Show patch history for a file |
| `git log --since="1 week ago"` | Filter commits by date |
| `git show <commit>` | Show one commit |

## Branching

| Command | What it does |
| --- | --- |
| `git branch` | List branches |
| `git branch <name>` | Create a branch |
| `git switch <name>` | Switch to a branch |
| `git switch -` | Switch to the previous branch |
| `git switch -c <name>` | Create and switch to a branch |
| `git merge <branch>` | Merge a branch into the current branch |
| `git merge --no-ff <branch>` | Merge while preserving a merge commit |
| `git merge -` | Merge the previous branch |
| `git rebase <branch>` | Rebase current branch onto another branch |
| `git rebase -i HEAD~<n>` | Interactive rebase the last N commits |
| `git rebase --onto <new-base> <old-base> <branch>` | Move a branch range onto a new base |
| `git rebase -i --autosquash <base>` | Interactive rebase with fixup/squash commits arranged |
| `git cherry-pick <commit>` | Apply a specific commit |
| `git branch -d <name>` | Delete a merged local branch |
| `git branch -D <name>` | Force delete a local branch |
| `git branch -m <old> <new>` | Rename a branch |
| `git worktree add <path> <branch>` | Check out another branch in another directory |
| `git worktree list` | List worktrees |
| `git bisect start` | Start binary search for a bad commit |
| `git bisect good <commit>` | Mark a commit as good during bisect |
| `git bisect bad <commit>` | Mark a commit as bad during bisect |
| `git bisect reset` | End bisect and return to normal |

## Remotes

| Command | What it does |
| --- | --- |
| `git remote -v` | Show remotes |
| `git remote add origin <url>` | Add a remote named `origin` |
| `git remote rename origin upstream` | Rename a remote |
| `git remote set-url origin <new-url>` | Change a remote URL |
| `git push -u origin <branch>` | Push a branch and set upstream |
| `git push` | Push current branch |
| `git push origin HEAD` | Push current branch to same-named remote branch |
| `git push --force-with-lease` | Force push more safely |
| `git push origin HEAD --force` | Force push current branch; use carefully |
| `git push origin <tag>` | Push one tag |
| `git push origin --tags` | Push all tags |
| `git push --delete origin <name>` | Delete a remote branch |
| `git push -o ci.skip` | Push with a server option to skip CI, where supported |
| `git push -o merge_request.create` | Push with a server option to create a merge request, where supported |
| `git pull` | Fetch and merge latest changes |
| `git pull origin <branch>` | Pull a specific branch |
| `git pull --rebase` | Fetch and rebase instead of merge |
| `git fetch` | Fetch branches/tags without merging |
| `git fetch --prune` | Remove local refs for deleted remote branches |

## Undo and Fix

| Command | What it does |
| --- | --- |
| `git restore <file>` | Discard local changes in a file |
| `git restore --staged <file>` | Unstage a file |
| `git restore --source=HEAD~<n> <file>` | Restore a file from an older commit |
| `git reset <file>` | Unstage a file |
| `git reset HEAD <file>` | Unstage a file |
| `git reset --mixed HEAD <file>` | Unstage a file, keeping working tree changes |
| `git reset --soft HEAD~1` | Undo last commit, keeping changes staged |
| `git reset --hard HEAD` | Reset tracked files to the last commit |
| `git revert <commit>` | Create a new commit that undoes an old commit |
| `git reflog` | Show recent ref movements as a safety net |
| `git clean -fd` | Delete untracked files/directories |
| `git rm --cached <file>` | Stop tracking a file but keep it locally |
| `git rm <file>` | Remove a file and stage the deletion |
| `git mv <old> <new>` | Rename or move a file |
| `git apply <patch-file>` | Apply a patch file |

## Stash

| Command | What it does |
| --- | --- |
| `git stash` | Save uncommitted changes |
| `git stash push -m "message"` | Save stash with a message |
| `git stash push --staged -m "message"` | Stash only staged changes |
| `git stash list` | Show stash list |
| `git stash show stash@{n}` | Show a stash summary |
| `git stash apply stash@{n}` | Apply a specific stash |
| `git stash pop` | Apply and remove the latest stash |
| `git stash drop stash@{n}` | Remove a specific stash |
| `git stash clear` | Remove all stashes |

## Tags

| Command | What it does |
| --- | --- |
| `git tag <tag>` | Create a tag |
| `git tag` | List tags |
| `git tag -d <tag>` | Delete a local tag |
| `git push origin <tag>` | Push one tag |
| `git push origin --tags` | Push all tags |

## History and Inspection

| Command | What it does |
| --- | --- |
| `git diff <commit1> <commit2>` | Diff between commits |
| `git diff --staged <commit>` | Diff staged changes against a commit |
| `git diff-tree --no-commit-id --name-only -r <commit>` | List files changed in a commit |
| `git blame <file>` | Show who last changed each line |
| `git shortlog -sn` | Show commit counts by author |
| `git log --follow --find-copies-harder -- <file>` | Follow file history across renames/copies |

## Advanced Maintenance

These are useful, but they are not beginner-first daily commands.

| Command | What it does |
| --- | --- |
| `git gc` | Run repository cleanup/optimization |
| `git prune` | Remove unreachable objects |
| `git fsck` | Check repository object integrity |

## Legacy or Multi-Purpose Checkout

Prefer `switch` and `restore` when teaching beginners, but these are common in older docs and existing workflows.

| Command | Prefer this today | What it does |
| --- | --- | --- |
| `git checkout <branch>` | `git switch <branch>` | Switch branch |
| `git checkout -b <name>` | `git switch -c <name>` | Create and switch branch |
| `git checkout -- <file>` | `git restore <file>` | Discard local file changes |
