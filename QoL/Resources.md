# Resources

> [!summary]
> Tools, configurations, ideas, and broad reference collections that support the rest of the vault.

## Start Here

- [[QoL/Ideas|Ideas]]
- [[QoL/Configs|Configs]]
- [[QoL/Workspace Setup|Workspace Setup]]
- [[QoL/Note System|Note System]]

## Tech References

- [[QoL/Refs/Obsidian|Obsidian]]
- [[QoL/Refs/Dev|Dev]]
- [[QoL/Refs/SysDes|SysDes]]
- [[QoL/Refs/DSA|DSA]]

## System References

- [[QoL/Refs/MacOS|MacOS]]
- [[QoL/Refs/Windows|Windows]]
- [[QoL/Refs/RSS Feeds|RSS Feeds]]

## Personal References

- [[QoL/Refs/Typing|Typing]]
- [[QoL/Refs/Wallpapers|Wallpapers]]
- [[Upskill/Gen Misc/Math/Math|Math]]
- [[QoL/Refs/General Resources|General Resources]]
- [[QoL/Refs/Piracy|Piracy]]

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
