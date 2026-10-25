<%*
const mediaTypes = ["movie", "series", "anime", "anime-movie", "game"];
const labels = ["Movie", "Series", "Anime", "Anime Movie", "Game"];
const pickedType = await tp.system.suggester(labels, mediaTypes, true, "Media type");
const mediaType = pickedType || "movie";
const suffixes = {
  movie: "",
  series: " - Series",
  anime: " - Anime",
  "anime-movie": " - Anime Movie",
  game: " - Game",
};
const prompts = {
  movie: "Movie title",
  series: "Series title",
  anime: "Anime title",
  "anime-movie": "Anime movie title",
  game: "Game title",
};
const currentTitle = tp.file.title && !/^Untitled/i.test(tp.file.title)
  ? tp.file.title.replace(/ - (Series|Anime Movie|Anime|Game)$/i, "")
  : "";
const titleInput = await tp.system.prompt(prompts[mediaType], currentTitle, true);
const enteredTitle = (titleInput || currentTitle).trim();
if (!enteredTitle) {
  throw new Error("Title is required");
}
const titleYearMatch = enteredTitle.match(/^(.*?)\s*\(((?:18|19|20)\d{2})\)\s*$/);
const title = (titleYearMatch ? titleYearMatch[1] : enteredTitle).trim();
const requestedYear = titleYearMatch ? titleYearMatch[2] : "";
const cleanTitle = title
  .replace(/[\\/:]/g, " - ")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/\.+$/, "");
const fileBase = requestedYear ? `${cleanTitle} (${requestedYear})` : cleanTitle;
const suffix = suffixes[mediaType];
let fileName = `${fileBase}${suffix}`;
const folder = "Macha/motionArts/Items";
const currentPath = tp.file.path(true);
let targetPath = `${folder}/${fileName}.md`;
let counter = 2;
while (currentPath !== targetPath && await tp.file.exists(targetPath)) {
  fileName = `${fileBase}${suffix} ${counter}`;
  targetPath = `${folder}/${fileName}.md`;
  counter += 1;
}
if (currentPath !== targetPath) {
  await tp.file.move(`${folder}/${fileName}`);
}
const industry = mediaType === "anime" || mediaType === "anime-movie" ? "Anime" : "";
const tagsByType = {
  movie: ["motion-art", "movie"],
  series: ["motion-art", "series"],
  anime: ["motion-art", "anime", "series"],
  "anime-movie": ["motion-art", "anime", "movie"],
  game: ["media-library", "game"],
};
const tags = tagsByType[mediaType] || ["motion-art"];
const tagLines = tags.map((tag) => `  - ${tag}`).join("\n");
const liveActionFields = mediaType === "movie" || mediaType === "series"
  ? `year:${requestedYear ? ` ${JSON.stringify(requestedYear)}` : ""}
directors: []
cast: []
`
  : mediaType === "anime" || mediaType === "anime-movie" ? `directors: []
` : `year:
`;
const trackingFields = ["anime", "game"].includes(mediaType)
  ? `` + (mediaType === "anime" ? `episode_current: 0
episode_total: 0
`
    : `hours_played: 0
`)
  : "";
const watchedFields = ["game"].includes(mediaType) ? "" : "watched: false\nwatched_date:\n";
tR += `---
title: ${JSON.stringify(title)}
media_type: "${mediaType}"
favorite: false
industry: ${JSON.stringify(industry)}
${watchedFields}${trackingFields}genres: []
${liveActionFields}poster: ""
tags:
${tagLines}
---

`;
%>
