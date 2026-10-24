# Media library

![[Macha/motionArts/Celluloid.base]]

## Add media

Click **New** in the standalone Celluloid Base, use the **Add media to library** ribbon icon, or run **Motion Arts: Add media to library** from the command palette. Choose the type, enter a title, choose online search or manual entry, and click **Continue**. Review the selected result, then click **Add to library**. Cancelling creates no note.

New entries go into `Macha/motionArts/Library`; existing entries in `Items` appear in the same Base. Matching entries open the existing note. The **Media Item** Templater template supports all six types for manual creation.

| Media | Online source | Progress |
| --- | --- | --- |
| Movies / anime movies | TMDB, using your existing token | Status and watched date |
| TV shows | TMDB, using your existing token | Seasons and overall episodes |
| Anime | AniList; Jikan fallback | Episodes |
| Manga | AniList; Jikan fallback | Chapters |
| Games | Steam | Hours played |

Anime, manga and game searches need no new key. Use manual entry for games outside Steam or when providers are unavailable. TV episode totals cover the entire show.

## Track and edit

Run **Motion Arts: Edit library progress and rating** from a media note. Statuses are planned, active, completed, paused, and dropped. Active appears as Watching, Reading, or Playing. Rating is 0–5, with 0 meaning unrated. Progress totals of 0 mean unknown. The editor also supports favorites and related `[[note links]]`.

Starting sets a missing start date; completion sets a missing completion date. Existing dates are retained. For tracked screen media, status controls the legacy watched checkbox: use status once tracking is enabled. Cards display only covers and titles; use the **Manage** table for details.

Covers are remote image URLs. For an offline cover, save an attachment and put its `[[local image link]]` in `poster`. **My notes** is a freely editable heading; metadata refresh never changes the note body.

## Existing notes and refresh

Use **Link current media to a provider** to select and confirm a match. **Refresh media** fills missing metadata and updates known totals without replacing personal progress, ratings, titles, covers, or notes. Unknown totals do not erase known ones, and new totals cannot fall below your progress. Explicitly linked entries use manual provider refresh; unlinked movies and shows keep the existing TMDB automation.

## Views and statistics

**Show library statistics** displays counts, active/completed totals, favorites and average ratings. Showcase entries are excluded. Examples appear in their normal media categories and are marked `showcase: true`; remove that property to include an example in your statistics.

## Scope and reference

Inspired by [Lorebase](https://github.com/Murchi1k/obsidian-lorebase-plugin) (MIT, copyright 2026 Murch1k), with independently written integration code using native Bases. This includes core catalog and tracking features, not Lorebase's animated cards, charts, detailed season/part records, bulk import mapper, or every provider. Native Bases supply filtering, sorting and saved views.

The standalone Base New-button integration is scoped to Celluloid and Obsidian's current English toolbar. The command and ribbon are the fallback for embedded Bases, other languages, or toolbar changes.

The view menu contains six media categories, **Watchlist**, **Watched**, **Active**, **Favorites**, and **Manage**. Manage combines metadata and progress editing in one table. Empty progress columns are normal for media types that do not use those fields.

## Compact properties

New entries save only core catalog fields and relevant progress counters. Movies follow the existing 8 Mile schema, with up to three cast members and a blank `watched_date` until watched. Other screen media also include `watched` and `watched_date`. Non-movie provider IDs remain for accurate refresh. Default ratings and empty related links, synopsis, runtime, and other descriptive payloads are omitted; the search preview still shows the synopsis. Non-default personal tracking values and note bodies are retained. Existing Items and Library notes use the same compact core, with a visible favorite checkbox. Custom fields and note bodies are retained.

### Manga chapters

`chapter_current` is the last chapter you read. `chapter_total` is the final total for a finished manga (0 means ongoing or unknown). `chapter_released` is the latest known published chapter, so you can compare your progress even before the manga finishes. Volume counters are no longer used. A released count can become stale and does not prevent you from recording newer progress.

Provider refresh retrieves final totals where available. AniList/Jikan do not reliably return published-to-date counts for ongoing manga. Ongoing manga now checks the official VIZ listing once per day while Obsidian is open. The hourly scheduler also picks up newly added manga. Title-derived VIZ matches are supported; an explicit VIZ `/shonenjump/chapters/...` URL in `chapter_source` can resolve a differently named title. Unsupported titles or failed requests keep their last verified count. `chapter_checked` records a successful verification. Naruto's completed total is API-backed. Missing counts remain unknown rather than guessed.

Open an entry and run **Motion Arts: Refresh media** from Cmd+P to refresh its catalog details and, for ongoing manga, its released chapter count in one action. Finished manga with a known final total are skipped by the released-chapter checker. No background checks run after Obsidian closes.

### Broader manga coverage and simpler creation

Creation asks for a title and a search-result confirmation. Manual entry is optional. Cover changes, status, ratings and reading progress are edited after saving. Change the `poster` property in the note to replace its cover. New ongoing manga attempts a MangaUpdates chapter lookup immediately. Daily checks use VIZ where available and fall back to MangaUpdates, matching exact title and year before saving a source ID. MangaUpdates is a community-maintained count, not a guarantee of the latest official release. Unsupported or ambiguous matches remain unknown; saved progress is never replaced.
