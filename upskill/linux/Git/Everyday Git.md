> [!summary]
> The everyday Git loop is inspect, stage intentionally, review the staged diff, commit one coherent change, and inspect the resulting history.

Map: [[Upskill/Linux/Git/Git|Git]]

## Setup and Help

| Command | Purpose |
| --- | --- |
| `git config --global user.name "Your Name"` | Set the author name |
| `git config --global user.email "you@example.com"` | Set the author email |
| `git config --global --edit` | Edit global configuration |
| `git config --local --edit` | Edit repository configuration |
| `git config --list` | List effective configuration |
| `git help <command>` | Open help for a command |
| `git <command> --help` | Open the command manual |

## Start a Repository

| Command | Purpose |
| --- | --- |
| `git init` | Create a repository in the current directory |
| `git init --bare` | Create a repository without a working tree |
| `git clone <url>` | Clone a remote repository |
| `git clone <url> <folder>` | Clone into a chosen folder |
| `git clone --branch <branch> <url>` | Clone and select a branch |
| `git clone --branch <branch> --single-branch <url>` | Clone one branch |
| `git clone --depth=1 <url>` | Clone a shallow history |

## Daily Loop

```bash
git status
git diff
git add -p
git diff --staged
git commit -m "Explain the change"
git log --oneline --graph --decorate -10
```

| Command | Purpose |
| --- | --- |
| `git status` | Show working-tree and index state |
| `git add <file>` | Stage a file |
| `git add -p` | Stage selected chunks |
| `git add -u` | Stage modified and deleted tracked files |
| `git add --all` | Stage all changes |
| `git diff` | Review unstaged changes |
| `git diff --staged` | Review the next commit |
| `git commit` | Commit using the configured editor |
| `git commit -m "message"` | Commit with an inline message |
| `git commit -am "message"` | Stage and commit modified tracked files |
| `git commit --amend` | Replace the latest commit |
| `git commit --amend --no-edit` | Amend without changing its message |
| `git commit --fixup <commit>` | Create a fixup commit for autosquash |
| `git show <commit>` | Inspect one commit |
| `git log -p <file>` | Inspect a file's patch history |

> [!tip]
> Prefer a small coherent commit over staging the entire working tree automatically. `git add -p` makes the boundary visible.

## Related

- [[Upskill/Linux/Git/Branches and Remotes|Branches and Remotes]]
- [[Upskill/Linux/Git/Recovery and History|Recovery and History]]

#git

---

## References

- [Everyday Git](https://git-scm.com/docs/everyday) - Task-oriented official command guide.
- [Git Basics](https://git-scm.com/book/en/v2/Git-Basics-Getting-a-Git-Repository) - Repository and commit fundamentals.
