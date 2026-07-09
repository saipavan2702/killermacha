# Macha

## Start Here

- [[Macha/personal|Personal]]
- [[Macha/aesthetic|Aesthetic]]
- [[Macha/watches|Watches]]
- [[Macha/cc|CC]]

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
WHERE file.name != "Index"
SORT file.mtime DESC
LIMIT 12
```
