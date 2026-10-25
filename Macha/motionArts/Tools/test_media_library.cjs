const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const vaultRoot = path.resolve(__dirname, '../../..');
const source = fs.readFileSync(path.join(vaultRoot, '.obsidian/plugins/mmacha-auto/main.js'), 'utf8');

function setup(options = {}) {
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
    testFormValues: options.formValues, module, console, URL, URLSearchParams, Map, Set, Date, queueMicrotask, window: { setTimeout, clearTimeout },
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
  vm.runInNewContext(`${source}\nmodule.exports.testHooks = { chooseLibrary }; if (testFormValues) libraryForm = async () => testFormValues;`, context);
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

test('AniList anime keeps provider IDs, covers, genres, and known progress totals', async () => {
  const env = setup();
  env.network((request) => {
    const body = JSON.parse(request.body);
    assert.equal(body.variables.type, 'ANIME');
    return { status: 200, json: { data: body.variables.search ? { Page: { media: [
      { id: 2, title: { english: 'Berserk' }, startDate: { year: 1989 }, format: 'ANIME', coverImage: { large: 'https://cover.test/a.jpg' } },
    ] } } : { Media: { id: 2, title: { romaji: 'Berserk' }, description: '<b>A story</b>', episodes: 25, genres: ['Fantasy'], coverImage: { large: 'https://cover.test/a.jpg' } } } } };
  });
  const results = await env.plugin.searchLibrary('anime', 'Berserk');
  assert.equal(results[0].metadata_provider, 'anilist');
  const details = await env.plugin.libraryDetails(results[0]);
  assert.equal(details.episode_total, 25);
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
  const fm = { media_type: 'anime', title: 'My title', poster: '[[my-cover.jpg]]', episode_current: 50, episode_total: 100, rating: 5, description: 'My description', genres: ['My genre'] };
  const file = env.note('My anime', fm);
  await env.plugin.applyLibraryMetadata(file, { media_type: 'anime', title: 'Provider title', poster: 'https://new.jpg', episode_total: 0, genres: ['Other'], authors: ['Author'] });
  assert.equal(fm.episode_total, 100); assert.equal(fm.poster, '[[my-cover.jpg]]'); assert.equal(fm.title, 'My title');
  assert.equal(fm.episode_current, 50); assert.equal(fm.rating, 5); assert.equal(fm.description, 'My description');
  await env.plugin.applyLibraryMetadata(file, { media_type: 'anime', episode_total: 40 });
  assert.equal(fm.episode_total, 100);
  await env.plugin.applyLibraryMetadata(file, { media_type: 'anime', episode_total: 110 });
  assert.equal(fm.episode_total, 110);
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
  assert.throws(() => plugin.validateLibrary({ status: 'active', episode_current: 12, episode_total: 10 }));
  assert.throws(() => plugin.validateLibrary({ status: 'active', rating: 6 }));
  assert.throws(() => plugin.validateLibrary({ status: 'active', hours_played: NaN }));
  plugin.validateLibrary({ status: 'active', episode_current: 12, episode_total: 0 });
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

test('manual template supports all five types with valid type-specific fields', async () => {
  const template = fs.readFileSync(path.join(vaultRoot, 'Macha/motionArts/Templates/Media Item.md'), 'utf8').replace(/^<%\*\s*/, '').replace(/%>\s*$/, '');
  for (const kind of ['movie','series','anime','anime-movie','game']) {
    const context = { tR:'', tp:{system:{suggester:async(labels,types)=>{assert.ok(types.includes(kind));return kind;},prompt:async()=> 'Example'},file:{title:'Untitled',path:()=> 'Macha/motionArts/Items/Untitled.md',exists:async()=>false,move:async()=>{}}}};
    await vm.runInNewContext(`(async()=>{${template}})()`,context);
    assert.ok(context.tR.includes(`media_type: "${kind}"`));
    assert.ok(!context.tR.includes('undefined'));
  }
});

test('manual duplicates reuse the existing note while different titles remain distinct', async () => {
  const e=setup();const original=e.note('Anime',{media_type:'anime',title:'Dune'});
  assert.equal(await e.plugin.createLibraryItem({media_type:'anime',title:'Dune'}),original);
  const created=await e.plugin.createLibraryItem({media_type:'anime',title:'Another Anime'});
  assert.notEqual(created,original);
  await assert.rejects(e.plugin.createLibraryItem({media_type:'anime'}),/Title/);
});

test('validation rejects broken covers and invalid progress, allows unknown totals', () => {
  const p=setup().plugin;
  for(const poster of ['https://','javascript:alert(1)','[[]]','[[broken']) assert.throws(()=>p.validateLibrary({status:'planned',poster}));
  for(const poster of ['https://example.com/cover.jpg','[[attachments/cover.jpg]]','']) p.validateLibrary({status:'planned',poster});
  for(const value of [-1,Infinity,NaN,1.5]) assert.throws(()=>p.validateLibrary({status:'active',episode_current:value}));
  p.validateLibrary({status:'active',episode_current:10,episode_total:0});
  assert.throws(()=>p.validateLibrary({status:'planned',rating:6}));
});

test('unsupported and blank searches never reach providers', async () => {
  const p=setup().plugin;
  assert.equal((await p.searchLibrary('anime','  ')).length,0);
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
 const anime=p.compactLibraryMetadata({media_type:'anime',title:'Anime',metadata_provider:'anilist',metadata_id:'1',status:'active',episode_current:12,rating:4,favorite:true,started_date:'2026-01-01'});
 assert.equal(anime.episode_current,12);assert.equal(anime.rating,4);assert.equal(anime.metadata_id,'1');assert.equal(anime.started_date,'2026-01-01');
});

test('refresh from a Base offers a media picker and cancellation performs no refresh', async () => {
 const e=setup();e.note('Naruto',{title:'Naruto',media_type:'anime'});e.plugin.app.workspace.getActiveFile=()=>null;
 let called=false;e.plugin.refreshLibraryMetadata=async()=>{called=true;};
 const task=e.plugin.selectMediaToRefresh();assert.equal(e.modals.length,1);e.modals[0].close();await task;assert.equal(called,false);
});

test('manga cannot be searched, created or refreshed and has no chapter scheduler', async () => {
  const e = setup();
  await assert.rejects(e.plugin.searchLibrary('manga', 'Berserk'), /Unsupported/);
  await assert.rejects(e.plugin.libraryDetails({media_type: 'manga', metadata_provider: 'anilist', metadata_id: '2'}), /Unsupported/);
  await assert.rejects(e.plugin.createLibraryItem({media_type: 'manga', title: 'Berserk'}), /Unsupported/);
  const note = e.note('Berserk', {media_type: 'manga', title: 'Berserk', metadata_provider: 'anilist', metadata_id: '2'});
  await e.plugin.refreshLibraryMetadata(note);
  assert.equal(e.requests.length, 0);
  assert.equal(e.plugin.checkReleasedChapters, undefined);
  assert.ok(!source.includes('registerInterval('));
});

test('editing library progress preserves custom properties and existing catalog data', async () => {
  const e = setup({formValues: {status: 'active', episode_current: 3, episode_total: 12, rating: 4, favorite: true}});
  const fm = {media_type: 'anime', title: 'Example', poster: '[[cover.jpg]]', custom_property: 'Keep me', studios: ['Studio'], description: 'My description', episode_current: 1, episode_total: 12};
  const file = e.note('Example', fm);
  e.records.delete(file.path); file.path = 'Macha/motionArts/Library/Example.md'; e.records.set(file.path, fm);
  await e.plugin.editLibraryProgress(file);
  assert.equal(fm.episode_current, 3); assert.equal(fm.status, 'active');
  assert.equal(fm.custom_property, 'Keep me'); assert.equal(fm.description, 'My description');
  assert.deepEqual(fm.studios, ['Studio']); assert.equal(fm.poster, '[[cover.jpg]]');
});
