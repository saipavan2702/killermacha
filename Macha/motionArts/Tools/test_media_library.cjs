const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const vaultRoot = path.resolve(__dirname, '../../..');
const source = fs.readFileSync(path.join(vaultRoot, '.obsidian/plugins/mmacha-auto/main.js'), 'utf8');

function setup() {
  const notices = [], requests = [], modals = [], files = [], records = new Map();
  class TFile {
    constructor(filePath) { this.path = filePath; this.extension = 'md'; this.basename = path.basename(filePath, '.md'); }
  }
  class Modal {
    constructor(app) { this.app = app; }
    open() { modals.push(this); }
    close() { this.onClose?.(); }
  }
  class SuggestModal extends Modal { setPlaceholder() {} }
  const module = { exports: {} };
  const context = {
    module, console, URL, URLSearchParams, Map, Set, Date, queueMicrotask, window: { setTimeout, clearTimeout },
    require: (name) => {
      assert.equal(name, 'obsidian');
      return {
        Plugin: class {}, PluginSettingTab: class {}, Setting: class {}, TFile, Modal, SuggestModal,
        stringifyYaml: (value) => JSON.stringify(value),
        Notice: class { constructor(message) { notices.push(message); } },
        requestUrl: async (request) => { requests.push(request); return handler(request); },
      };
    },
  };
  let handler = () => { throw new Error('Unexpected network call'); };
  vm.runInNewContext(`${source}\nmodule.exports.testHooks = { chooseLibrary };`, context);
  const plugin = new module.exports();
  plugin.today = () => '2026-10-23';
  plugin.settings = { tmdbBearerToken: '', autoSyncTmdb: true };
  plugin.syncing = new Set(); plugin.completedSync = new Set(); plugin.genreCache = new Map();
  plugin.app = {
    metadataCache: { getFileCache: (file) => ({ frontmatter: records.get(file.path) }) },
    vault: {
      getMarkdownFiles: () => files,
      getAbstractFileByPath: (p) => files.find((file) => file.path === p),
      createFolder: async () => {},
      create: async (p, content) => { const file = new TFile(p); file.content = content; files.push(file); return file; },
    },
    fileManager: { processFrontMatter: async (file, update) => update(records.get(file.path)) },
    workspace: { getLeaf: () => ({ openFile: async () => {} }) },
  };
  function note(name, metadata) {
    const file = new TFile(`Macha/motionArts/Items/${name}.md`); files.push(file); records.set(file.path, metadata); return file;
  }
  return { plugin, note, records, requests, notices, modals, hooks: module.exports.testHooks, network: (fn) => { handler = fn; } };
}
const plain = (value) => JSON.parse(JSON.stringify(value));

test('suggestion remains selected when Obsidian closes the modal before the selection callback', async () => {
  const env = setup();
  const pending = env.hooks.chooseLibrary(env.plugin.app, 'Pick', [{ title: 'Monster', value: 19 }]);
  env.modals[0].close();
  env.modals[0].onChooseSuggestion({ value: 19 });
  assert.equal(await pending, 19);
  const cancelled = env.hooks.chooseLibrary(env.plugin.app, 'Pick', []);
  env.modals[1].close(); assert.equal(await cancelled, null);
});

test('AniList anime and manga keep provider IDs, covers, genres, and known progress totals', async () => {
  const env = setup();
  env.network((request) => {
    const body = JSON.parse(request.body);
    assert.equal(body.variables.type, 'MANGA');
    return { status: 200, json: { data: body.variables.search ? { Page: { media: [
      { id: 2, title: { english: 'Berserk' }, startDate: { year: 1989 }, format: 'MANGA', coverImage: { large: 'https://cover.test/a.jpg' } },
    ] } } : { Media: { id: 2, title: { romaji: 'Berserk' }, description: '<b>A story</b>', chapters: null, volumes: 42, genres: ['Fantasy'], coverImage: { large: 'https://cover.test/a.jpg' } } } } };
  });
  const results = await env.plugin.searchLibrary('manga', 'Berserk');
  assert.equal(results[0].metadata_provider, 'anilist');
  const details = await env.plugin.libraryDetails(results[0]);
  assert.equal(details.chapter_total, 0); assert.equal(details.volume_total, 42);
  assert.equal(details.poster, 'https://cover.test/a.jpg'); assert.equal(details.description, 'A story');
});

