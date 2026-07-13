const { Notice, Plugin, PluginSettingTab, Setting, TFile, requestUrl } = require("obsidian");

const MEDIA_FOLDER = "Macha/motionArts/Items/";
const WATCHED_FIELD = "watched";
const WATCHED_DATE_FIELD = "watched_date";
const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const VALID_MEDIA_TYPES = new Set(["movie", "series", "anime", "anime-movie"]);

const DEFAULT_SETTINGS = {
  tmdbBearerToken: "",
  autoSyncTmdb: true,
};

const LANGUAGE_INDUSTRY = {
  en: "Hollywood",
  hi: "Bollywood",
  te: "Tollywood",
  ta: "Kollywood",
  ml: "Mollywood",
  kn: "Sandalwood",
  mr: "Marathi cinema",
  ja: "Japanese cinema",
  ko: "Korean cinema",
  fr: "French cinema",
  de: "German cinema",
  it: "Italian cinema",
  es: "Spanish-language cinema",
  no: "Norwegian cinema",
  ru: "Russian cinema",
};

const QUERY_OVERRIDES = {
  "8\u00bd": "8\u00bd",
  "21 Jump Street": "21 Jump Street",
  Birdman: "Birdman or (The Unexpected Virtue of Ignorance)",
  "Birdman or (The Unexpected Virtue of Ignorance)": "Birdman or (The Unexpected Virtue of Ignorance)",
  Dark: "Dark",
  "Dark Knight": "The Dark Knight",
  Harakiri: "Harakiri",
  House: "House",
  "Inglourious Basterds": "Inglourious Basterds",
  K: "K",
  "King Arthur": "King Arthur: Legend of the Sword",
  "King Arthur: Legend of the Sword": "King Arthur: Legend of the Sword",
  "Lord of the rings": "The Lord of the Rings: The Fellowship of the Ring",
  LOTR: "The Lord of the Rings: The Return of the King",
  "The Lord of the Rings: The Fellowship of the Ring": "The Lord of the Rings: The Fellowship of the Ring",
  "The Lord of the Rings: The Two Towers": "The Lord of the Rings: The Two Towers",
  "The Lord of the Rings: The Return of the King": "The Lord of the Rings: The Return of the King",
  "The Hobbit: An Unexpected Journey": "The Hobbit: An Unexpected Journey",
  "The Hobbit: The Desolation of Smaug": "The Hobbit: The Desolation of Smaug",
  "The Hobbit: The Battle of the Five Armies": "The Hobbit: The Battle of the Five Armies",
  "The Lord of the Rings: The War of the Rohirrim": "The Lord of the Rings: The War of the Rohirrim",
  Transformers: "Transformers",
  "Transformers: Revenge of the Fallen": "Transformers: Revenge of the Fallen",
  "Transformers: Dark of the Moon": "Transformers: Dark of the Moon",
  "Transformers: Age of Extinction": "Transformers: Age of Extinction",
  "Transformers: The Last Knight": "Transformers: The Last Knight",
  "The Magnificent Seven": "The Magnificent Seven",
  "Pride and Prejudice": "Pride & Prejudice",
  Shiva: "Shiva",
  "The Accountant": "The Accountant",
  "The Boys": "The Boys",
  "The Human Condition": "The Human Condition I: No Greater Love",
  "The Dark Knight": "The Dark Knight",
  "The Return": "The Return 2003",
  Warrior: "Warrior",
  "Steins Gate": "Steins;Gate",
  "Deca-dance": "Deca-Dence",
  "Osamu: Ranking of kings": "Ranking of Kings",
  "Boogie Pop and Others": "Boogiepop and Others",
  "Summer time rendering": "Summer Time Rendering",
  "Megalo box": "MEGALOBOX",
  "K project": "K",
  Orb: "Orb: On the Movements of the Earth",
  "ACCA-13": "ACCA: 13-Territory Inspection Dept.",
  "Nura: rise of yokai clan": "Nura: Rise of the Yokai Clan",
  "Atlantis the Lost empire": "Atlantis: The Lost Empire",
  "Boogiepop and Others": "Boogiepop and Others",
  Brooklyn: "Brooklyn",
  "The Princess and Frog": "The Princess and the Frog",
  "My neighbour Totoro": "My Neighbor Totoro",
  Moana: "Moana",
  Up: "Up",
  "Wild Robot": "The Wild Robot",
  "Monster inc.": "Monsters, Inc.",
  "The World's End": "The World's End",
  "Tim Burton's  The nightmare before christmas": "The Nightmare Before Christmas",
  "ghost in the shell": "Ghost in the Shell",
  "Boy and the Heron": "The Boy and the Heron",
};

