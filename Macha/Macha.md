> [!summary]
> Personal notes, media tracking, aesthetics, and everyday reference material.

## Start Here

- [[Macha/Media Links|Media Links]]
- [[Macha/Aesthetic|Aesthetic]]
- [[Macha/Watches|Watches]]
- [[Macha/Credit Cards|Credit Cards]]

## Motion Arts

- [[Macha/motionArts/Templates/Media Item|Media Item Template]]
- [[Macha/motionArts/Celluloid.base|Celluloid Base]]
- `Macha/motionArts/Tools/sync_tmdb_posters.py`

## Recently Updated

```dataview
TABLE WITHOUT ID
  file.link AS Note,
  file.folder AS Area,
  media_type AS Type,
  status AS Status
FROM "Macha"
WHERE file.path != this.file.path
SORT file.mtime DESC
LIMIT 12
```
