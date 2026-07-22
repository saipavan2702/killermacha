Map: Vault root
Connections: [[Upskill/Learning|Learning]], [[Macha/Macha|Macha]], [[QoL/Resources|Resources]], [[Tasks/Tasks|Tasks]]

```dataviewjs
const { setIcon, Notice } = require("obsidian");
const root = dv.container.createDiv({ cls: "home-shell" });

const styleId = "home-dashboard-inline-style";
document.getElementById(styleId)?.remove();
const style = document.createElement("style");
style.id = styleId;
style.textContent = `
.home-shell {
  --home-canvas: rgba(12, 12, 14, 0.18);
  --home-card: rgba(0, 0, 0, 0.24);
  --home-card-strong: rgba(0, 0, 0, 0.34);
  --home-line: rgba(255, 255, 255, 0.10);
  --home-text: #f2f3f7;
  --home-muted: rgba(242, 243, 247, 0.64);
  --home-accent: var(--color-accent, #8bd3dd);
  --home-accent-2: color-mix(in srgb, var(--color-accent, #8bd3dd), white 30%);
  --home-accent-3: color-mix(in srgb, var(--color-accent, #8bd3dd), #c4a7e7 38%);
  --home-shadow: rgba(0, 0, 0, 0.18);
  max-width: 1180px;
  margin: 0 auto;
  padding: 18px 0 42px;
  color: var(--home-text);
}
.theme-light .home-shell {
  --home-canvas: rgba(255, 255, 255, 0.26);
  --home-card: rgba(255, 255, 255, 0.42);
  --home-card-strong: rgba(255, 255, 255, 0.58);
  --home-line: rgba(40, 38, 35, 0.14);
  --home-text: #25231f;
  --home-muted: rgba(37, 35, 31, 0.64);
  --home-accent: var(--color-accent, #3a8d95);
  --home-accent-2: color-mix(in srgb, var(--color-accent, #3a8d95), black 22%);
  --home-accent-3: color-mix(in srgb, var(--color-accent, #3a8d95), #7353ba 28%);
  --home-shadow: rgba(65, 47, 24, 0.08);
}
.home-shell * { box-sizing: border-box; }
.home-shell .home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.8fr);
  gap: 18px;
  overflow: hidden;
  margin-bottom: 16px;
  padding: 26px;
  border: 1px solid var(--home-line);
  border-radius: 18px;
  background:
    radial-gradient(circle at 8% 10%, color-mix(in srgb, var(--home-accent), transparent 76%), transparent 34%),
    linear-gradient(135deg, var(--home-card-strong), var(--home-canvas));
  box-shadow: 0 16px 42px var(--home-shadow);
}
.home-shell .home-date {
  margin-bottom: 10px;
  color: var(--home-muted);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.home-shell .home-hero h2 {
  margin: 0;
  color: var(--home-text);
  font-size: clamp(2.3rem, 5vw, 4.4rem);
  line-height: 0.96;
  letter-spacing: 0;
}
.home-shell .home-hero p {
  max-width: 50ch;
  margin: 14px 0 0;
  color: var(--home-muted);
}
.home-shell .home-tools {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
}
.home-shell .home-search,
.home-shell .home-capture {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border: 1px solid var(--home-line);
  border-radius: 999px;
  background: color-mix(in srgb, var(--home-card), transparent 22%);
  cursor: pointer;
}
.home-shell .home-capture {
  min-width: min(360px, 100%);
  cursor: text;
}
.home-shell .home-capture input {
  min-width: 190px;
  flex: 1;
  border: 0;
  outline: 0;
  color: var(--home-text);
  background: transparent;
}
.home-shell .home-capture input::placeholder {
  color: var(--home-muted);
}
.home-shell .home-capture small {
  color: var(--home-muted);
  font-size: 0.72rem;
}
.home-shell .home-search small {
  margin-left: 12px;
  padding: 2px 8px;
  border: 1px solid var(--home-line);
  border-radius: 999px;
  color: var(--home-muted);
  background: rgba(0, 0, 0, 0.12);
  font-size: 0.72rem;
}
.home-shell .home-stats,
.home-shell .home-actions,
.home-shell .home-metrics,
.home-shell .home-grid {
  display: grid;
  gap: 12px;
}
.home-shell .home-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.home-shell .home-actions {
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin-bottom: 12px;
}
.home-shell .home-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 18px;
}
.home-shell .home-grid {
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.86fr);
  align-items: start;
}
.home-shell .home-main,
.home-shell .home-side {
  display: grid;
  gap: 14px;
}
.home-shell .home-stat,
.home-shell .home-action,
.home-shell .home-pill,
.home-shell .home-panel {
  border: 1px solid var(--home-line);
  background: var(--home-card);
  box-shadow: 0 10px 26px var(--home-shadow);
  backdrop-filter: blur(16px) saturate(1.1);
}
.home-shell .home-stat {
  min-height: 92px;
  padding: 15px;
  border-radius: 14px;
}
.home-shell .home-icon svg {
  width: 18px;
  height: 18px;
  color: var(--home-accent);
  stroke-width: 2.1;
}
.home-shell .home-stat strong {
  display: block;
  margin-top: 12px;
  color: var(--home-text);
  font-size: 1.85rem;
  line-height: 1;
}
.home-shell .home-stat span:last-child {
  display: block;
  margin-top: 5px;
  color: var(--home-muted);
  font-size: 0.78rem;
}
.home-shell .home-action {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 72px;
  padding: 12px;
  border-radius: 14px;
  color: var(--home-text);
  text-decoration: none;
}
.home-shell .home-action-text {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.home-shell .home-action strong,
.home-shell .home-note-link,
.home-shell .home-task-text {
  overflow: hidden;
  color: var(--home-text);
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
}
.home-shell .home-action small,
.home-shell .home-row-body small {
  overflow: hidden;
  color: var(--home-muted);
  font-size: 0.74rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.home-shell .home-pill {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 999px;
}
.home-shell .home-pill strong { color: var(--home-accent-2); }
.home-shell .home-pill span {
  color: var(--home-muted);
  font-size: 0.76rem;
}
.home-shell .home-panel {
  padding: 17px;
  border-radius: 14px;
}
.home-shell .home-panel-head {
  display: flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 11px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--home-line);
}
.home-shell .home-panel h3 {
  margin: 0;
  color: var(--home-text);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.home-shell .home-row,
.home-shell .home-task {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 42px;
  padding: 8px 2px;
  border-bottom: 1px solid color-mix(in srgb, var(--home-line), transparent 46%);
}
.home-shell .home-row:last-child,
.home-shell .home-task:last-child { border-bottom: 0; }
.home-shell .home-row-body {
  display: grid;
  min-width: 0;
  gap: 2px;
}
.home-shell .home-check {
  width: 15px;
  height: 15px;
  flex: 0 0 auto;
  border: 1px solid var(--home-accent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--home-accent), transparent 82%);
}
.home-shell .home-empty { color: var(--home-muted); }
@media (max-width: 980px) {
  .home-shell .home-hero,
  .home-shell .home-grid { grid-template-columns: 1fr; }
  .home-shell .home-actions { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 620px) {
  .home-shell .home-hero { padding: 22px; }
  .home-shell .home-actions,
  .home-shell .home-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
`;
document.head.appendChild(style);

const allPages = dv.pages()
  .where(p => p.file.path !== dv.current().file.path && !p.file.path.startsWith(".obsidian/"));
const tasks = allPages.file.tasks.where(t => !t.completed);
const recent = allPages.sort(p => p.file.mtime, "desc").slice(0, 7);
const learning = dv.pages('"Upskill"').sort(p => p.file.mtime, "desc").slice(0, 6);
const needsConnections = dv.pages('"Upskill"')
  .where(p => p.file.path !== "Upskill/Learning.md" && p.file.outlinks.length < 2)
  .sort(p => p.file.mtime, "desc")
  .slice(0, 6);
const media = dv.pages('"Macha/motionArts/Items"').sort(p => p.file.mtime, "desc").slice(0, 6);
const daily = allPages
  .where(p => /^\d{4}-\d{2}-\d{2}$/.test(p.file.name))
  .sort(p => p.file.name, "desc")
  .slice(0, 5);
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
const stale = allPages
  .where(p => p.file.mtime.toMillis() < thirtyDaysAgo)
  .sort(p => p.file.mtime, "asc")
  .slice(0, 5);

const hour = new Date().getHours();
const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

function icon(parent, name) {
  const el = parent.createSpan({ cls: "home-icon" });
  try { setIcon(el, name); } catch (_) { el.textContent = ""; }
  return el;
}

function openLink(path, label, sub, iconName) {
  const a = document.createElement("a");
  a.className = "home-action";
  a.href = `obsidian://open?path=${encodeURIComponent(path)}`;
  icon(a, iconName);
  const text = document.createElement("span");
  text.className = "home-action-text";
  text.appendChild(Object.assign(document.createElement("strong"), { textContent: label }));
  text.appendChild(Object.assign(document.createElement("small"), { textContent: sub }));
  a.appendChild(text);
  return a;
}

function pageLink(page, cls = "home-note-link") {
  const a = document.createElement("a");
  a.className = cls;
  a.href = `obsidian://open?path=${encodeURIComponent(page.file.path)}`;
  a.textContent = page.file.name;
  return a;
}

function row(page, meta, iconName = "file-text") {
  const item = document.createElement("div");
  item.className = "home-row";
  icon(item, iconName);
  const body = document.createElement("div");
  body.className = "home-row-body";
  body.appendChild(pageLink(page));
  body.appendChild(Object.assign(document.createElement("small"), { textContent: meta || page.file.folder || "vault" }));
  item.appendChild(body);
  return item;
}

function panel(parent, title, iconName) {
  const box = parent.createDiv({ cls: "home-panel" });
  const head = box.createDiv({ cls: "home-panel-head" });
  icon(head, iconName);
  head.createEl("h3", { text: title });
  return box;
}

function pill(parent, label, value) {
  const el = parent.createDiv({ cls: "home-pill" });
  el.createEl("strong", { text: value });
  el.createSpan({ text: label });
}

const hero = root.createDiv({ cls: "home-hero" });
const left = hero.createDiv({ cls: "home-hero-copy" });
left.createDiv({ cls: "home-date", text: window.moment().format("dddd, MMMM D") });
left.createEl("h2", { text: `${greeting}, mmacha` });
left.createEl("p", { text: "A live cockpit for focus, learning, references, and motion arts." });

const tools = left.createDiv({ cls: "home-tools" });

const search = tools.createDiv({ cls: "home-search" });
icon(search, "search");
search.createSpan({ text: "Find note" });
search.createEl("small", { text: "Open" });
search.onclick = () => {
  try {
    app.commands.executeCommandById("switcher:open");
  } catch (_) {
    app.commands.executeCommandById("global-search:open");
  }
};

const capture = tools.createDiv({ cls: "home-capture" });
icon(capture, "pencil-line");
const captureInput = capture.createEl("input", { attr: { placeholder: "Capture to Inbox..." } });
const captureHint = capture.createEl("small", { text: "Enter" });
captureInput.onkeydown = async (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  const text = captureInput.value.trim();
  if (!text) return;
  const path = "Inbox.md";
  let file = app.vault.getAbstractFileByPath(path);
  if (!file) file = await app.vault.create(path, "");
  const stamp = window.moment().format("YYYY-MM-DD HH:mm");
  await app.vault.append(file, `\n- ${text} (${stamp})`);
  captureInput.value = "";
  captureHint.textContent = "saved";
  new Notice("Captured to Inbox");
  setTimeout(() => captureHint.textContent = "Enter", 1200);
};

const stats = hero.createDiv({ cls: "home-stats" });
[
  ["Notes", allPages.length, "library"],
  ["Tasks", tasks.length, "circle-check"],
  ["Learning", dv.pages('"Upskill"').length, "graduation-cap"],
  ["Media", dv.pages('"Macha/motionArts/Items"').length, "clapperboard"],
].forEach(([label, value, iconName]) => {
  const card = stats.createDiv({ cls: "home-stat" });
  icon(card, iconName);
  card.createEl("strong", { text: value });
  card.createSpan({ text: label });
});

const actions = root.createDiv({ cls: "home-actions" });
[
  ["Inbox.md", "Inbox", "quick capture", "inbox"],
  ["Tasks/Tasks.md", "Tasks", "open work", "check-square"],
  ["QoL/Ideas.md", "Ideas", "capture sparks", "lightbulb"],
  ["QoL/Refs/Obsidian.md", "Obsidian", "vault notes", "gem"],
  ["Upskill/Learning.md", "Learning", "topic map", "map"],
  ["Upskill/DSA/DSA.md", "DSA", "practice", "binary"],
  ["Upskill/SysDes/System Design.md", "System Design", "architecture", "network"],
  ["Macha/Watches.md", "Watches", "personal shelf", "play"],
].forEach(args => actions.appendChild(openLink(...args)));

const metrics = root.createDiv({ cls: "home-metrics" });
pill(metrics, "recent notes", recent.length);
pill(metrics, "daily notes", daily.length);
pill(metrics, "review queue", stale.length);
pill(metrics, "needs links", needsConnections.length);

const grid = root.createDiv({ cls: "home-grid" });
const main = grid.createDiv({ cls: "home-main" });
const side = grid.createDiv({ cls: "home-side" });

const taskPanel = panel(main, "Focus Queue", "list-checks");
if (tasks.length) {
  tasks.slice(0, 9).forEach(t => {
    const item = taskPanel.createDiv({ cls: "home-task" });
    item.createSpan({ cls: "home-check" });
    item.createSpan({ cls: "home-task-text", text: t.text });
  });
} else {
  taskPanel.createDiv({ cls: "home-empty", text: "No open tasks in the Tasks folder." });
}

const recentPanel = panel(main, "Recently Edited", "history");
recent.forEach(p => recentPanel.appendChild(row(p, window.moment(p.file.mtime.toJSDate()).fromNow(), "file-clock")));

const learningPanel = panel(main, "Learning Radar", "radar");
learning.forEach(p => learningPanel.appendChild(row(p, p.file.folder.replace("Upskill/", "") || "Upskill", "book-open")));

const mediaPanel = panel(side, "Motion Arts", "clapperboard");
media.forEach(p => mediaPanel.appendChild(row(p, p.media_type ?? "media", "film")));

const dailyPanel = panel(side, "Daily Notes", "calendar-days");
daily.forEach(p => dailyPanel.appendChild(row(p, window.moment(p.file.mtime.toJSDate()).format("MMM D"), "calendar")));

const connectionsPanel = panel(side, "Needs Connections", "git-branch");
if (needsConnections.length) {
  needsConnections.forEach(p => connectionsPanel.appendChild(row(p, "add a related note", "link")));
} else {
  connectionsPanel.createDiv({ cls: "home-empty", text: "Learning notes are connected." });
}

const reviewPanel = panel(side, "Quiet Review", "archive-restore");
stale.forEach(p => reviewPanel.appendChild(row(p, `touched ${window.moment(p.file.mtime.toJSDate()).fromNow()}`, "refresh-ccw")));
```
