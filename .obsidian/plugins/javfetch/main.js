const {Plugin,ItemView,Modal,Setting,Notice,requestUrl,TFile,MarkdownRenderChild}=require('obsidian');
const ROOT='Macha/JAV', ENTRIES=ROOT+'/Items', VIEW='javfetch';
const NAMES={1103090:'Mika Azuma',1111141:'Hibine Haru',1101003:'Naho Sumi',1104166:'Tsukasa Hibiki',22574:'Meguri'};
function normalize(value){const s=String(value).trim().toUpperCase().replace(/\s+/g,'');const m=s.match(/^([A-Z]{2,12})-?(\d{2,7})$/);if(!m)throw Error('Enter a code such as JUL-211.');return m[1]+'-'+m[2];}
function candidates(code){const [series,n]=normalize(code).toLowerCase().split('-');const prefix=({milk:'h_1240',dldss:'1',start:'1'})[series]||'';return [...new Set([prefix+series+n.padStart(5,'0'),prefix+series+n])];}
function matches(d,code,cid){return d.content_id===cid&&(!d.dvd_id||normalize(d.dvd_id)===normalize(code));}
class Lookup extends Modal{
 constructor(plugin){super(plugin.app);this.plugin=plugin;}
 onOpen(){this.titleEl.setText('Add to JAVFetch');let value='';new Setting(this.contentEl).setName('Code').addText(t=>t.setPlaceholder('JUL-211').onChange(v=>value=v));const result=this.contentEl.createDiv();new Setting(this.contentEl).addButton(b=>b.setButtonText('Look up').setCta().onClick(async()=>{b.setDisabled(true);result.empty();try{const code=normalize(value);const existing=this.app.vault.getAbstractFileByPath(ENTRIES+'/'+code+'.md');if(existing){await this.app.workspace.getLeaf(false).openFile(existing);this.close();return;}const d=await this.plugin.lookup(code);result.createEl('h3',{text:code});result.createEl('p',{text:d.leads.join(' / ')||'Lead names unavailable'});let names=d.leads.join(' / ');new Setting(result).setName('Female leads').setDesc('Edit names if needed; separate multiple names with /.').addText(t=>t.setValue(names).onChange(v=>names=v));result.createEl('p',{text:[d.date,d.studio].filter(Boolean).join(' · ')});new Setting(result).addButton(save=>save.setButtonText('Add to catalog').setCta().onClick(async()=>{save.setDisabled(true);try{await this.plugin.save(code,d,names.split('/').map(s=>s.trim()).filter(Boolean));this.close();await this.plugin.open();}catch(e){new Notice(e.message);save.setDisabled(false);}}));}catch(e){result.createEl('p',{text:e.message});}finally{b.setDisabled(false);}}));}
 onClose(){this.contentEl.empty();}
}
class ShelfView extends ItemView{
 constructor(leaf,plugin){super(leaf);this.plugin=plugin;this.query='';this.filter='All';this.group=false;}
 getViewType(){return VIEW;}getDisplayText(){return 'JAVFetch';}getIcon(){return 'library';}
 async onOpen(){this.registerEvent(this.app.metadataCache.on('changed',file=>{if(file.path.startsWith(ENTRIES+'/'))this.render();}));this.registerEvent(this.app.vault.on('delete',file=>{if(file.path.startsWith(ENTRIES+'/'))this.render();}));this.render();}
 render(){const el=this.contentEl;el.empty();el.addClass('javfetch');const all=this.plugin.entries();const head=el.createDiv({cls:'ps-head'});head.createEl('h1',{text:'JAVFetch'});head.createEl('p',{text:all.length+' entries · '+new Set(all.flatMap(x=>x.leads)).size+' female leads'});const actions=head.createDiv({cls:'ps-actions'});const add=actions.createEl('button',{text:'+ Add code',cls:'mod-cta'});add.onclick=()=>new Lookup(this.plugin).open();const table=actions.createEl('button',{text:'Open table'});table.onclick=async()=>{const f=this.app.vault.getAbstractFileByPath(ROOT+'/Catalog.base');if(f)await this.app.workspace.getLeaf(false).openFile(f);};const group=actions.createEl('button',{text:this.group?'Show all together':'Group by female lead'});group.onclick=()=>{this.group=!this.group;this.render();};const toolbar=el.createDiv({cls:'ps-actions'});const input=toolbar.createEl('input',{type:'search',placeholder:'Search code or female lead…'});input.value=this.query;const select=toolbar.createEl('select');for(const s of ['All','Planned','Watched','Favorites'])select.createEl('option',{value:s,text:s});select.value=this.filter;const list=el.createDiv();const draw=()=>{list.empty();const q=this.query.toLowerCase();const rows=all.filter(x=>(x.code+' '+x.leads.join(' ')).toLowerCase().includes(q)).filter(x=>this.filter==='All'||(this.filter==='Favorites'?x.favorite:x.status.toLowerCase()===this.filter.toLowerCase()));if(!rows.length){list.createEl('p',{text:'No entries match. Add a code or clear the filters.'});return;}const groups=new Map();for(const x of rows){const key=this.group?(x.leads.join(' / ')||'Unassigned'):'';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(x);}for(const [label,items] of [...groups].sort((a,b)=>a[0].localeCompare(b[0]))){if(label)list.createEl('h2',{text:label});const grid=list.createDiv({cls:'ps-grid'});for(const x of items){const card=grid.createDiv({cls:'ps-card'});const link=card.createEl('a',{text:x.code,cls:'ps-code',href:'#'});link.onclick=e=>{e.preventDefault();this.app.workspace.getLeaf(false).openFile(x.file);};card.createEl('p',{text:x.leads.join(' / ')||'Unassigned',cls:'ps-leads'});card.createEl('p',{text:[x.date,x.studio].filter(Boolean).join(' · '),cls:'ps-meta'});const controls=card.createDiv({cls:'ps-actions'});const fav=controls.createEl('button',{text:x.favorite?'★ Favorite':'☆ Favorite'});fav.onclick=()=>this.plugin.edit(x.file,f=>f.favorite=!x.favorite);const status=controls.createEl('select');for(const s of ['Planned','Watched'])status.createEl('option',{text:s,value:s});status.value=x.status;status.onchange=()=>this.plugin.edit(x.file,f=>f.status=status.value);card.createEl('small',{text:x.lookup||'Manual entry',cls:'ps-meta'});}}};input.oninput=()=>{this.query=input.value;draw();};select.onchange=()=>{this.filter=select.value;draw();};draw();}
}
module.exports=class JAVFetchPlugin extends Plugin{
 async onload(){this.registerView(VIEW,l=>new ShelfView(l,this));
this.registerMarkdownCodeBlockProcessor('javfetch', (source, el, ctx) => {
 const plugin=this;
 class Browse extends MarkdownRenderChild {
  onload(){
   const view={contentEl:this.containerEl,plugin,app:plugin.app,query:'',filter:'All',group:false};
   view.render=()=>ShelfView.prototype.render.call(view);
   this.registerEvent(plugin.app.metadataCache.on('changed',f=>{if(f.path.startsWith(ENTRIES+'/'))view.render();}));
   this.registerEvent(plugin.app.vault.on('delete',f=>{if(f.path.startsWith(ENTRIES+'/'))view.render();}));
   view.render();
  }
 }
 ctx.addChild(new Browse(el));
});this.addRibbonIcon('library','Open JAVFetch',()=>this.open());this.addCommand({id:'open',name:'Open catalog',callback:()=>this.open()});this.addCommand({id:'add',name:'Add code',callback:()=>new Lookup(this).open()});this.addCommand({id:'refresh',name:'Refresh current entry metadata',checkCallback:checking=>{const f=this.app.workspace.getActiveFile();if(!f||!f.path.startsWith(ENTRIES+'/'))return false;if(!checking)this.refresh(f);return true;}});this.cache=new Map();}
 async open(){const file=this.app.vault.getAbstractFileByPath(ROOT+'/Browse.md');if(file){const leaf=this.app.workspace.getLeaf(false);await leaf.openFile(file);await leaf.setViewState({type:'markdown',state:{file:file.path,mode:'preview'}});}}
 entries(){return this.app.vault.getMarkdownFiles().filter(f=>f.path.startsWith(ENTRIES+'/')).map(file=>{const f=this.app.metadataCache.getFileCache(file)?.frontmatter||{};return {file,code:f.code||file.basename,leads:Array.isArray(f.female_leads)?f.female_leads:[],status:f.status||'Planned',favorite:!!f.favorite,date:String(f.release_date||''),studio:f.studio||'',lookup:f.lookup_status||''};}).sort((a,b)=>a.code.localeCompare(b.code,undefined,{numeric:true}));}
 async json(url) {
  let timer;
  try {
   const response = await Promise.race([
    requestUrl({url, throw:false, headers:{Accept:'application/json, text/plain, */*', Referer:'https://r18.dev/'}}),
    new Promise((_, reject) => { timer = setTimeout(() => reject(Error('Lookup timed out. Try again later.')), 15000); })
   ]);
   if (response.status !== 200) throw Error('Metadata provider returned HTTP ' + response.status + '.');
   return response.json;
  } finally {
   clearTimeout(timer);
  }
 }

 async lookup(raw){const code=normalize(raw);if(this.cache.has(code))return this.cache.get(code);let ids=candidates(code),last;try{const d=await this.json('https://r18.dev/videos/vod/movies/detail/-/dvd_id='+code.replace('-','').toLowerCase()+'/json');if(typeof d.content_id==='string'&&/^[a-z0-9_]+$/.test(d.content_id)){const compact=d.content_id.replace(/^h_\d+|^\d+/,'');const m=compact.match(/^([a-z]+)0*(\d+)$/);const [s,n]=code.split('-');if(m&&m[1].toUpperCase()===s&&Number(m[2])===Number(n))ids=[...new Set([...ids,d.content_id])];}}catch(e){last=e;}for(const cid of ids){try{const d=await this.json('https://r18.dev/videos/vod/movies/detail/-/combined='+cid+'/json');if(!matches(d,code,cid))continue;const leads=(d.actresses||[]).map(a=>NAMES[a.id]||a.name_romaji||'').filter(Boolean);if(!leads.length)throw Error('No English female-lead names returned.');const result={cid,leads:[...new Set(leads)],date:d.release_date||'',studio:d.maker_name_en||'',lookup:d.dvd_id?'Code verified':'Content ID matched'};this.cache.set(code,result);return result;}catch(e){last=e;}await new Promise(r=>setTimeout(r,700));}throw last||Error('No matching metadata found.');}
 async folder(path){if(!this.app.vault.getAbstractFileByPath(path)){const parent=path.slice(0,path.lastIndexOf('/'));if(parent)await this.folder(parent);await this.app.vault.createFolder(path);}}
 async save(raw,d,leads){const code=normalize(raw);await this.folder(ENTRIES);const path=ENTRIES+'/'+code+'.md';if(this.app.vault.getAbstractFileByPath(path))return;const f=await this.app.vault.create(path,'## Notes\n\n');await this.edit(f,fm=>{Object.assign(fm,{code,female_leads:leads,status:'Planned',favorite:false,release_date:d.date,studio:d.studio,provider:'r18dev',content_id:d.cid,lookup_status:d.lookup});});}
 async edit(file,fn){await this.app.fileManager.processFrontMatter(file,fn);}
 async refresh(file){try{const code=normalize(file.basename);this.cache.delete(code);const d=await this.lookup(code);await this.edit(file,f=>{f.release_date=d.date||f.release_date;f.studio=d.studio||f.studio;f.content_id=d.cid;f.lookup_status=d.lookup;if(!Array.isArray(f.female_leads)||!f.female_leads.length)f.female_leads=d.leads;});new Notice('Metadata refreshed. Your names, status and notes were preserved.');}catch(e){new Notice(e.message);}}
};
module.exports.testing={normalize,candidates,matches};
