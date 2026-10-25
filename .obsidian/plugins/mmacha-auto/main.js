const { Notice, Plugin, PluginSettingTab, Setting, TFile, Modal, SuggestModal, stringifyYaml, requestUrl } = require("obsidian");

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
  da: "Danish cinema",
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
  Shiva: "Siva",
  "The Accountant": "The Accountant",
  "The Boys": "The Boys",
  Shogun: "Shōgun",
  "The Human Condition": "The Human Condition I: No Greater Love",
  Godavari: "Godavari",
  "Rakta Charitra": "Rakht Charitra",
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
  Odyssey: "The Odyssey",
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
  "Scary Movie": "2000",
  "The Hunt": "2012",
  Moana: "2016",
  Up: "2009",
  "The World's End": "2013",
  "Boogiepop and Others": "2019",
  Brooklyn: "2015",
  Godavari: "2006",
  Harakiri: "1962",
  K: "2012",
  "King Arthur": "2017",
  "King Arthur: Legend of the Sword": "2017",
  "Pride and Prejudice": "2005",
  Shiva: "1989",
  "The Accountant": "2016",
  "The Magnificent Seven": "1960",
  "Rakta Charitra": "2010",
  "The Housemaid": "2025",
  "The Internship": "2026",
  Obsession: "2026",
  Odyssey: "2026",
  "The Odyssey": "2026",
  Shogun: "2024",
  Warrior: "2011",
};

const DIRECTOR_OVERRIDES = {
  "Finding Her Edge": ["Shamim Sarif", "Jacqueline Pepall"],
};

const CAST_OVERRIDES = {
  "The Hunt": ["Mads Mikkelsen", "Thomas Bo Larsen", "Annika Wedderkopp"],
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
  "Great Expectations": "tt0119223",
  Shiva: "tt0248428",
  Obsession: "tt37287335",
  Odyssey: "tt33764258",
  "The Odyssey": "tt33764258",
};


// Search providers and the search → review → Markdown flow are inspired by Lorebase:
// https://github.com/Murchi1k/obsidian-lorebase-plugin (MIT). No dependency on Lorebase.
const LIBRARY_FOLDER = "Macha/motionArts/Library";
const LIBRARY_LABELS = { movie: "Movie", series: "TV show", "anime-movie": "Anime Movie", anime: "Anime", game: "Game" };
const LIBRARY_TYPES = new Set(Object.keys(LIBRARY_LABELS));
const LIBRARY_PROGRESS = {
  anime: ["episode_current", "episode_total"],
  series: ["season_current", "season_total", "episode_current", "episode_total"],
  game: ["hours_played"],
};
const LIBRARY_NUMBERS = [...new Set(Object.values(LIBRARY_PROGRESS).flat()), "rating"];

function validLibraryCover(value) {
  if (!value) return true;
  if (/^\[\[[^\[\]\r\n]+\]\]$/.test(value)) return true;
  try { const url = new URL(value); return ["http:", "https:"].includes(url.protocol) && Boolean(url.hostname); }
  catch (_) { return false; }
}
const LIBRARY_STATUSES = new Set(["planned", "active", "completed", "paused", "dropped"]);

function plainLibraryText(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}

function chooseLibrary(app, placeholder, choices) {
  return new Promise((resolve) => {
    class LibraryChoice extends SuggestModal {
      constructor() { super(app); this.setPlaceholder(placeholder); }
      getSuggestions(query) { return choices.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())); }
      renderSuggestion(item, el) { el.setText(item.title); }
      onChooseSuggestion(item) { resolve(item.value); }
      onClose() { queueMicrotask(() => resolve(null)); }
    }
    new LibraryChoice().open();
  });
}

