const { Plugin, TFile } = require("obsidian");

const MEDIA_FOLDER = "mmacha/motionArts/Items/";
const WATCHED_FIELD = "watched";
const WATCHED_DATE_FIELD = "watched_date";

module.exports = class MovieWatchDatePlugin extends Plugin {
  onload() {
    this.pending = new Map();

    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (!this.isMediaNote(file)) {
          return;
        }
        this.scheduleCheck(file, 0);
      })
    );
  }

  onunload() {
    for (const timer of this.pending.values()) {
      window.clearTimeout(timer);
    }
    this.pending.clear();
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
      this.setWatchedDateIfNeeded(file, attempt);
    }, 300);
    this.pending.set(file.path, timer);
  }

  async setWatchedDateIfNeeded(file, attempt) {
    const cached = this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (!cached && attempt < 5) {
      this.scheduleCheck(file, attempt + 1);
      return;
    }
    if (!cached || !this.isWatched(cached[WATCHED_FIELD]) || this.hasValue(cached[WATCHED_DATE_FIELD])) {
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

  isWatched(value) {
    return value === true || value === "true";
  }

  hasValue(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  today() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};