const YEAR_OVERRIDES = {
  "8\u00bd": "1963",
  "21 Jump Street": "2012",
  Birdman: "2014",
  "Birdman or (The Unexpected Virtue of Ignorance)": "2014",
  "Dark Knight": "2008",
  "The Dark Knight": "2008",
  "The Lord of the Rings: The Fellowship of the Ring": "2001",
  "The Lord of the Rings: The Two Towers": "2002",
  "The Lord of the Rings: The Return of the King": "2003",
  "The Hobbit: An Unexpected Journey": "2012",
  "The Hobbit: The Desolation of Smaug": "2013",
  "The Hobbit: The Battle of the Five Armies": "2014",
  "The Lord of the Rings: The War of the Rohirrim": "2024",
  Transformers: "2007",
  "Transformers: Revenge of the Fallen": "2009",
  "Transformers: Dark of the Moon": "2011",
  "Transformers: Age of Extinction": "2014",
  "Transformers: The Last Knight": "2017",
  Moana: "2016",
  Up: "2009",
  "The World's End": "2013",
  "Boogiepop and Others": "2019",
  Brooklyn: "2015",
  Harakiri: "1962",
  K: "2012",
  "King Arthur": "2017",
  "King Arthur: Legend of the Sword": "2017",
  "Pride and Prejudice": "2005",
  Shiva: "1989",
  "The Accountant": "2016",
  "The Magnificent Seven": "1960",
  Warrior: "2011",
};

const IMDB_OVERRIDES = {
  "8\u00bd": "tt0056801",
  "The Lord of the Rings: The Fellowship of the Ring": "tt0120737",
  "The Lord of the Rings: The Two Towers": "tt0167261",
  "The Lord of the Rings: The Return of the King": "tt0167260",
  "The Hobbit: An Unexpected Journey": "tt0903624",
  "The Hobbit: The Desolation of Smaug": "tt1170358",
  "The Hobbit: The Battle of the Five Armies": "tt2310332",
  Transformers: "tt0418279",
  "Transformers: Revenge of the Fallen": "tt1055369",
  "Transformers: Dark of the Moon": "tt1399103",
  "Transformers: Age of Extinction": "tt2109248",
  "Transformers: The Last Knight": "tt3371366",
  Birdman: "tt2562232",
  "Birdman or (The Unexpected Virtue of Ignorance)": "tt2562232",
  "King Arthur": "tt1972591",
  "King Arthur: Legend of the Sword": "tt1972591",
  "Dark Knight": "tt0468569",
  "The Dark Knight": "tt0468569",
  Moana: "tt3521164",
  Up: "tt1049413",
  "The World's End": "tt1213663",
};

