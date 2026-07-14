> [!summary]
> Recovery starts by identifying whether a change lives in the working tree, index, commits, or reflog, then choosing the least destructive command that fixes that layer.

Map: [[Upskill/Linux/Git/Git|Git]]

## Undo by Layer

| Situation | Command |
| --- | --- |
| Discard an unstaged file change | `git restore <file>` |
| Unstage a file but keep its content | `git restore --staged <file>` |
| Restore a file from another commit | `git restore --source=<commit> <file>` |
| Undo the latest commit and keep changes staged | `git reset --soft HEAD~1` |
| Undo a published commit with a new commit | `git revert <commit>` |
| Recover a moved or deleted reference | `git reflog` |
| Stop tracking a file but keep it locally | `git rm --cached <file>` |

> [!danger]
> `git reset --hard` and `git clean -fd` can permanently remove work. Preview untracked deletion with `git clean -nfd` first.

## Stash

| Command | Purpose |
| --- | --- |
| `git stash push -m "message"` | Save current uncommitted work |
| `git stash push --staged -m "message"` | Stash only staged changes |
| `git stash list` | List stashes |
| `git stash show -p stash@{n}` | Inspect a stash patch |
| `git stash apply stash@{n}` | Apply without deleting it |
| `git stash pop` | Apply and remove the latest stash |
| `git stash drop stash@{n}` | Delete one stash |

## History and Inspection

| Command | Purpose |
| --- | --- |
| `git log --oneline --graph --decorate --all` | Compact branch graph |
| `git diff <a> <b>` | Compare commits |
| `git diff HEAD origin/main --name-only` | List local/remote file differences |
| `git log HEAD..origin/main --oneline` | Show remote commits not in the current branch |
| `git blame <file>` | Attribute the last change to each line |
| `git log --follow -- <file>` | Follow a file through renames |
| `git shortlog -sn` | Count commits by author |

## Tags and Maintenance

| Command | Purpose |
| --- | --- |
| `git tag <tag>` | Create a lightweight tag |
| `git push origin <tag>` | Publish one tag |
| `git tag -d <tag>` | Delete a local tag |
| `git gc` | Optimize repository storage |
| `git fsck` | Check object integrity |

## Legacy Checkout

| Older command | Prefer today |
| --- | --- |
| `git checkout <branch>` | `git switch <branch>` |
| `git checkout -b <name>` | `git switch -c <name>` |
| `git checkout -- <file>` | `git restore <file>` |

## Related

- [[Upskill/Linux/Git/Everyday Git|Everyday Git]]
- [[Upskill/Linux/Git/Branches and Remotes|Branches and Remotes]]

#git

---

## References

- [Undoing Things](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things) - Restore, amend, and reset concepts.
- [Git Tools](https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning) - Stashing, cleaning, and recovery tools.