test('AniList failure falls back to Jikan without keys and preserves its identity', async () => {
  const env = setup();
  env.network((request) => request.url.includes('anilist') ? { status: 403, json: {} } : {
    status: 200, json: { data: request.url.endsWith('/full') ? {
      mal_id: 19, title: 'Monster', episodes: 74, genres: [{ name: 'Mystery' }], studios: [{ name: 'Madhouse' }], images: { jpg: { large_image_url: 'https://cover.test/monster.jpg' } },
    } : [{ mal_id: 19, title: 'Monster', type: 'TV' }] },
  });
  const results = await env.plugin.searchLibrary('anime', 'Monster');
  assert.equal(results[0].metadata_provider, 'jikan');
  const details = await env.plugin.libraryDetails(results[0]);
  assert.equal(details.episode_total, 74); assert.deepEqual(plain(details.studios), ['Madhouse']);
  assert.equal(env.requests.some((request) => request.headers.Authorization), false);
});

test('Steam filters non-app results and falls back to verified horizontal artwork', async () => {
  const env = setup();
  env.network((request) => {
    if (request.method === 'HEAD') return { status: 404 };
    if (request.url.includes('storesearch')) return { status: 200, json: { items: [
      { id: 1145360, name: 'Hades', type: 'app' }, { id: 1, name: 'Bundle', type: 'bundle' },
    ] } };
    return { status: 200, json: { '1145360': { success: true, data: {
      name: 'Hades', header_image: 'https://cover.test/header.jpg', short_description: '<b>Action</b>',
      platforms: { windows: true, mac: true, linux: false }, genres: [{ description: 'Action' }], developers: ['Supergiant'], release_date: { date: '17 Sep, 2020' },
    } } } };
  });
  const results = await env.plugin.searchLibrary('game', 'Hades'); assert.equal(results.length, 1);
  const details = await env.plugin.libraryDetails(results[0]);
  assert.equal(details.poster, 'https://cover.test/header.jpg'); assert.equal(details.year, '2020');
  assert.deepEqual(plain(details.platforms), ['windows', 'mac']);
});

test('refresh preserves user covers, notes metadata and progress; unknown or lower totals do not erase known totals', async () => {
  const env = setup();
  const fm = { media_type: 'manga', title: 'My title', poster: '[[my-cover.jpg]]', chapter_current: 50, chapter_total: 100, rating: 5, description: 'My description', genres: ['My genre'] };
  const file = env.note('My manga', fm);
  await env.plugin.applyLibraryMetadata(file, { media_type: 'manga', title: 'Provider title', poster: 'https://new.jpg', chapter_total: 0, genres: ['Other'], authors: ['Author'] });
  assert.equal(fm.chapter_total, 100); assert.equal(fm.poster, '[[my-cover.jpg]]'); assert.equal(fm.title, 'My title');
  assert.equal(fm.chapter_current, 50); assert.equal(fm.rating, 5); assert.equal(fm.description, 'My description');
  await env.plugin.applyLibraryMetadata(file, { media_type: 'manga', chapter_total: 40 });
  assert.equal(fm.chapter_total, 100);
  await env.plugin.applyLibraryMetadata(file, { media_type: 'manga', chapter_total: 110 });
  assert.equal(fm.chapter_total, 110);
});

test('duplicate imported or legacy anime opens the existing note rather than creating a second copy', async () => {
  const env = setup(); env.note('Monster - Anime', { title: 'Monster', media_type: 'anime' });
  const result = await env.plugin.createLibraryItem({ title: 'Monster', media_type: 'anime', metadata_id: '19', metadata_provider: 'jikan' });
  assert.equal(result.basename, 'Monster - Anime'); assert.equal(result.content, undefined);
});