module.exports = class MovieWatchDatePlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.pending = new Map();
    this.syncing = new Set();
    this.completedSync = new Set();
    this.genreCache = new Map();
    this.missingTokenNoticeShown = false;

    this.addSettingTab(new MovieWatchDateSettingTab(this.app, this));

    this.addCommand({
      id: "sync-current-media-from-tmdb",
      name: "Sync current media from TMDB",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!this.isMediaNote(file)) {
          return false;
        }
        if (!checking) {
          this.syncCurrentMedia(file);
        }
        return true;
      },
    });

    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (this.isMediaNote(file)) {
          this.scheduleCheck(file, 0);
        }
      })
    );

    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (this.isMediaNote(file)) {
          this.scheduleCheck(file, 0);
        }
      })
    );
  }

  onunload() {
    for (const timer of this.pending.values()) {
      window.clearTimeout(timer);
    }
    this.pending.clear();
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  isMediaNote(file) {
    return file instanceof TFile && file.extension === "md" && file.path.startsWith(MEDIA_FOLDER);
  }

  scheduleCheck(file, attempt) {
    const existing = this.pending.get(file.path);
    if (existing) {
      window.clearTimeout(existing);
    }

    const timer = window.setTimeout(() => {
      this.pending.delete(file.path);
      this.runAutomation(file, attempt);
    }, 500);
    this.pending.set(file.path, timer);
  }

  async runAutomation(file, attempt) {
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (!frontmatter && attempt < 5) {
      this.scheduleCheck(file, attempt + 1);
      return;
    }
    if (!frontmatter) {
      return;
    }

    await this.setWatchedDateIfNeeded(file, frontmatter);
    await this.syncTmdbIfNeeded(file, frontmatter, false);
  }

  async setWatchedDateIfNeeded(file, cachedFrontmatter) {
    if (!this.isWatched(cachedFrontmatter[WATCHED_FIELD]) || this.hasValue(cachedFrontmatter[WATCHED_DATE_FIELD])) {
      return;
    }

    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      if (!this.isWatched(frontmatter[WATCHED_FIELD])) {
        return;
      }
      if (this.hasValue(frontmatter[WATCHED_DATE_FIELD])) {
        return;
      }
      frontmatter[WATCHED_DATE_FIELD] = this.today();
    });
  }

  async syncCurrentMedia(file) {
    const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (!frontmatter) {
      new Notice("mmacha-auto: note metadata is not ready yet.");
      return;
    }

    try {
      const updated = await this.syncTmdbIfNeeded(file, frontmatter, true);
      new Notice(updated ? "mmacha-auto: TMDB sync complete." : "mmacha-auto: nothing to sync.");
    } catch (error) {
      console.error(error);
      new Notice(`mmacha-auto: TMDB sync failed. ${error.message || error}`);
    }
  }

  async syncTmdbIfNeeded(file, frontmatter, force) {
    if (!force && !this.settings.autoSyncTmdb) {
      return false;
    }
    if (!this.settings.tmdbBearerToken) {
      this.noticeMissingTokenOnce();
      return false;
    }
    if (this.syncing.has(file.path)) {
      return false;
    }

    const title = this.scalar(frontmatter.title || file.basename);
    const mediaType = this.scalar(frontmatter.media_type || "movie");
    if (!title || /^Untitled/i.test(title) || !VALID_MEDIA_TYPES.has(mediaType)) {
      return false;
    }
    if (!force && !this.needsTmdbSync(file, frontmatter, mediaType)) {
      return false;
    }

    this.syncing.add(file.path);
    try {
      const result = await this.searchTitle(title, mediaType);
      if (!result) {
        return false;
      }

      const genreMap = await this.loadGenres(mediaType);
      const metadata = await this.metadataFrom(result, mediaType, genreMap);
      await this.applyTmdbMetadata(file, metadata, mediaType, force);
      this.completedSync.add(file.path);
      return true;
    } finally {
      this.syncing.delete(file.path);
    }
  }

  needsTmdbSync(file, frontmatter, mediaType) {
    const missingPoster = !this.hasValue(frontmatter.poster);
    const missingGenres = !this.hasListValue(frontmatter.genres);
    const missingDirectors = this.needsDirectors(mediaType) && !this.hasListValue(frontmatter.directors);

    if (this.completedSync.has(file.path) && !missingPoster && !missingGenres) {
      return false;
    }
    return missingPoster || missingGenres || missingDirectors;
  }

  async applyTmdbMetadata(file, metadata, mediaType, force) {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      if (metadata.poster && (force || !this.hasValue(frontmatter.poster))) {
        frontmatter.poster = metadata.poster;
      }
      if (metadata.industry && (force || !this.hasValue(frontmatter.industry))) {
        frontmatter.industry = metadata.industry;
      }
      if (metadata.genres.length > 0 && (force || !this.hasListValue(frontmatter.genres))) {
        frontmatter.genres = metadata.genres;
      }
      if (this.needsDirectors(mediaType) && metadata.directors.length > 0 && (force || !this.hasListValue(frontmatter.directors))) {
        frontmatter.directors = metadata.directors;
      }
    });
  }

  async metadataFrom(result, mediaType, genreMap) {
    const posterPath = result.poster_path;
    const genres = (result.genre_ids || []).map((id) => genreMap.get(id)).filter(Boolean);
    return {
      poster: posterPath ? `${IMAGE_BASE}${posterPath}` : "",
      industry: this.industryFrom(result, mediaType),
      genres,
      directors: await this.loadDirectors(result, mediaType),
    };
  }

  async searchTitle(title, mediaType) {
    const imdbResult = await this.findByImdbId(title, mediaType);
    if (imdbResult) {
      return imdbResult;
    }

    const path = this.isTvType(mediaType) ? "/search/tv" : "/search/movie";
    const queries = [QUERY_OVERRIDES[title] || title, title];
    if (title === "K") {
      queries.push("K Project", "K");
    }

    const seen = new Set();
    const results = [];
    for (const query of queries) {
      if (seen.has(query)) {
        continue;
      }
      seen.add(query);
      const params = {
        query,
        include_adult: "false",
        language: "en-US",
        page: "1",
      };
      const year = YEAR_OVERRIDES[title];
      if (year && this.isTvType(mediaType)) {
        params.first_air_date_year = year;
      } else if (year) {
        params.year = year;
        params.primary_release_year = year;
      }
      const payload = await this.apiGet(path, params);
      results.push(...(payload.results || []));
    }
    return this.chooseBestResult(title, mediaType, results);
  }

  async findByImdbId(title, mediaType) {
    const imdbId = IMDB_OVERRIDES[title] || IMDB_OVERRIDES[QUERY_OVERRIDES[title]];
    if (!imdbId) {
      return null;
    }

    const payload = await this.apiGet(`/find/${imdbId}`, { external_source: "imdb_id" });
    const key = this.isTvType(mediaType) ? "tv_results" : "movie_results";
    const results = payload[key] || [];
    return results[0] || null;
  }

  chooseBestResult(title, mediaType, results) {
    if (results.length === 0) {
      return null;
    }

    const wantedTitle = this.normalizedTitle(QUERY_OVERRIDES[title] || title);
    const wantedYear = YEAR_OVERRIDES[title];
    const scored = results.map((result) => {
      const candidate = this.normalizedTitle(this.resultTitle(result, mediaType));
      const candidateYear = this.resultYear(result, mediaType);
      let points = 0;

      if (candidate === wantedTitle) {
        points += 80;
      } else if (wantedTitle && (candidate.startsWith(wantedTitle) || candidate.split(" ").includes(wantedTitle))) {
        points += 25;
      }
      if (wantedYear && candidateYear === wantedYear) {
        points += 50;
      } else if (wantedYear) {
        points -= 20;
      }
      if (result.poster_path) {
        points += 5;
      }
      if (Number(result.vote_count || 0) > 50) {
        points += 5;
      }

      return { result, points, popularity: Number(result.popularity || 0) };
    });

    scored.sort((a, b) => b.points - a.points || b.popularity - a.popularity);
    return scored[0].points > 0 ? scored[0].result : null;
  }

  async loadGenres(mediaType) {
    if (this.genreCache.has(mediaType)) {
      return this.genreCache.get(mediaType);
    }

    const path = this.isTvType(mediaType) ? "/genre/tv/list" : "/genre/movie/list";
    const payload = await this.apiGet(path, { language: "en" });
    const genres = new Map((payload.genres || []).map((genre) => [genre.id, genre.name]));
    this.genreCache.set(mediaType, genres);
    return genres;
  }

  async loadDirectors(result, mediaType) {
    if (!this.needsDirectors(mediaType) || !result.id) {
      return [];
    }

    const payload = await this.apiGet(`/movie/${result.id}/credits`, { language: "en-US" });
    const seen = new Set();
    const directors = [];
    for (const person of payload.crew || []) {
      if (person.job !== "Director" || !person.name || seen.has(person.name)) {
        continue;
      }
      directors.push(person.name);
      seen.add(person.name);
    }
    return directors;
  }

  async apiGet(path, params) {
    const query = new URLSearchParams(params || {}).toString();
    const url = `${API_BASE}${path}${query ? `?${query}` : ""}`;
    const response = await requestUrl({
      url,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.settings.tmdbBearerToken}`,
      },
    });
    return response.json || JSON.parse(response.text);
  }

  industryFrom(result, mediaType) {
    if (mediaType === "anime" || mediaType === "anime-movie") {
      return "Anime";
    }
    const language = result.original_language;
    if (LANGUAGE_INDUSTRY[language]) {
      return LANGUAGE_INDUSTRY[language];
    }
    const countries = result.origin_country || [];
    if (countries[0] === "IN") {
      return "Indian cinema";
    }
    return "";
  }

  normalizedTitle(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  resultTitle(result, mediaType) {
    return this.isTvType(mediaType) ? result.name || result.original_name || "" : result.title || result.original_title || "";
  }

  resultYear(result, mediaType) {
    const value = this.isTvType(mediaType) ? result.first_air_date || "" : result.release_date || "";
    return /^\d{4}/.test(value) ? value.slice(0, 4) : "";
  }

  isTvType(mediaType) {
    return mediaType === "series" || mediaType === "anime";
  }

  needsDirectors(mediaType) {
    return mediaType === "movie" || mediaType === "anime-movie";
  }

  isWatched(value) {
    return value === true || value === "true";
  }

  hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  hasListValue(value) {
    return Array.isArray(value) && value.length > 0;
  }

  scalar(value) {
    return String(value || "").trim();
  }

  today() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  noticeMissingTokenOnce() {
    if (this.missingTokenNoticeShown) {
      return;
    }
    this.missingTokenNoticeShown = true;
    new Notice("mmacha-auto: add your TMDB bearer token in plugin settings.");
  }
};

class MovieWatchDateSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Auto-sync TMDB")
      .setDesc("Automatically fills poster, genres, industry, and directors for incomplete motionArts notes.")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.autoSyncTmdb).onChange(async (value) => {
          this.plugin.settings.autoSyncTmdb = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName("TMDB API Read Access Token")
      .setDesc("Used only for notes inside Macha/motionArts/Items.")
      .addText((text) => {
        text.inputEl.type = "password";
        text
          .setPlaceholder("eyJ...")
          .setValue(this.plugin.settings.tmdbBearerToken)
          .onChange(async (value) => {
            this.plugin.settings.tmdbBearerToken = value.trim();
            await this.plugin.saveSettings();
          });
      });
  }
}
