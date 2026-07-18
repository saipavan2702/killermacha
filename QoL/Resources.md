> [!summary]
> Tools, configurations, ideas, and broad reference collections that support the rest of the vault.

## Start Here

- [[QoL/Ideas|Ideas]]
- [[QoL/Configs|Configs]]
- [[Workspace|Workspace]]
- [[QoL/Note System|Note System]]

## Tech References

- [[QoL/Refs/Obsidian|Obsidian]]
- [[Dev Resources|Dev Resources]]
- [[Upskill/CS Topics/Computer Science|Computer Science]]
- [[Upskill/DSA/DSA|DSA]]
- [[Upskill/SysDes/System Design|System Design]]

## System References

- [[QoL/Refs/MacOS|MacOS]]
- [[QoL/Refs/Windows|Windows]]
- [[QoL/Refs/RSS Feeds|RSS Feeds]]

## Personal References

- [[QoL/Refs/Typing|Typing]]
- [[QoL/Refs/Wallpapers|Wallpapers]]
- [[Upskill/Gen Misc/Math/Math|Math]]
- [[Gen Resources|Gen Resources]]
- [[QoL/Refs/Piracy|Piracy]]

## Related

- [[Home|Home]]
- [[Upskill/Learning|Learning]]

## Recently Updated

```dataview
TABLE WITHOUT ID
  file.link AS Note,
  file.folder AS Area,
  dateformat(file.mtime, "MMM d") AS Updated
FROM "QoL"
WHERE file.path != this.file.path
SORT file.mtime DESC
LIMIT 12
```