test('new library files avoid the auto-template folder and sanitize filenames', async () => {
  const env = setup();
  const file = await env.plugin.createLibraryItem({ title: 'Game: one/two?', media_type: 'game', status: 'active', hours_played: 2.5 });
  assert.equal(file.path, 'Macha/motionArts/Library/Game- one-two- - Game.md');
  assert.match(file.content, /started_date/); assert.match(file.content, /## My notes/);
});

test('personal progress is validated; completed anime keeps original watched dates', () => {
  const { plugin } = setup();
  assert.throws(() => plugin.validateLibrary({ status: 'active', chapter_current: 12, chapter_total: 10 }));
  assert.throws(() => plugin.validateLibrary({ status: 'active', rating: 6 }));
  assert.throws(() => plugin.validateLibrary({ status: 'active', hours_played: NaN }));
  plugin.validateLibrary({ status: 'active', chapter_current: 12.5, chapter_total: 0 });
  const data = { media_type: 'anime', status: 'completed', watched_date: '2025-01-01' };
  plugin.updateLibraryDates(data);
  assert.equal(data.watched, true); assert.equal(data.watched_date, '2025-01-01'); assert.equal(data.completed_date, '2026-10-23');
  assert.equal(data.started_date, undefined);
});

test('manga, games and explicitly linked anime never enter automatic TMDB enrichment', async () => {
  const { plugin, requests } = setup();
  for (const fm of [{ media_type: 'game' }, { media_type: 'manga' }, { media_type: 'anime', metadata_provider: 'jikan' }]) {
    assert.equal(await plugin.syncTmdbIfNeeded({ path: 'test.md' }, fm, false), false);
  }
  assert.equal(requests.length, 0);
});

test('legacy movie enrichment still fills missing fields and preserves curated values', async () => {
  const env = setup(); const fm = { media_type: 'movie', title: 'Movie', poster: 'my-cover', genres: ['Drama'], directors: ['Me'] };
  const file = env.note('Movie', fm);
  await env.plugin.applyTmdbMetadata(file, { poster: 'other', industry: 'Hollywood', genres: ['Action'], year: '1999', directors: ['Other'], cast: ['Actor'] }, 'movie', false);
  assert.equal(fm.poster, 'my-cover'); assert.equal(fm.year, '1999'); assert.deepEqual(plain(fm.genres), ['Drama']);
  assert.deepEqual(plain(fm.directors), ['Me']); assert.deepEqual(plain(fm.cast), ['Actor']);
});

test('movie and TV details include credits and correct progress totals', async () => {
  const e = setup(); e.plugin.settings.tmdbBearerToken='test';
  e.network(() => ({status:200,json:{id:1,name:'Show',number_of_seasons:3,number_of_episodes:24,credits:{cast:[{name:'Actor'}],crew:[{job:'Director',name:'Director'}]},overview:'Plot'}}));
  const detail = await e.plugin.libraryDetails({media_type:'series',metadata_provider:'tmdb',metadata_id:'1'});
  assert.equal(detail.season_total,3); assert.equal(detail.episode_total,24);
  assert.equal(detail.cast[0],'Actor'); assert.equal(detail.directors[0],'Director');
  const movieFields=e.plugin.libraryFields({media_type:'movie'});
  assert.ok(!movieFields.some(f=>f.key==='hours_played'));
});

test('manual template supports all six types with valid type-specific fields', async () => {
  const template = fs.readFileSync(path.join(vaultRoot, 'Macha/motionArts/Templates/Media Item.md'), 'utf8').replace(/^<%\*\s*/, '').replace(/%>\s*$/, '');
  for (const kind of ['movie','series','anime','anime-movie','manga','game']) {
    const context = { tR:'', tp:{system:{suggester:async(labels,types)=>{assert.ok(types.includes(kind));return kind;},prompt:async()=> 'Example'},file:{title:'Untitled',path:()=> 'Macha/motionArts/Items/Untitled.md',exists:async()=>false,move:async()=>{}}}};
    await vm.runInNewContext(`(async()=>{${template}})()`,context);
    assert.ok(context.tR.includes(`media_type: "${kind}"`));
    assert.ok(!context.tR.includes('undefined'));
  }
});

test('manual duplicates reuse the existing note while different titles remain distinct', async () => {
  const e=setup();const original=e.note('Manga',{media_type:'manga',title:'Dune'});
  assert.equal(await e.plugin.createLibraryItem({media_type:'manga',title:'Dune'}),original);
  const created=await e.plugin.createLibraryItem({media_type:'manga',title:'Another Manga'});
  assert.notEqual(created,original);
  await assert.rejects(e.plugin.createLibraryItem({media_type:'manga'}),/Title/);
});

test('validation rejects broken covers and invalid progress, allows unknown totals', () => {
  const p=setup().plugin;
  for(const poster of ['https://','javascript:alert(1)','[[]]','[[broken']) assert.throws(()=>p.validateLibrary({status:'planned',poster}));
  for(const poster of ['https://example.com/cover.jpg','[[attachments/cover.jpg]]','']) p.validateLibrary({status:'planned',poster});
  for(const value of [-1,Infinity,NaN,1.5]) assert.throws(()=>p.validateLibrary({status:'active',episode_current:value}));
  p.validateLibrary({status:'active',chapter_current:10.5,chapter_total:0});
  assert.throws(()=>p.validateLibrary({status:'planned',rating:6}));
});

test('unsupported and blank searches never reach providers', async () => {
  const p=setup().plugin;
  assert.equal((await p.searchLibrary('manga','  ')).length,0);
  await assert.rejects(p.searchLibrary('unknown','Title'),/Unsupported/);
});

test('cancelling creation releases the guard so another creation can start', async () => {
  const e=setup();const first=e.plugin.addLibraryItem();
  await e.plugin.addLibraryItem();assert.equal(e.modals.length,1);
  e.modals[0].close();await first;assert.equal(e.plugin.addingLibraryItem,false);
  const second=e.plugin.addLibraryItem();assert.equal(e.modals.length,2);
  e.modals[1].close();await second;
});

test('compact metadata keeps meaningful tracking and omits descriptive/default clutter', () => {
 const p=setup().plugin;
 const movie=p.compactLibraryMetadata({media_type:'movie',title:'Film',status:'planned',cast:['A','B','C','D'],description:'Plot',runtime:120,rating:0,favorite:false});
 assert.equal(movie.watched,false);assert.equal(movie.watched_date,null);assert.equal(movie.cast.length,3);
 for(const key of ['description','runtime','rating','status']) assert.ok(!(key in movie));
 const manga=p.compactLibraryMetadata({media_type:'manga',title:'Manga',metadata_provider:'anilist',metadata_id:'1',status:'active',chapter_current:12,rating:4,favorite:true,started_date:'2026-01-01'});
 assert.equal(manga.chapter_current,12);assert.equal(manga.rating,4);assert.equal(manga.metadata_id,'1');assert.equal(manga.started_date,'2026-01-01');
});

test('chapter checks cover new ongoing manga, deduplicate daily and preserve progress on failure', async () => {
 const e=setup();e.plugin.saveSettings=async()=>{};
 const one=e.note('One Piece',{title:'One Piece',media_type:'manga',chapter_current:90,chapter_released:100});
 const other=e.note('New Manga',{title:'New Manga',media_type:'manga',chapter_current:5});
 e.note('Finished',{title:'Finished',media_type:'manga',chapter_total:700});
 e.network(r=>({status:200,text:r.url.includes('one-piece')?'<a href="/shonenjump/one-piece-chapter-101/chapter/123">Read</a>':'blocked'}));
 const result=await e.plugin.checkReleasedChapters();
 assert.equal(result.updated,1);assert.equal(result.unavailable,1);
 assert.equal(e.records.get(one.path).chapter_released,101);assert.equal(e.records.get(one.path).chapter_current,90);
 assert.equal(e.records.get(other.path).chapter_released,undefined);
 const n=e.requests.length;await e.plugin.checkReleasedChapters();assert.equal(e.requests.length,n);
 e.network(()=>({status:200,text:'<a href="/shonenjump/one-piece-chapter-99/chapter/123">Old</a>'}));
 await e.plugin.checkReleasedChapters(true);assert.equal(e.records.get(one.path).chapter_released,101);
});

test('unified refresh checks current manga releases even if metadata fails', async () => {
 const e=setup();const file=e.note('One Piece',{media_type:'manga',title:'One Piece',metadata_provider:'anilist',metadata_id:'30013'});
 e.plugin.libraryDetails=async()=>{throw new Error('offline');};
 let target;
 e.plugin.checkReleasedChapters=async(force,f)=>{assert.equal(force,true);target=f;return {updated:1,unavailable:0};};
 await e.plugin.refreshLibraryMetadata(file);
 assert.equal(target,file);assert.equal(e.plugin.mediaRefreshBusy,false);
 assert.ok(e.notices[0].includes('Metadata unavailable'));assert.ok(e.notices[0].includes('Released chapters checked'));
});

test('MangaUpdates chapter lookup matches title and year and rejects ambiguous results', async () => {
 const e=setup();
 e.network(r=>r.url.endsWith('/search')?{status:200,json:{results:[{record:{series_id:123,title:'Berserk',year:'1989'}},{record:{series_id:456,title:'Berserk',year:'2023'}}]}}:{status:200,json:{title:'Berserk',year:'1989',latest_chapter:386,url:'https://www.mangaupdates.com/series/example'}});
 const result=await e.plugin.mangaUpdatesChapters({title:'Berserk',year:1989});
 assert.equal(result.released,386);assert.equal(result.providerId,'123');
 await assert.rejects(e.plugin.mangaUpdatesChapters({title:'Berserk'}),/unambiguous/);
 assert.deepEqual(plain(e.plugin.libraryFields({media_type:'manga',title:'Berserk'},true).map(f=>f.key)),['title']);
});

test('community chapter counts below published volume counts are rejected', async () => {
 const e=setup();e.network(()=>({status:200,json:{title:'Vagabond',latest_chapter:2,status:'37 Volumes (Hiatus)'}}));
 await assert.rejects(e.plugin.mangaUpdatesChapters({title:'Vagabond',chapter_provider_id:'123'}),/inconsistent/);
});

test('alternate titles must be confirmed by the provider before linking chapters', async () => {
 const e=setup();e.network(r=>r.url.endsWith('/search')?{status:200,json:{results:[{record:{title:'Grand Blue',year:'2014',series_id:42}}]}}:{status:200,json:{title:'Grand Blue',year:'2014',associated:[{title:'Grand Blue Dreaming'}],latest_chapter:84,status:'20 Volumes'}});
 const result=await e.plugin.mangaUpdatesChapters({title:'Grand Blue Dreaming',year:2014});assert.equal(result.providerId,'42');
});

test('refresh from a Base offers a media picker and cancellation performs no refresh', async () => {
 const e=setup();e.note('Naruto',{title:'Naruto',media_type:'manga'});e.plugin.app.workspace.getActiveFile=()=>null;
 let called=false;e.plugin.refreshLibraryMetadata=async()=>{called=true;};
 const task=e.plugin.selectMediaToRefresh();assert.equal(e.modals.length,1);e.modals[0].close();await task;assert.equal(called,false);
});

// Public publisher metadata captured 2026-10-24, reduced to fields used by the checker.
const kodanshaFixtures = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/kodansha-chapters.json'), 'utf8'));
function nuxtHtml(object) {
  const table = [];
  const encode = value => {
    const index = table.length; table.push(null);
    table[index] = Array.isArray(value) ? value.map(encode) : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encode(item)])) : value;
    return index;
  };
  encode(object);
  return `<script type="application/json" id="__NUXT_DATA__">${JSON.stringify(table)}</script>`;
}
function publisherNetwork(env, fixture) {
  env.network(request => ({status:200, text:nuxtHtml(request.url.includes('/episode/')
    ? fixture.episode : {...fixture.title, episode_id_list:fixture.episode_ids})}));
}
test('publisher fixtures resolve numbered chapters rather than episode counts, including paid split chapters', async () => {
  for (const [index, expected] of [69,365,112].entries()) {
    const e=setup(), fixture=kodanshaFixtures[index]; publisherNetwork(e,fixture);
    const result=await e.plugin.releasedChapters({title:fixture.title.title_name});
    assert.equal(result.released,expected); assert.equal(result.kind,'official');
    assert.equal(result.source,`https://kmanga.kodansha.com/title/${fixture.title.title_id}`);
  }
});
test('publisher refresh upgrades stale community counts and preserves reading progress', async () => {
  const e=setup();publisherNetwork(e,kodanshaFixtures[0]);
  const fm={media_type:'manga',title:'Wistoria: Wand and Sword',year:2020,chapter_current:12.5,chapter_released:33,chapter_provider_id:'32295189380'};
  const file=e.note('Wistoria',fm);const result=await e.plugin.checkReleasedChapters(true,file);
  assert.equal(result.updated,1);assert.equal(fm.chapter_released,69);assert.equal(fm.chapter_current,12.5);
  assert.equal(fm.chapter_provider_id,undefined);assert.equal(fm.chapter_count_kind,'official');
  assert.equal(e.requests.some(r=>r.url.includes('mangaupdates')),false);
});
test('wrong title, future chapters, malformed data and publisher failures retain verified data', async () => {
  for (const mode of ['wrong title','future','malformed','unavailable']) {
    const e=setup(),fixture=plain(kodanshaFixtures[0]);
    if(mode==='wrong title')fixture.title.title_name='Another Manga';
    if(mode==='future')fixture.episode.start_time='2099-01-01 10:00:00';
    publisherNetwork(e,fixture);
    if(mode==='malformed')e.network(()=>({status:200,text:'<html>blocked</html>'}));
    if(mode==='unavailable')e.network(()=>({status:503}));
    const fm={media_type:'manga',title:'Wistoria: Wand and Sword',chapter_released:69,chapter_current:14,chapter_checked:'2026-10-01',chapter_count_kind:'official'};
    const before=plain(fm);const result=await e.plugin.checkReleasedChapters(true,e.note('Wistoria',fm));
    assert.equal(result.unavailable,1);assert.deepEqual(fm,before);
  }
});
test('unnumbered extras are skipped and decimals retain their chapter number', async () => {
  const e=setup(),fixture=plain(kodanshaFixtures[0]);
  e.network(request=>{
    if(!request.url.includes('/episode/'))return {status:200,text:nuxtHtml({...fixture.title,episode_id_list:[368844,368845]})};
    const extra=request.url.endsWith('368845');
    return {status:200,text:nuxtHtml({...fixture.episode,episode_id:extra?368845:368844,episode_name:extra?'Extra Holiday':'Chapter 69.5 Bonus'})};
  });
  assert.equal((await e.plugin.releasedChapters({title:fixture.title.title_name})).released,69.5);
});
test('saved community IDs are revalidated and explicitly labelled', async () => {
  const e=setup();e.network(()=>({status:200,json:{title:'Wrong Manga',year:'2020',latest_chapter:999}}));
  await assert.rejects(e.plugin.mangaUpdatesChapters({title:'Wistoria: Wand and Sword',year:2020,chapter_provider_id:'123'}),/identity/);
  e.network(()=>({status:200,json:{title:'Berserk',year:'1989',latest_chapter:386}}));
  assert.equal((await e.plugin.mangaUpdatesChapters({title:'Berserk',year:1989,chapter_provider_id:'123'})).kind,'community');
});
test('lower results are unavailable rather than marked freshly verified, and official final numbering survives catalog refresh', async () => {
  const e=setup();publisherNetwork(e,kodanshaFixtures[0]);
  const fm={media_type:'manga',title:'Wistoria: Wand and Sword',chapter_released:70,chapter_checked:'2026-10-01'};
  const result=await e.plugin.checkReleasedChapters(true,e.note('Wistoria',fm));
  assert.equal(result.updated,0);assert.equal(result.unavailable,1);assert.equal(fm.chapter_checked,'2026-10-01');
  const bleach={media_type:'manga',title:'Bleach',chapter_total:686,chapter_released:686,chapter_count_kind:'official',chapter_source:'https://www.viz.com/shonenjump/chapters/bleach'};
  await e.plugin.applyLibraryMetadata(e.note('Bleach',bleach),{media_type:'manga',chapter_total:706});
  assert.equal(bleach.chapter_total,686);assert.equal(bleach.chapter_released,686);
});

test('VIZ gets priority over saved community IDs and verified official sources never fall back on failure', async () => {
  const e=setup();e.network(()=>({status:200,text:'<a href="/shonenjump/one-piece-chapter-1196/chapter/51757">Read</a>'}));
  const result=await e.plugin.releasedChapters({title:'One Piece',chapter_provider_id:'123'});
  assert.equal(result.released,1196);assert.equal(result.kind,'official');assert.equal(e.requests.length,1);
  e.network(()=>({status:503}));
  await assert.rejects(e.plugin.releasedChapters({title:'One Piece',chapter_count_kind:'official',chapter_source:'https://www.viz.com/shonenjump/chapters/one-piece'}),/Official source unavailable/);
  assert.equal(e.requests.some(r=>r.url.includes('mangaupdates')),false);
  const compact=e.plugin.compactLibraryMetadata({media_type:'manga',title:'Wistoria',chapter_released:69,chapter_count_kind:'official',chapter_source:'https://kmanga.kodansha.com/title/10016'});
  assert.equal(compact.chapter_count_kind,'official');
});
