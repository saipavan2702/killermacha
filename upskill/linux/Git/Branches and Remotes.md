> [!summary]
> Branches separate lines of work; merge or rebase integrates them, while remotes exchange commit history with other repositories.

Map: [[Upskill/Linux/Git/Git|Git]]

## Branches

| Command | Purpose |
| --- | --- |
| `git branch` | List local branches |
| `git branch <name>` | Create a branch |
| `git switch <name>` | Switch branches |
| `git switch -` | Return to the previous branch |
| `git switch -c <name>` | Create and switch |
| `git branch -d <name>` | Delete a merged branch |
| `git branch -D <name>` | Force-delete a local branch |
| `git branch -m <old> <new>` | Rename a branch |

Prefer `git switch` for branch movement. Older documentation often uses the multi-purpose `git checkout` command.

## Integrate Work

| Command | Purpose |
| --- | --- |
| `git merge <branch>` | Merge another branch into the current branch |
| `git merge --no-ff <branch>` | Preserve a merge commit |
| `git rebase <branch>` | Replay current commits on another base |
| `git rebase -i HEAD~<n>` | Edit recent local history |
| `git rebase -i --autosquash <base>` | Arrange fixup commits automatically |
| `git cherry-pick <commit>` | Apply one selected commit |

> [!warning]
> Rebasing rewrites commit identities. It is useful for a personal feature branch, but avoid rewriting shared history without coordination.

## Remotes

| Command | Purpose |
| --- | --- |
| `git remote -v` | List remotes and URLs |
| `git remote add origin <url>` | Add a remote |
| `git remote set-url origin <url>` | Change a remote URL |
| `git fetch --prune` | Download refs and remove stale remote-tracking refs |
| `git pull --rebase` | Fetch and replay local work |
| `git push -u origin <branch>` | Push and set the upstream |
| `git push origin HEAD` | Push the current branch by name |
| `git push --force-with-lease` | Replace remote history only if it has not moved unexpectedly |
| `git push --delete origin <branch>` | Delete a remote branch |

## Advanced Branch Tools

| Command | Purpose |
| --- | --- |
| `git worktree add <path> <branch>` | Open another branch in another directory |
| `git worktree list` | List worktrees |
| `git bisect start` | Begin binary search for a bad commit |
| `git bisect good <commit>` | Mark a known-good commit |
| `git bisect bad <commit>` | Mark a known-bad commit |
| `git bisect reset` | End the bisect session |

## Related

- [[Upskill/Linux/Git/Everyday Git|Everyday Git]]
- [[Upskill/Linux/Git/Recovery and History|Recovery and History]]

#git

---

## References

- [Git Branching](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) - Branch, merge, remote branch, and rebase concepts.
- [Git Remote](https://git-scm.com/docs/git-remote) - Official remote command reference.
