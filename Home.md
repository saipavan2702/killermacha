
```dataviewjs
const { setIcon, Notice } = require("obsidian");
const root = dv.container.createDiv({ cls: "home-shell" });

const styleId = "home-dashboard-inline-style";
document.getElementById(styleId)?.remove();
const style = document.createElement("style");
style.id = styleId;
style.textContent = `
.home-shell {
  --home-surface: color-mix(in srgb, var(--background-secondary) 64%, transparent);
  --home-surface-strong: color-mix(in srgb, var(--background-secondary-alt) 78%, transparent);
  --home-line: color-mix(in srgb, var(--background-modifier-border) 76%, transparent);
  --home-text: var(--text-normal);
  --home-muted: var(--text-muted);
  --home-sage: #a6d189;
  --home-teal: #81c8be;
  --home-lavender: #babbf1;
  --home-peach: #ef9f76;
  max-width: 1120px;
  margin: 0 auto;
  padding: 26px 10px 72px;
  color: var(--home-text);
}
.theme-light .home-shell {
  --home-sage: #5f8f62;
  --home-teal: #4f8f8a;
  --home-lavender: #776fa6;
  --home-peach: #b9684a;
}
.home-shell * { box-sizing: border-box; }
.home-shell a { text-decoration: none; }
.home-shell .home-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.16fr) minmax(330px, 0.84fr);
  min-height: 350px;
  overflow: hidden;
  border: 1px solid var(--home-line);
  border-radius: 28px;
  background:
    radial-gradient(circle at 82% 12%, color-mix(in srgb, var(--home-lavender) 18%, transparent), transparent 34%),
    radial-gradient(circle at 68% 86%, color-mix(in srgb, var(--home-sage) 18%, transparent), transparent 42%),
    linear-gradient(135deg, var(--home-surface-strong), var(--background-primary));
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.11);
}
.home-shell .home-hero-copy {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 48px 22px 48px 48px;
}
.home-shell .home-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}
.home-shell .home-kicker {
  margin: 0;
  color: var(--home-sage);
  font-size: 0.7rem;
  font-weight: 780;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.home-shell .home-hero h2 {
  max-width: 12ch;
  margin: 0;
  color: var(--home-text);
  font-size: clamp(2.35rem, 5vw, 4rem);
  font-weight: 740;
  line-height: 0.98;
  letter-spacing: -0.055em;
}
.home-shell .home-hero-copy > p {
  max-width: 45ch;
  margin: 19px 0 0;
  color: var(--home-muted);
  font-size: 0.93rem;
  line-height: 1.7;
}
.home-shell .home-tools {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 28px;
}
.home-shell .home-search,
.home-shell .home-capture {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 43px;
  padding: 9px 13px;
  border: 1px solid var(--home-line);
  border-radius: 12px;
  color: var(--home-text);
  background: color-mix(in srgb, var(--background-primary) 58%, transparent);
}
.home-shell .home-search { cursor: pointer; }
.home-shell .home-search:hover { border-color: color-mix(in srgb, var(--home-teal) 52%, var(--home-line)); }
.home-shell .home-capture { min-width: min(300px, 100%); flex: 1; }
.home-shell .home-capture input {
  min-width: 120px;
  flex: 1;
  border: 0;
  outline: 0;
  color: var(--home-text);
  background: transparent;
}
.home-shell .home-capture input::placeholder { color: var(--home-muted); }
.home-shell .home-search small,
.home-shell .home-capture small { color: var(--home-muted); font-size: 0.65rem; }
.home-shell .home-search small {
  padding: 2px 6px;
  border: 1px solid var(--home-line);
  border-radius: 5px;
}
.home-shell .home-botanical { position: relative; min-height: 350px; }
.home-shell .home-botanical::before {
  position: absolute;
  inset: 28px 24px 24px 18px;
  border: 1px solid color-mix(in srgb, var(--home-sage) 18%, transparent);
  border-radius: 50% 42% 48% 44%;
  background: color-mix(in srgb, var(--home-sage) 5%, transparent);
  content: "";
}
.home-shell .home-plant {
  position: absolute;
  z-index: 1;
  right: -8px;
  bottom: -16px;
  width: min(430px, 108%);
  height: 338px;
  object-fit: contain;
  object-position: right bottom;
  filter: saturate(0.84) contrast(0.98) drop-shadow(0 20px 22px rgba(0, 0, 0, 0.16));
  pointer-events: none;
  user-select: none;
}
.home-shell .home-clock {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding-left: 16px;
  border-left: 1px solid var(--home-line);
}
.home-shell .home-clock-time {
  color: var(--home-muted);
  font-size: 0.7rem;
  font-weight: 760;
  letter-spacing: 0.04em;
  line-height: 1;
}
.home-shell .home-clock-date {
  color: var(--text-faint);
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.home-shell .home-rain {
  position: relative;
  height: 168px;
  overflow: hidden;
  margin-top: 26px;
  border: 1px solid var(--home-line);
  border-radius: 18px;
  background: var(--home-surface);
}
.home-shell .home-rain > img:first-child {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center 56%;
  filter: saturate(0.72) brightness(0.7) contrast(1.04);
}
.home-shell .home-rain::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(9, 17, 19, 0.79), rgba(9, 17, 19, 0.18) 64%, rgba(9, 17, 19, 0.58));
  content: "";
}
.home-shell .home-rain-copy {
  position: absolute;
  z-index: 2;
  left: 25px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.9);
}
.home-shell .home-rain-copy strong { display: block; font-size: 0.83rem; font-weight: 720; }
.home-shell .home-rain-copy span {
  display: block;
  margin-top: 5px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.68rem;
}
.home-shell .home-section { margin-top: 58px; }
.home-shell .home-section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 20px;
}
.home-shell .home-section-head h3 {
  margin: 0;
  color: var(--home-text);
  font-size: 1.05rem;
  font-weight: 760;
  letter-spacing: -0.025em;
}
.home-shell .home-section-head p { margin: 0; color: var(--home-muted); font-size: 0.7rem; }
.home-shell .home-map {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
}
.home-shell .home-map-link {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-height: 112px;
  padding: 21px;
  overflow: hidden;
  border: 1px solid var(--home-line);
  border-radius: 17px;
  color: var(--home-text);
  background: var(--home-surface);
  transition: transform 170ms ease, border-color 170ms ease, background 170ms ease;
}
.home-shell .home-map-link::after {
  position: absolute;
  right: -22px;
  bottom: -34px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--card-color) 10%, transparent);
  content: "";
}
.home-shell .home-map-link:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--card-color) 48%, var(--home-line));
  background: var(--home-surface-strong);
}
.home-shell .home-map-copy { display: grid; min-width: 0; gap: 6px; }
.home-shell .home-map-copy strong { color: var(--home-text); font-size: 0.88rem; font-weight: 730; }
.home-shell .home-map-copy small { color: var(--home-muted); font-size: 0.69rem; line-height: 1.45; }
.home-shell .home-icon { display: inline-flex; flex: 0 0 auto; }
.home-shell .home-icon svg {
  width: 18px;
  height: 18px;
  color: var(--card-color, var(--home-teal));
  stroke-width: 1.85;
}
.home-shell .home-live-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  align-items: start;
}
.home-shell .home-panel {
  padding: 25px 26px 18px;
  border: 1px solid var(--home-line);
  border-radius: 18px;
  background: var(--home-surface);
}
.home-shell .home-panel-head { display: flex; align-items: center; gap: 10px; margin-bottom: 17px; }
.home-shell .home-panel h3 {
  margin: 0;
  color: var(--home-text);
  font-size: 0.75rem;
  font-weight: 760;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.home-shell .home-row,
.home-shell .home-task {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 51px;
  padding: 10px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--home-line) 62%, transparent);
}
.home-shell .home-row:last-child,
.home-shell .home-task:last-child { border-bottom: 0; }
.home-shell .home-row-body { display: grid; min-width: 0; gap: 4px; }
.home-shell .home-note-link,
.home-shell .home-task-text {
  overflow: hidden;
  color: var(--home-text);
  font-size: 0.79rem;
  font-weight: 640;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home-shell .home-row-body small {
  overflow: hidden;
  color: var(--home-muted);
  font-size: 0.65rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home-shell .home-check {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, var(--home-sage) 72%, var(--home-line));
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-sage) 9%, transparent);
}
.home-shell .home-empty { padding: 12px 0; color: var(--home-muted); font-size: 0.76rem; }
.home-shell .home-footer {
  margin-top: 58px;
  padding-top: 20px;
  border-top: 1px solid var(--home-line);
  color: var(--home-muted);
  font-size: 0.67rem;
  text-align: center;
  letter-spacing: 0.07em;
}
@media (max-width: 900px) {
  .home-shell .home-hero { grid-template-columns: 1fr; }
  .home-shell .home-hero-copy { padding: 42px 40px 12px; }
  .home-shell .home-botanical { min-height: 280px; }
  .home-shell .home-plant { height: 290px; }
  .home-shell .home-map { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .home-shell { padding: 8px 0 48px; }
  .home-shell .home-hero { border-radius: 20px; }
  .home-shell .home-hero-copy { padding: 34px 24px 8px; }
  .home-shell .home-botanical { min-height: 250px; }
  .home-shell .home-plant { right: -28px; height: 255px; }
  .home-shell .home-rain { height: 138px; }
  .home-shell .home-section { margin-top: 46px; }
  .home-shell .home-section-head { align-items: start; flex-direction: column; gap: 5px; }
  .home-shell .home-map,
  .home-shell .home-live-grid { grid-template-columns: 1fr; }
}
`;
document.head.appendChild(style);

const allPages = dv.pages()
  .where(page => page.file.path !== dv.current().file.path && !page.file.path.startsWith(".obsidian/"));
const openTasks = allPages.file.tasks.where(task => !task.completed);
const recent = allPages.sort(page => page.file.mtime, "desc").slice(0, 6);
const hour = new Date().getHours();
const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

function icon(parent, name) {
  const el = parent.createSpan({ cls: "home-icon" });
  try { setIcon(el, name); } catch (_) { el.textContent = ""; }
  return el;
}

async function openVaultPath(path) {
  const file = app.vault.getAbstractFileByPath(path);
  if (!file) {
    new Notice(`Could not find ${path}`);
    return;
  }
  await app.workspace.getLeaf(false).openFile(file);
}

function vaultLink(path, label, description, iconName, color) {
  const link = document.createElement("a");
  link.className = "home-map-link";
  link.href = "#";
  link.onclick = event => {
    event.preventDefault();
    openVaultPath(path);
  };
  link.style.setProperty("--card-color", color);
  icon(link, iconName);
  const copy = document.createElement("span");
  copy.className = "home-map-copy";
  copy.appendChild(Object.assign(document.createElement("strong"), { textContent: label }));
  copy.appendChild(Object.assign(document.createElement("small"), { textContent: description }));
  link.appendChild(copy);
  return link;
}

function pageLink(page) {
  const link = document.createElement("a");
  link.className = "home-note-link";
  link.href = "#";
  link.onclick = event => {
    event.preventDefault();
    openVaultPath(page.file.path);
  };
  link.textContent = page.file.name;
  return link;
}

function recentRow(page) {
  const item = document.createElement("div");
  item.className = "home-row";
  icon(item, "file-clock");
  const body = document.createElement("div");
  body.className = "home-row-body";
  body.appendChild(pageLink(page));
  body.appendChild(Object.assign(document.createElement("small"), {
    textContent: `${page.file.folder || "Vault"} · ${window.moment(page.file.mtime.toJSDate()).fromNow()}`,
  }));
  item.appendChild(body);
  return item;
}

function panel(parent, title, iconName, color) {
  const box = parent.createDiv({ cls: "home-panel" });
  const head = box.createDiv({ cls: "home-panel-head" });
  head.style.setProperty("--card-color", color);
  icon(head, iconName);
  head.createEl("h3", { text: title });
  return box;
}

function sectionHead(parent, title, subtitle) {
  const head = parent.createDiv({ cls: "home-section-head" });
  head.createEl("h3", { text: title });
  head.createEl("p", { text: subtitle });
}

const hero = root.createDiv({ cls: "home-hero" });
const heroCopy = hero.createDiv({ cls: "home-hero-copy" });
const heroMeta = heroCopy.createDiv({ cls: "home-meta" });
heroMeta.createDiv({ cls: "home-kicker", text: window.moment().format("dddd · MMMM D") });
const clock = heroMeta.createDiv({ cls: "home-clock" });
const clockTime = clock.createSpan({ cls: "home-clock-time" });
clock.createSpan({ cls: "home-clock-date", text: "local time" });
heroCopy.createEl("h2", { text: `${greeting}, mmacha` });
heroCopy.createEl("p", { text: "A fresh place to find your bearings, choose one thing, and begin." });

const tools = heroCopy.createDiv({ cls: "home-tools" });
const search = tools.createDiv({ cls: "home-search" });
icon(search, "search");
search.createSpan({ text: "Find note" });
search.createEl("small", { text: "⌘ O" });
search.onclick = () => {
  try { app.commands.executeCommandById("switcher:open"); }
  catch (_) { app.commands.executeCommandById("global-search:open"); }
};

const capture = tools.createDiv({ cls: "home-capture" });
icon(capture, "pencil-line");
const captureInput = capture.createEl("input", { attr: { placeholder: "Capture to Inbox…" } });
const captureHint = capture.createEl("small", { text: "Enter" });
captureInput.onkeydown = async event => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  const text = captureInput.value.trim();
  if (!text) return;
  const path = "Inbox.md";
  let file = app.vault.getAbstractFileByPath(path);
  if (!file) file = await app.vault.create(path, "");
  await app.vault.append(file, `\n- ${text} (${window.moment().format("YYYY-MM-DD HH:mm")})`);
  captureInput.value = "";
  captureHint.textContent = "saved";
  new Notice("Captured to Inbox");
  window.setTimeout(() => captureHint.textContent = "Enter", 1200);
};

const botanical = hero.createDiv({ cls: "home-botanical" });
const plantAsset = app.vault.getAbstractFileByPath("attachments/dashboard-assets/plant-cluster.png");
if (plantAsset?.path) {
  const plant = botanical.createEl("img", {
    cls: "home-plant",
    attr: { src: app.vault.adapter.getResourcePath(plantAsset.path), alt: "Monstera, pothos and fern" },
  });
  plant.draggable = false;
}

function updateClock() {
  const now = window.moment();
  clockTime.textContent = now.format("h:mm A");
}
updateClock();
const clockTimer = window.setInterval(updateClock, 1000);
const clockObserver = new MutationObserver(() => {
  if (!root.isConnected) {
    window.clearInterval(clockTimer);
    clockObserver.disconnect();
  }
});
clockObserver.observe(document.body, { childList: true, subtree: true });

const rainAsset = app.vault.getAbstractFileByPath("attachments/dashboard-assets/rain-pond.gif");
if (rainAsset?.path) {
  const rain = root.createDiv({ cls: "home-rain" });
  const rainImage = rain.createEl("img", {
    attr: { src: app.vault.adapter.getResourcePath(rainAsset.path), alt: "Rain falling on a pond" },
  });
  rainImage.draggable = false;
  const rainCopy = rain.createDiv({ cls: "home-rain-copy" });
  rainCopy.createEl("strong", { text: "A little room to breathe" });
  rainCopy.createSpan({ text: "ambient rain · quiet focus" });
}

const map = root.createDiv({ cls: "home-section" });
sectionHead(map, "Vault map", "Six current areas, with no placeholder categories");
const mapGrid = map.createDiv({ cls: "home-map" });
[
  ["Tasks/Tasks.md", "Tasks", "Open loops and next actions", "circle-check", "var(--home-sage)"],
  ["Orcl/Oracle.md", "Work", "Reports, information and current work notes", "briefcase-business", "var(--home-teal)"],
  ["Upskill/SysDes/System Design Process.md", "System design", "Architecture, HLD and LLD", "network", "var(--home-lavender)"],
  ["QoL/Workspace.md", "References", "Tools, configs, ideas and useful trails", "library", "var(--home-peach)"],
  ["Macha/motionArts/Celluloid.base", "Motion arts", "Films, series and anime", "clapperboard", "var(--home-lavender)"],
  ["Lingo/Inglis/Vocabulary.md", "Languages", "English and Spanish practice", "languages", "var(--home-teal)"],
].forEach(args => mapGrid.appendChild(vaultLink(...args)));

const live = root.createDiv({ cls: "home-section" });
sectionHead(live, "Now", "Only what is useful at a glance");
const liveGrid = live.createDiv({ cls: "home-live-grid" });

const taskPanel = panel(liveGrid, "Focus queue", "list-checks", "var(--home-sage)");
if (openTasks.length) {
  openTasks.slice(0, 4).forEach(task => {
    const item = taskPanel.createDiv({ cls: "home-task" });
    item.createSpan({ cls: "home-check" });
    item.createSpan({ cls: "home-task-text", text: task.text });
  });
} else {
  taskPanel.createDiv({ cls: "home-empty", text: "Nothing open. Enjoy the quiet." });
}

const recentPanel = panel(liveGrid, "Recently touched", "history", "var(--home-teal)");
recent.forEach(page => recentPanel.appendChild(recentRow(page)));

root.createDiv({ cls: "home-footer", text: "grow slowly · make something quietly excellent" });
```