function libraryForm(app, title, fields, validate = () => {}, preview = {}, options = {}) {
  return new Promise((resolve) => {
    class LibraryForm extends Modal {
      onOpen() {
        this.modalEl.addClass("motion-arts-form");
        this.contentEl.createEl("h2", { text: title });
        if (options.description) this.contentEl.createEl("p", { text: options.description, cls: "motion-arts-hint" });
        const previewEl = this.contentEl.createDiv({ cls: "motion-arts-preview" });
        if (/^https?:\/\//i.test(preview.poster || "")) {
          const image = previewEl.createEl("img", { attr: { src: preview.poster, alt: preview.title || "Cover" } });
          image.style.maxHeight = "150px";
          image.style.maxWidth = "100%";
        }
        if (preview.description) previewEl.createEl("p", { text: plainLibraryText(preview.description).slice(0, 400) });

        const values = Object.fromEntries(fields.map((field) => [field.key, field.value]));
        let optionalEl;
        const errorEl = this.contentEl.createEl("p", { cls: "motion-arts-error", attr: { role: "alert" } });
        for (const field of fields) {
          let parent = this.contentEl;
          if (options.compact && !["title", "status"].includes(field.key)) {
            if (!optionalEl) {
              optionalEl = this.contentEl.createEl("details");
              optionalEl.createEl("summary", { text: fields.some(field => field.key === "mode") ? "Add manually instead" : fields.some(field => field.key === "status") ? "Progress, rating & other details (optional)" : "Change cover (optional)" });
              if (fields.some(field => field.number)) optionalEl.createEl("p", { text: "You can edit these later. A total of 0 means unknown.", cls: "motion-arts-hint" });
            }
            parent = optionalEl;
          }
          const setting = new Setting(parent).setName(field.label);
          if (field.description) setting.setDesc(field.description);
          if (field.choices) setting.addDropdown((select) => select.addOptions(field.choices).setValue(String(field.value)).onChange((value) => { values[field.key] = value; }));
          else if (field.toggle) setting.addToggle((toggle) => toggle.setValue(Boolean(field.value)).onChange((value) => { values[field.key] = value; }));
          else setting.addText((text) => {
            text.setPlaceholder(field.placeholder || "").setValue(String(field.value)).onChange((value) => { values[field.key] = field.number ? Number(value) : value; });
            if (field.number) { text.inputEl.type = "number"; text.inputEl.min = "0"; text.inputEl.step = "any"; }
          });
        }
        if (optionalEl) this.contentEl.appendChild(optionalEl);
        const submit = (mode) => {
          try { validate(values); resolve(mode ? { ...values, mode } : values); this.close(); }
          catch (error) { errorEl.setText(error.message || String(error)); }
        };
        const actions = new Setting(this.contentEl);
        actions.addButton(button => button.setButtonText(options.searchActions ? "Search" : options.submitLabel || "Save changes").setCta().onClick(() => submit(options.searchActions ? "search" : null)));
        if (options.searchActions) actions.addButton(button => button.setButtonText("Add manually").onClick(() => submit("manual")));
        actions.addButton(button => button.setButtonText("Cancel").onClick(() => this.close()));
      }
      onClose() { this.contentEl.empty(); resolve(null); }
    }
    new LibraryForm(app).open();
  });
}

function splitTitleYear(value) {
  const title = String(value || "").trim();
  const match = title.match(/^(.*?)\s*\(((?:18|19|20)\d{2})\)\s*$/);
  return match ? { title: match[1].trim(), year: match[2] } : { title, year: "" };
}

