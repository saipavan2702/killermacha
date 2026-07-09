<%*
const mediaTypes = ["movie", "series", "anime", "anime-movie"];
const labels = ["Movie", "Series", "Anime", "Anime Movie"];
const pickedType = await tp.system.suggester(labels, mediaTypes, true, "Media type");
const mediaType = pickedType || "movie";
const suffixes = {
  movie: "",
  series: " - Series",
  anime: " - Anime",
  "anime-movie": " - Anime Movie",
};
const prompts = {
  movie: "Movie title",
  series: "Series title",
  anime: "Anime title",
  "anime-movie": "Anime movie title",
};
const currentTitle = tp.file.title && !/^Untitled/i.test(tp.file.title)
  ? tp.file.title.replace(/ - (Series|Anime Movie|Anime)$/i, "")
  : "";
const titleInput = await tp.system.prompt(prompts[mediaType], currentTitle, true);
const title = (titleInput || currentTitle).trim();
if (!title) {
  throw new Error("Title is required");
}
const fileBase = title
  .replace(/[\\/:]/g, " - ")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/\.+$/, "");
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
};
const tags = tagsByType[mediaType] || ["motion-art"];
const tagLines = tags.map((tag) => `  - ${tag}`).join("\n");
tR += `---
title: ${JSON.stringify(title)}
media_type: "${mediaType}"
industry: ${JSON.stringify(industry)}
watched: false
watched_date:
genres: []
directors: []
poster: ""
tags:
${tagLines}
---

# ${title}
`;
%>