module.exports = class MovieWatchDatePlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.pending = new Map();
    this.syncing = new Set();
    this.completedSync = new Set();
    this.genreCache = new Map();
    this.missingTokenNoticeShown = false;

    this.addSettingTab(new MovieWatchDateSettingTab(this.app, this));
    this.addRibbonIcon("library", "Add media to library", () => this.addLibraryItem());
    // Route only Celluloid's native New action through our reviewed creation flow.
    // The command and ribbon remain available if Obsidian changes its toolbar markup.
    this.registerDomEvent(document, "click", (event) => {
      const button = event.target instanceof Element ? event.target.closest(".bases-toolbar [role='button']") : null;
      if (!button || button.textContent.trim() !== "New") return;
      const leaf = this.app.workspace.getMostRecentLeaf();
      if (leaf?.view?.file?.path !== "Macha/motionArts/Celluloid.base" || !leaf.view.containerEl.contains(button)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      this.addLibraryItem();
    }, true);
    this.addCommand({ id: "library-statistics", name: "Show library statistics", callback: () => this.showLibraryStatistics() });
    this.addCommand({ id: "add-library-item", name: "Add media to library", callback: () => this.addLibraryItem() });
    this.addCommand({ id: "open-media-library", name: "Open media library", callback: async () => {
      const base = this.app.vault.getAbstractFileByPath("Macha/motionArts/Celluloid.base");
      if (base instanceof TFile) await this.app.workspace.getLeaf(false).openFile(base);
    } });
    this.addCommand({ id: "refresh-library-metadata", name: "Refresh media", callback: () => this.selectMediaToRefresh() });
    for (const [id, name, action] of [
      ["edit-library-progress", "Edit library progress and rating", (file) => this.editLibraryProgress(file)],
      ["link-library-metadata", "Link current media to a provider", (file) => this.linkLibraryMetadata(file)],
    ]) this.addCommand({ id, name, checkCallback: (checking) => {
      const file = this.app.workspace.getActiveFile();
      if (!this.isMediaNote(file) || !LIBRARY_TYPES.has(this.libraryType(file))) return false;
      if (!checking) action(file);
      return true;
    } });

    this.addCommand({
      id: "sync-current-media-from-tmdb",
      name: "Sync current media from TMDB",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!this.isMediaNote(file) || !VALID_MEDIA_TYPES.has(this.libraryType(file)) || this.app.metadataCache.getFileCache(file)?.frontmatter?.metadata_provider) {
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
    return file instanceof TFile && file.extension === "md" && (file.path.startsWith(MEDIA_FOLDER) || file.path.startsWith(`${LIBRARY_FOLDER}/`));
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

    try {
      if (LIBRARY_TYPES.has(frontmatter.media_type) && LIBRARY_STATUSES.has(frontmatter.status)) {
        const updated = { ...frontmatter };
        this.updateLibraryDates(updated);
        if (["started_date", "completed_date", "watched", "watched_date"].some((key) => updated[key] !== frontmatter[key])) {
          await this.app.fileManager.processFrontMatter(file, (fm) => this.updateLibraryDates(fm));
        }
      }
      await this.setWatchedDateIfNeeded(file, frontmatter);
      await this.syncTmdbIfNeeded(file, frontmatter, false);
    } catch (error) {
      console.error("Motion Arts automation:", error);
      new Notice(`Motion Arts: ${error.message || error}`);
    }
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
    if (!VALID_MEDIA_TYPES.has(frontmatter.media_type || "movie") || frontmatter.metadata_provider) return false;
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

    const enteredTitle = this.scalar(frontmatter.title || file.basename);
    const { title, year: titleYear } = splitTitleYear(enteredTitle);
    const mediaType = this.scalar(frontmatter.media_type || "movie");
    if (!title || /^Untitled/i.test(title) || !VALID_MEDIA_TYPES.has(mediaType)) {
      return false;
    }
    if (!force && !this.needsTmdbSync(file, frontmatter, mediaType)) {
      return false;
    }

    this.syncing.add(file.path);
    try {
      const preferredYear = this.scalar(frontmatter.year) || titleYear;
      const preferredPosterPath = this.posterPath(this.scalar(frontmatter.poster));
      const result = await this.searchTitle(title, mediaType, preferredYear, preferredPosterPath);
      if (!result) {
        return false;
      }

      const genreMap = await this.loadGenres(mediaType);
      const metadata = await this.metadataFrom(result, mediaType, genreMap);
      if (DIRECTOR_OVERRIDES[title]) {
        metadata.directors = DIRECTOR_OVERRIDES[title];
      }
      if (CAST_OVERRIDES[title]) {
        metadata.cast = CAST_OVERRIDES[title];
      }
      await this.applyTmdbMetadata(file, metadata, mediaType, force);
      this.completedSync.add(file.path);
      return true;
    } finally {
      this.syncing.delete(file.path);
    }
  }

  needsTmdbSync(file, frontmatter, mediaType) {
    if (this.completedSync.has(file.path)) {
      return false;
    }

    const missingPoster = !this.hasValue(frontmatter.poster);
    const missingGenres = !this.hasListValue(frontmatter.genres);
    const missingDirectors = this.needsDirectors(mediaType) && !this.hasListValue(frontmatter.directors);
    const missingYear = this.needsLiveActionMetadata(mediaType) && !this.hasValue(frontmatter.year);
    const missingCast = this.needsLiveActionMetadata(mediaType) && !this.hasListValue(frontmatter.cast);
    return missingPoster || missingGenres || missingDirectors || missingYear || missingCast;
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
      if (this.needsLiveActionMetadata(mediaType) && metadata.year && (force || !this.hasValue(frontmatter.year))) {
        frontmatter.year = metadata.year;
      }
      if (this.needsDirectors(mediaType) && metadata.directors.length > 0 && (force || !this.hasListValue(frontmatter.directors))) {
        frontmatter.directors = metadata.directors;
      }
      if (this.needsLiveActionMetadata(mediaType) && metadata.cast.length > 0 && (force || !this.hasListValue(frontmatter.cast))) {
        frontmatter.cast = metadata.cast;
      }
    });
  }

  async metadataFrom(result, mediaType, genreMap) {
    const posterPath = result.poster_path;
    const genres = (result.genre_ids || []).map((id) => genreMap.get(id)).filter(Boolean);
    const credits = await this.loadCredits(result, mediaType);
    return {
      poster: posterPath ? `${IMAGE_BASE}${posterPath}` : "",
      industry: this.industryFrom(result, mediaType),
      genres,
      year: this.needsLiveActionMetadata(mediaType) ? this.resultYear(result, mediaType) : "",
      directors: this.directorsFrom(credits, mediaType),
      cast: this.needsLiveActionMetadata(mediaType) ? this.castFrom(credits) : [],
    };
  }

  async searchTitle(title, mediaType, preferredYear = "", preferredPosterPath = "") {
    const imdbResult = await this.findByImdbId(title, mediaType, preferredYear, preferredPosterPath);
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
      const year = preferredPosterPath ? "" : preferredYear || YEAR_OVERRIDES[title];
      if (year && this.isTvType(mediaType)) {
        params.first_air_date_year = year;
      } else if (year) {
        params.year = year;
        params.primary_release_year = year;
      }
      const payload = await this.apiGet(path, params);
      results.push(...(payload.results || []));
    }
    if (preferredPosterPath && preferredYear && !results.some((result) => result.poster_path === preferredPosterPath)) {
      for (const query of seen) {
        const params = {
          query,
          include_adult: "false",
          language: "en-US",
          page: "1",
        };
        if (this.isTvType(mediaType)) {
          params.first_air_date_year = preferredYear;
        } else {
          params.year = preferredYear;
          params.primary_release_year = preferredYear;
        }
        const payload = await this.apiGet(path, params);
        results.push(...(payload.results || []));
      }
    }
    return this.chooseBestResult(title, mediaType, results, preferredYear, preferredPosterPath);
  }

  async findByImdbId(title, mediaType, preferredYear = "", preferredPosterPath = "") {
    const imdbId = IMDB_OVERRIDES[title] || IMDB_OVERRIDES[QUERY_OVERRIDES[title]];
    if (!imdbId) {
      return null;
    }

    const payload = await this.apiGet(`/find/${imdbId}`, { external_source: "imdb_id" });
    const key = this.isTvType(mediaType) ? "tv_results" : "movie_results";
    const results = payload[key] || [];
    const result = results[0] || null;
    if (result && preferredYear && this.resultYear(result, mediaType) !== preferredYear) {
      return null;
    }
    if (result && preferredPosterPath && !preferredYear && result.poster_path !== preferredPosterPath) {
      return null;
    }
    return result;
  }

  chooseBestResult(title, mediaType, results, preferredYear = "", preferredPosterPath = "") {
    if (results.length === 0) {
      return null;
    }

    const wantedTitle = this.normalizedTitle(QUERY_OVERRIDES[title] || title);
    const wantedYear = preferredYear || YEAR_OVERRIDES[title];
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
      if (preferredPosterPath && result.poster_path === preferredPosterPath) {
        points += 200;
      } else if (preferredPosterPath) {
        points -= 40;
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

  async loadCredits(result, mediaType) {
    if (!this.needsDirectors(mediaType) || !result.id) {
      return { cast: [], crew: [] };
    }

    const path = mediaType === "series"
      ? `/tv/${result.id}/aggregate_credits`
      : `/movie/${result.id}/credits`;
    return this.apiGet(path, { language: "en-US" });
  }

  directorsFrom(credits, mediaType) {
    const seen = new Set();
    const directors = [];
    for (const person of credits.crew || []) {
      const directingJobs = mediaType === "series"
        ? (person.jobs || []).filter((job) => job.job === "Director")
        : person.job === "Director"
          ? [{ episode_count: 1 }]
          : [];
      if (directingJobs.length === 0 || !person.name || seen.has(person.name)) {
        continue;
      }
      const episodeCount = directingJobs.reduce((total, job) => total + Number(job.episode_count || 0), 0);
      directors.push({ name: person.name, episodeCount });
      seen.add(person.name);
    }
    directors.sort((a, b) => b.episodeCount - a.episodeCount);
    return directors.slice(0, 3).map((director) => director.name);
  }

  castFrom(credits) {
    const seen = new Set();
    return [...(credits.cast || [])]
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
      .filter((person) => {
        if (!person.name || seen.has(person.name)) {
          return false;
        }
        seen.add(person.name);
        return true;
      })
      .slice(0, 3)
      .map((person) => person.name);
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

  posterPath(value) {
    const match = String(value || "").match(/\/(?:w\d+|original)(\/[^?#]+)/);
    return match ? match[1] : "";
  }

  isTvType(mediaType) {
    return mediaType === "series" || mediaType === "anime";
  }

  needsDirectors(mediaType) {
    return mediaType === "movie" || mediaType === "series" || mediaType === "anime-movie";
  }

  needsLiveActionMetadata(mediaType) {
    return mediaType === "movie" || mediaType === "series";
  }

  isWatched(value) {
    return value === true || value === "true";
  }

  hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  hasListValue(value) {
    return Array.isArray(value) && value.some((item) => this.hasValue(item));
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

  libraryType(file) {
    return this.scalar(this.app.metadataCache.getFileCache(file)?.frontmatter?.media_type);
  }

  showLibraryStatistics() {
    const rows = this.app.vault.getMarkdownFiles().filter(f => this.isMediaNote(f)).map(f => this.app.metadataCache.getFileCache(f)?.frontmatter || {}).filter(m => LIBRARY_TYPES.has(m.media_type) && !m.showcase);
    const modal = new Modal(this.app);
    modal.onOpen = () => {
      modal.contentEl.createEl("h2", { text: "Library statistics" });
      modal.contentEl.createEl("p", { text: `${rows.length} entries · ${rows.filter(m => m.favorite).length} favorites (showcase excluded)` });
      for (const kind of LIBRARY_TYPES) {
        const items = rows.filter(m => m.media_type === kind);
        if (!items.length) continue;
        const rated = items.filter(m => Number.isFinite(Number(m.rating)) && Number(m.rating) > 0 && Number(m.rating) <= 5);
        modal.contentEl.createEl("h3", { text: kind });
        modal.contentEl.createEl("p", { text: `${items.length} entries · ${items.filter(m => m.status === "completed" || (!m.status && this.isWatched(m.watched))).length} completed · ${items.filter(m => m.status === "active").length} active · average rating ${rated.length ? (rated.reduce((n,m) => n + Number(m.rating), 0) / rated.length).toFixed(1) : "unrated"}` });
      }
    };
    modal.open();
  }

  async addLibraryItem() {
    if (this.addingLibraryItem) return;
    this.addingLibraryItem = true;
    try {
      const kind = await chooseLibrary(this.app, "What would you like to add?",
        Object.entries(LIBRARY_LABELS).map(([value, title]) => ({ title, value })));
      if (!kind) return;
      const input = await libraryForm(this.app, `Add ${LIBRARY_LABELS[kind].toLowerCase()}`, [
        { key: "title", label: "Title", value: "", placeholder: "Enter a title to find…" },
      ], (values) => { if (!values.title.trim()) throw new Error("Enter a title to continue."); }, {}, { searchActions: true, description: "Find the title and cover online, or add your own entry." });
      if (!input) return;
      if (!input.title.trim()) throw new Error("Enter a title.");
      let metadata = { title: input.title.trim(), media_type: kind };
      if (input.mode === "search") {
        new Notice("Motion Arts: searching…");
        const results = await this.searchLibrary(kind, input.title.trim());
        if (!results.length) throw new Error("No matches. Try another title or use Enter manually.");
        const picked = await chooseLibrary(this.app, "Choose the correct title", results.map((item) => ({
          title: [item.title, item.year, item.format].filter(Boolean).join(" · "), value: item,
        })));
        if (!picked) return;
        metadata = await this.libraryDetails(picked);
      }
      metadata.status = "planned";
      const values = await libraryForm(this.app, `Add ${LIBRARY_LABELS[kind].toLowerCase()} to your library`, this.libraryFields(metadata, true), (values) => this.validateLibrary({ ...metadata, ...values }), metadata, { compact: true, submitLabel: "Add to library" });
      if (!values) return;
      const fields = { ...metadata, ...values, media_type: kind };
      this.validateLibrary(fields);
      await this.createLibraryItem(fields);
    } catch (error) {
      console.error("Motion Arts library:", error);
      new Notice(`Motion Arts: ${error.message || error}`);
    } finally {
      this.addingLibraryItem = false;
    }
  }

  libraryFields(data, creating = false) {
    const fields = creating ? [
      { key: "title", label: "Title", value: data.title || "" },
    ] : [];
    if (creating) return fields;
    fields.push({ key: "status", label: "Status", value: data.status || (this.isWatched(data.watched) ? "completed" : "planned"),
      choices: { planned: "Planned", active: data.media_type === "game" ? "Playing" : "Watching", completed: "Completed", paused: "Paused", dropped: "Dropped" } });
    const counts = LIBRARY_PROGRESS[data.media_type] || [];
    for (const key of counts) fields.push({ key, label: key.replaceAll("_", " "), value: data[key] ?? 0, number: true });
    fields.push({ key: "rating", label: "Your rating (0–5; 0 means unrated)", value: data.rating ?? 0, number: true });
    fields.push({ key: "related_media", label: "Related notes (use [[note links]])", value: data.related_media || "" });
    fields.push({ key: "favorite", label: "Favorite", value: data.favorite === true, toggle: true });
    return fields;
  }

  validateLibrary(data) {
    if (data.title !== undefined && (typeof data.title !== "string" || !data.title.trim())) throw new Error("Title cannot be empty.");
    if (!LIBRARY_STATUSES.has(data.status)) throw new Error("Choose a valid status.");
    for (const key of LIBRARY_NUMBERS) {
      if (data[key] === undefined) continue;
      const value = Number(data[key]);
      if (!Number.isFinite(value) || value < 0) throw new Error(`${key.replaceAll("_", " ")} must be a nonnegative number.`);
      if (key !== "hours_played" && key !== "rating" && !Number.isInteger(value)) throw new Error(`${key.replaceAll("_", " ")} must be a whole number.`);
    }
    if (Number(data.rating || 0) > 5) throw new Error("Rating must be between 0 and 5.");
    for (const prefix of ["season", "episode"]) {
      if (Number(data[`${prefix}_total`]) > 0 && Number(data[`${prefix}_current`]) > Number(data[`${prefix}_total`])) {
        throw new Error(`${prefix} progress cannot exceed the total. Use 0 for an unknown total.`);
      }
    }
    if (!validLibraryCover(data.poster)) throw new Error("Cover must be an HTTP(S) URL or a [[local image link]].");
  }

  updateLibraryDates(frontmatter) {
    if (!LIBRARY_STATUSES.has(frontmatter.status)) return;
    if (frontmatter.status === "active" && !this.hasValue(frontmatter.started_date)) frontmatter.started_date = this.today();
    if (frontmatter.status === "completed" && !this.hasValue(frontmatter.completed_date)) frontmatter.completed_date = this.today();
    if (["anime", "movie", "series", "anime-movie"].includes(frontmatter.media_type)) {
      frontmatter.watched = frontmatter.status === "completed";
      if (frontmatter.watched && !this.hasValue(frontmatter.watched_date)) frontmatter.watched_date = this.today();
    }
  }

  movieFrontmatter(data) {
    const watched = data.status ? data.status === "completed" : this.isWatched(data.watched);
    const result = {
      media_type: "movie", title: data.title, industry: data.industry || "",
      watched, watched_date: data.watched_date || (watched ? this.today() : null),
      genres: data.genres || [], year: data.year || "", directors: data.directors || [],
      cast: (data.cast || []).slice(0, 3), poster: data.poster || "", tags: ["motion-art", "movie"],
    };
    // Keep only tracking options the user actually chose; defaults need no properties.
    if (["active", "paused", "dropped"].includes(data.status)) result.status = data.status;
    if (Number(data.rating) > 0) result.rating = data.rating;
    result.favorite = data.favorite === true;
    if (data.related_media) result.related_media = data.related_media;
    for (const key of ["started_date", "completed_date", "showcase"]) if (data[key]) result[key] = data[key];
    return result;
  }

  compactLibraryMetadata(data) {
    if (data.media_type === "movie") return this.movieFrontmatter(data);
    const result = { media_type: data.media_type, title: data.title, year: data.year || "", genres: data.genres || [], poster: data.poster || "", tags: data.tags || ["media-library", data.media_type] };
    const screen = ["series", "anime", "anime-movie"].includes(data.media_type);
    if (screen) {
      result.watched = data.status ? data.status === "completed" : this.isWatched(data.watched);
      result.watched_date = data.watched_date || (result.watched ? this.today() : null);
    }
    // IDs are needed for reliable refresh; descriptive provider payload stays in the preview.
    for (const key of ["metadata_provider", "metadata_id", ...(LIBRARY_PROGRESS[data.media_type] || [])]) {
      if (data[key] !== undefined && data[key] !== "") result[key] = data[key];
    }
    if (screen) {
      result.industry = data.industry || "";
      if (data.directors?.length) result.directors = data.directors;
    }
    if (data.media_type === "series") {
      if (data.directors?.length) result.directors = data.directors;
      if (data.cast?.length) result.cast = data.cast.slice(0, 3);
    }
    if (data.status && data.status !== "planned" && !(screen && data.status === "completed")) result.status = data.status;
    if (Number(data.rating) > 0) result.rating = data.rating;
    result.favorite = data.favorite === true;
    for (const key of ["started_date", "completed_date", "related_media", "showcase"]) if (data[key]) result[key] = data[key];
    return result;
  }

  async createLibraryItem(metadata) {
    metadata = { status: "planned", ...metadata };
    if (typeof metadata.title !== "string" || !metadata.title.trim()) throw new Error("Title cannot be empty.");
    if (!LIBRARY_TYPES.has(metadata.media_type)) throw new Error("Unsupported library type.");
    this.validateLibrary(metadata);
    {
      const existing = this.app.vault.getMarkdownFiles().find((file) => {
        if (!this.isMediaNote(file)) return false;
        const fm = this.app.metadataCache.getFileCache(file)?.frontmatter || {};
        return fm.media_type === metadata.media_type && (
          (metadata.metadata_id && fm.metadata_provider === metadata.metadata_provider && String(fm.metadata_id) === String(metadata.metadata_id))
          || (this.normalizedTitle(fm.title || file.basename) === this.normalizedTitle(metadata.title)
            && (!fm.year || !metadata.year || String(fm.year) === String(metadata.year)))
        );
      });
      if (existing) {
        new Notice("Motion Arts: this entry is already in your library.");
        await this.app.workspace.getLeaf(false).openFile(existing);
        return existing;
      }
    }
    if (!this.app.vault.getAbstractFileByPath(LIBRARY_FOLDER)) await this.app.vault.createFolder(LIBRARY_FOLDER);
    const suffix = metadata.media_type === "series" ? "Series" : LIBRARY_LABELS[metadata.media_type];
    const title = metadata.title.trim().replace(/[\\/:*?"<>|#\[\]]/g, "-").replace(/\s+/g, " ").replace(/[. ]+$/, "").slice(0, 140) || "Untitled";
    const base = `${title} - ${suffix}`;
    let path = `${LIBRARY_FOLDER}/${base}.md`;
    let index = 2;
    while (this.app.vault.getAbstractFileByPath(path)) path = `${LIBRARY_FOLDER}/${base} ${index++}.md`;
    const frontmatter = this.compactLibraryMetadata(metadata);
    this.updateLibraryDates(frontmatter);
    const file = await this.app.vault.create(path, `---\n${stringifyYaml(frontmatter).trim()}\n---\n\n## My notes\n\n`);
    await this.app.workspace.getLeaf(false).openFile(file);
    return file;
  }

  async editLibraryProgress(file) {
    try {
      const data = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!data) throw new Error("Note metadata is not ready yet.");
      const values = await libraryForm(this.app, data.title || file.basename, this.libraryFields(data), (values) => this.validateLibrary({ ...data, ...values }));
      if (!values) return;
      this.validateLibrary({ ...data, ...values });
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        Object.assign(fm, values);
        this.updateLibraryDates(fm);
      });
    } catch (error) { new Notice(`Motion Arts: ${error.message || error}`); }
  }

  async selectMediaToRefresh() {
    let file = this.app.workspace.getActiveFile();
    if (!this.isMediaNote(file) || !LIBRARY_TYPES.has(this.libraryType(file))) {
      const files = this.app.vault.getMarkdownFiles().filter(f => this.isMediaNote(f) && LIBRARY_TYPES.has(this.libraryType(f)));
      file = await chooseLibrary(this.app, "Choose an entry to refresh", files.map(f => {
        const data = this.app.metadataCache.getFileCache(f)?.frontmatter || {};
        return { title: `${data.title || f.basename} · ${LIBRARY_LABELS[data.media_type]}`, value: f };
      }));
    }
    if (file) await this.refreshLibraryMetadata(file);
  }

  async refreshLibraryMetadata(file) {
    if (this.mediaRefreshBusy) return;
    this.mediaRefreshBusy = true;
    const messages = [];
    try {
      const data = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!data) throw new Error("Note metadata is not ready.");
      if (!LIBRARY_TYPES.has(data.media_type)) throw new Error("Unsupported library type.");
      try {
        if (data.metadata_provider && data.metadata_id) {
          await this.applyLibraryMetadata(file, await this.libraryDetails(data));
          messages.push("Metadata refreshed");
        } else if (VALID_MEDIA_TYPES.has(data.media_type)) {
          const changed = await this.syncTmdbIfNeeded(file, data, true);
          messages.push(changed ? "TMDB metadata refreshed" : "No TMDB changes; check the token or title if details are missing");
        } else messages.push("Link a provider to refresh catalog details");
      } catch (error) { messages.push(`Metadata unavailable: ${error.message || error}`); }
      new Notice(`Motion Arts: ${messages.join(". ")}.`);
    } catch (error) { new Notice(`Motion Arts: ${error.message || error}`); }
    finally { this.mediaRefreshBusy = false; }
  }

  async linkLibraryMetadata(file) {
    try {
      const data = this.app.metadataCache.getFileCache(file)?.frontmatter;
      if (!data || !LIBRARY_TYPES.has(data.media_type)) return;
      const results = await this.searchLibrary(data.media_type, data.title || file.basename);
      if (!results.length) throw new Error("No matches. Keep the entry manual or change its title and try again.");
      const picked = await chooseLibrary(this.app, "Select metadata for this note", results.map((item) => ({
        title: [item.title, item.year, item.format].filter(Boolean).join(" · "), value: item,
      })));
      if (!picked) return;
      const details = await this.libraryDetails(picked);
      const confirmed = await libraryForm(this.app, "Link this provider? Personal values and covers are kept.", [], () => {}, details);
      if (!confirmed) return;
      await this.applyLibraryMetadata(file, details, true);
      new Notice("Motion Arts: provider linked; existing values kept.");
    } catch (error) { new Notice(`Motion Arts: linking failed. ${error.message || error}`); }
  }

  async applyLibraryMetadata(file, updated, link = false) {
    const identity = { metadata_provider: updated.metadata_provider, metadata_id: updated.metadata_id };
    updated = this.compactLibraryMetadata(updated);
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      if (fm.media_type !== updated.media_type) throw new Error("The note's media type changed; try again.");
      for (const [key, value] of Object.entries(updated)) {
        if (["title", "media_type", "metadata_provider", "metadata_id", "watched", "watched_date", "tags", "status", "rating", "favorite", "started_date", "completed_date", "related_media", "showcase"].includes(key)) continue;
        if (value === "" || value == null || (Array.isArray(value) && !value.length)) continue;
        if (key.endsWith("_total")) {
          // Unknown provider totals must not erase known totals or invalidate progress.
          if (Number(value) > 0 && Number(value) >= Number(fm[key.replace("_total", "_current")] || 0)) fm[key] = value;
        } else if (!this.hasValue(fm[key]) || (Array.isArray(fm[key]) && !fm[key].length)) fm[key] = value;
      }
      if (link) {
        fm.metadata_provider = identity.metadata_provider;
        fm.metadata_id = identity.metadata_id;
      }
    });
  }

  async libraryRequest(url, body) {
    let timer;
    let response;
    try {
      response = await Promise.race([
        requestUrl({ url, method: body ? "POST" : "GET", throw: false,
          headers: { Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
          ...(body ? { body: JSON.stringify(body) } : {}) }),
        new Promise((_, reject) => { timer = window.setTimeout(() => reject(new Error("Provider timed out. Try again later or create a manual entry.")), 12000); }),
      ]);
    } finally { window.clearTimeout(timer); }
    if (response.status >= 400) throw new Error(`Provider returned HTTP ${response.status}. Try again later or create a manual entry.`);
    const data = response.json || JSON.parse(response.text);
    if (data.errors?.length) throw new Error(data.errors[0].message || "Provider request failed.");
    return data;
  }

  async searchLibrary(kind, query) {
    if (!LIBRARY_TYPES.has(kind)) throw new Error("Unsupported library type.");
    query = String(query || "").trim();
    if (!query) return [];
    if (["movie", "series", "anime-movie"].includes(kind)) {
      if (!this.settings.tmdbBearerToken) throw new Error("Add your TMDB token in Motion Arts settings or use manual entry.");
      const type = kind === "series" ? "tv" : "movie";
      const data = await this.apiGet(`/search/${type}`, { query });
      return (data.results || []).slice(0, 12).map(m => ({ title: m.title || m.name, year: (m.release_date || m.first_air_date || "").slice(0, 4), media_type: kind, metadata_provider: "tmdb", metadata_id: String(m.id) }));
    }
    if (kind === "game") {
      const data = await this.libraryRequest(`https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`);
      return (data.items || []).filter((item) => item.type === "app").slice(0, 12).map((item) => ({
        title: item.name, media_type: kind, metadata_provider: "steam", metadata_id: String(item.id), poster: item.tiny_image || "",
      }));
    }
    try {
      const data = await this.libraryRequest("https://graphql.anilist.co", {
        query: `query ($search: String, $type: MediaType) { Page(perPage: 12) { media(search: $search, type: $type, sort: SEARCH_MATCH) {
          id title { english romaji } startDate { year } format coverImage { large }
        } } }`, variables: { search: query, type: "ANIME" },
      });
      return (data.data?.Page?.media || []).map((item) => ({
        title: item.title.english || item.title.romaji, year: item.startDate?.year || "", format: item.format,
        poster: item.coverImage?.large || "", media_type: kind, metadata_provider: "anilist", metadata_id: String(item.id),
      }));
    } catch (error) {
      new Notice("Motion Arts: AniList unavailable; trying MyAnimeList via Jikan.");
      const data = await this.libraryRequest(`https://api.jikan.moe/v4/${kind}?q=${encodeURIComponent(query)}&limit=12`);
      return (data.data || []).map((item) => ({
        title: item.title_english || item.title, year: item.year || "", format: item.type,
        poster: item.images?.jpg?.large_image_url || "", media_type: kind, metadata_provider: "jikan", metadata_id: String(item.mal_id),
      }));
    }
  }

  async libraryDetails(item) {
    const kind = item.media_type;
    if (!LIBRARY_TYPES.has(kind)) throw new Error("Unsupported library type.");
    if (!/^\d+$/.test(String(item.metadata_id))) throw new Error("Invalid provider ID.");
    if (item.metadata_provider === "tmdb" && ["movie", "series", "anime-movie"].includes(kind)) {
      const type = kind === "series" ? "tv" : "movie";
      const m = await this.apiGet(`/${type}/${item.metadata_id}`, { append_to_response: "credits" });
      return { ...item, industry: this.industryFrom(m, kind), title: m.title || m.name, description: m.overview || "", runtime: m.runtime || m.episode_run_time?.[0] || 0,
        poster: m.poster_path ? IMAGE_BASE + m.poster_path : "", genres: (m.genres || []).map(g => g.name),
        directors: (m.credits?.crew || []).filter(c => c.job === "Director").map(c => c.name), creators: (m.created_by || []).map(c => c.name),
        cast: (m.credits?.cast || []).slice(0, 12).map(c => c.name), year: (m.release_date || m.first_air_date || "").slice(0, 4),
        ...(kind === "series" ? { season_total: m.number_of_seasons || 0, episode_total: m.number_of_episodes || 0 } : {}), source_url: `https://www.themoviedb.org/${type}/${m.id}` };
    }
    if (item.metadata_provider === "steam" && kind === "game") {
      const root = await this.libraryRequest(`https://store.steampowered.com/api/appdetails?appids=${item.metadata_id}&l=english&cc=US`);
      const app = root[item.metadata_id];
      if (!app?.success || !app.data) throw new Error("Steam details are unavailable.");
      const data = app.data;
      const poster = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${item.metadata_id}/library_600x900.jpg`;
      let image = data.header_image || data.capsule_image || item.poster || "";
      try {
        const check = await requestUrl({ url: poster, method: "HEAD", throw: false });
        if (check.status === 200 && (check.headers?.["content-type"] || "").startsWith("image/")) image = poster;
      } catch (_) { /* Keep the verified store image when no portrait artwork exists. */ }
      return { title: data.name, media_type: kind, metadata_provider: "steam", metadata_id: String(item.metadata_id),
        poster: image, description: plainLibraryText(data.short_description), genres: (data.genres || []).map((g) => g.description),
        developers: data.developers || [], publishers: data.publishers || [],
        platforms: Object.entries(data.platforms || {}).filter(([, enabled]) => enabled).map(([name]) => name),
        year: data.release_date?.date?.match(/\b\d{4}\b/)?.[0] || "", source_url: `https://store.steampowered.com/app/${item.metadata_id}/`,
      };
    }
    if (kind !== "anime") throw new Error("Provider does not match this library.");
    if (item.metadata_provider === "anilist") {
      const data = await this.libraryRequest("https://graphql.anilist.co", {
        query: `query ($id: Int, $type: MediaType) { Media(id: $id, type: $type) {
          id title { english romaji } description(asHtml: false) genres episodes format
          startDate { year } coverImage { extraLarge large } studios(isMain: true) { nodes { name } } siteUrl
        } }`, variables: { id: Number(item.metadata_id), type: "ANIME" },
      });
      const media = data.data?.Media;
      if (!media) throw new Error("AniList details are unavailable.");
      return { title: media.title.english || media.title.romaji, media_type: kind, metadata_provider: "anilist", metadata_id: String(media.id),
        description: plainLibraryText(media.description), poster: media.coverImage?.extraLarge || media.coverImage?.large || "",
        genres: media.genres || [], year: media.startDate?.year || "", format: media.format || "", source_url: media.siteUrl || "",
        ...{ episode_total: media.episodes || 0, studios: (media.studios?.nodes || []).map((s) => s.name) },
      };
    }
    if (item.metadata_provider === "jikan") {
      const payload = await this.libraryRequest(`https://api.jikan.moe/v4/${kind}/${item.metadata_id}/full`);
      const media = payload.data;
      if (!media) throw new Error("MyAnimeList details are unavailable.");
      return { title: media.title_english || media.title, media_type: kind, metadata_provider: "jikan", metadata_id: String(media.mal_id),
        description: plainLibraryText(media.synopsis), poster: media.images?.jpg?.large_image_url || "", genres: (media.genres || []).map((g) => g.name),
        year: media.year || String(media.aired?.from || "").slice(0, 4), format: media.type || "", source_url: media.url || "",
        ...{ episode_total: media.episodes || 0, studios: (media.studios || []).map((s) => s.name) },
      };
    }
    throw new Error("Unknown metadata provider.");
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
      .setDesc("Automatically fills poster, genres, industry, year, directors, and top cast for motionArts notes.")
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
