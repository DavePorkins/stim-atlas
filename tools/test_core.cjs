/* Meaningful regressions for multi-select logic, stable ordering and v8/v9 data migration. */
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const C = require('../assets/core.js');
const data = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/catalog.json'),'utf8'));
const defaults = () => ({type:'all',query:'',senses:new Set(),materials:new Set(),family:'',sort:'discover',favorites:false,quiet:false,free:false});
let passed = 0;
function test(name,fn) { fn(); console.log('PASS '+name); passed++; }
test('Retains every v9 ID exactly once',()=>{const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/v9-catalog.json'),'utf8'));assert.equal(data.items.length,620);assert.equal(new Set(data.items.map(i=>i.id)).size,620);assert(source.items.every(i=>data.items.some(x=>x.id===i.id)));assert(data.items.some(i=>i.id==='product-needoh-happy-snappy'));});
test('OR within senses, OR within materials, AND between dimensions',()=>{let s=defaults();s.senses=new Set(['auditory','olfactory']);s.materials=new Set(['holz','metall']);let actual=C.filterItems(data.items,s).map(i=>i.id).sort();let expected=data.items.filter(i=>(i.senses.includes('auditory')||i.senses.includes('olfactory'))&&(i.materials.includes('holz')||i.materials.includes('metall'))).map(i=>i.id).sort();assert.deepEqual(actual,expected);assert(actual.length>6);});
test('UI regression: hearing OR smell AND wood retains its six matching references',()=>{let s=defaults();s.senses=new Set(['auditory','olfactory']);s.materials=new Set(['holz']);const ids=["v8-29", "v8-63", "R01-060", "R01-065", "R01-088", "R01-093"];const found=C.filterItems(data.items,s).map(i=>i.id);assert(ids.every(id=>found.includes(id)));});
test('All material labels and sense IDs resolve',()=>{for(const i of data.items){assert(i.senses.length);assert(i.materials.length);for(const x of i.senses)assert(data.senses[x]);for(const x of i.materials)assert(data.materials[x]);}});
test('Kunststoff does not accidentally become Textil',()=>{assert.deepEqual(data.items.find(i=>i.id==='v8-1').materials,['kunststoff']);assert.deepEqual(data.items.find(i=>i.id==='v8-2').materials,['gummi','kunststoff']);});
test('Typ completely partitions all records',()=>{let a=defaults(),b=defaults();a.type='object';b.type='activity';const x=C.filterItems(data.items,a),y=C.filterItems(data.items,b);assert.equal(x.length,491);assert.equal(y.length,129);assert.equal(x.length+y.length,data.total);});
test('Research is never silently labelled as a verified retail product',()=>{assert.equal(data.items.filter(i=>i.status==='recherche').length,353);assert(data.items.filter(i=>i.free).every(i=>i.kind==='activity'&&i.materials.includes('ohne-material')));});
test('German search supports accents and multiple words',()=>{let s=defaults();s.query='fuhl stein';assert(C.filterItems(data.items,s).length>0);s.query='KORPER';assert(C.filterItems(data.items,s).some(i=>i.title.includes('Körper')));});
test('Sort order stays stable across pagination and reverses A–Z',()=>{let s=defaults();let x=C.filterItems(data.items,s);assert.deepEqual(x.map(i=>i.id),C.filterItems(data.items,s).map(i=>i.id));assert.equal(new Set(x.map(i=>i.rank)).size,620);s.sort='az';let az=C.filterItems(data.items,s);s.sort='za';let za=C.filterItems(data.items,s);assert.equal(az[0].title,za.at(-1).title);});
test('v8 numeric IDs migrate to v9 stable IDs, preserving notes and ratings',()=>{let x=C.mergeProgress({}, {'1':{fav:true,seen:5,rating:2,note:'bleibt'},'v8-6':{fav:true}});assert.equal(x['v8-1'].fav,true);assert.equal(x['v8-1'].note,'bleibt');assert.equal(x['v8-1'].rating,2);let s=defaults();s.favorites=true;assert.equal(C.filterItems(data.items,s,x).length,2);});
test('An explicit v10 removal is not undone by older automatic migration',()=>{const current={'v8-1':{fav:false,seen:3}};let x=C.mergeProgress(current,{'1':{fav:true}},false);assert.equal(x['v8-1'].fav,false);});
test('Import rejects malformed records and prototype keys',()=>{assert.throws(()=>C.mergeProgress({},undefined));assert.throws(()=>C.mergeProgress({},[]));let x=C.mergeProgress({},JSON.parse('{"__proto__":{"fav":true},"1":{"fav":"false","seen":-2,"rating":99}}'));assert.equal(Object.hasOwn(x,'__proto__'),false);assert.equal(x['v8-1'].fav,false);assert.equal(x['v8-1'].seen,0);assert.equal(x['v8-1'].rating,0);});
test('All 620 local illustrations exist; used photo links passed decode checks',()=>{const audit=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/image-audit.json'),'utf8'));for(const i of data.items){assert(fs.existsSync(path.join(__dirname,'..',i.illustration)));for(const u of i.images)assert(audit[u]?.ok);}assert.equal(data.photo_items,513);assert.equal(data.illustrated_items,107);});

test('72 documented manufacturer examples have valid parents and checked image files',()=>{const audit=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/image-audit.json'),'utf8'));const x=data.items.flatMap(i=>i.examples);assert.equal(x.length,72);assert.equal(new Set(x.map(v=>v.id)).size,72);for(const v of x){assert(data.items.some(i=>i.id===v.parent_id));assert(audit[v.image]?.ok);assert(v.source_url.startsWith('https://'));}});
test('Variant gallery is 691 unique tiles, standard view remains 620 entries',()=>{const s=defaults();s.variants=true;const rows=C.galleryViews(C.filterItems(data.items,s),s);assert.equal(rows.length,691);assert.equal(new Set(rows.map(v=>v.key)).size,691);s.variants=false;assert.equal(C.galleryViews(C.filterItems(data.items,s),s).length,620);});
test('Color search returns the actual variant rather than every image of a family',()=>{const s=defaults();s.query='Tangle Cyan';s.variants=true;const filtered=C.filterItems(data.items,s);assert.equal(filtered.length,1);const rows=C.galleryViews(filtered,s);assert.equal(rows.length,1);assert(rows[0].view.label.includes('Cyan'));});
test('Detail photo views retain legacy alternative photos and avoid exact duplicate URLs',()=>{for(const item of data.items){const views=C.photoViews(item);assert.equal(new Set(views.map(v=>v.image)).size,views.length);}assert.equal(C.photoViews(data.items.find(i=>i.id==='v8-1')).length,58);});
test('Research adds ten wearables and eleven scent examples, with explicit image roles',()=>{
  const added=data.items.filter(i=>i.provenance==='research-v11');assert.equal(added.length,21);
  assert.equal(added.filter(i=>i.family==='Stimming-Kleidung').length,10);
  assert.equal(added.filter(i=>i.senses.includes('olfactory')).length,11);
  assert.equal(data.items.find(i=>i.id==='product-stimm-tactile-touch-pendant').image_role,'manufacturer_render');
  assert.equal(data.items.filter(i=>i.image_role==='representative_photo').length,246);
});
test('Brand, YouTube, default variants and legacy favorite storage remain wired',()=>{
  const html=fs.readFileSync(path.join(__dirname,'../index.template.html'),'utf8');
  const js=fs.readFileSync(path.join(__dirname,'../assets/site.js'),'utf8');
  assert(html.includes('<title>STIM ATLAS</title>'));assert(html.includes('id="variants" checked'));
  assert(js.includes('https://www.youtube.com/results?search_query='));assert(js.includes("const KEY = 'stim-studio-v10-progress'"));
});
test('Illustrations use multiple restrained palettes and named touch captions',()=>{
  const colors=new Set(data.items.filter(i=>!i.images.length).map(i=>fs.readFileSync(path.join(__dirname,'..',i.illustration),'utf8').match(/--clay:([^;]+)/)[1]));
  assert(colors.size>=5);const css=fs.readFileSync(path.join(__dirname,'../assets/site.css'),'utf8');assert(css.includes('.tile.is-illustration .tile-caption'));assert(css.includes('pointer-events:none'));
});
test('Random discovery is uniform per entry, excludes current and handles empty selections',()=>{
  const pool=data.items.slice(0,7), current=pool[2].id;
  const selected=Array.from({length:6},(_,n)=>C.randomItem(pool,current,()=>n/6).id);
  assert.equal(new Set(selected).size,6);assert(!selected.includes(current));
  assert.equal(C.randomItem([],null),null);assert.equal(C.randomItem([pool[0]],pool[0].id),null);
  assert.equal(C.randomItem([pool[0]],null,()=>0).id,pool[0].id);
});
test('Detail facet exploration clears conflicting filters without mutating its return state',()=>{
  const original={...defaults(),query:'Tangle',type:'activity',favorites:true,quiet:true,variants:false,senses:new Set(['oral']),materials:new Set(['holz'])};
  const saved=C.cloneState(original), next=C.facetState(original,'materials','metall');
  assert.equal(next.query,'');assert.equal(next.type,'all');assert.equal(next.favorites,false);assert.equal(next.quiet,false);assert.equal(next.variants,false);
  assert.deepEqual([...next.materials],['metall']);assert.equal(next.senses.size,0);
  next.materials.add('glas');assert.deepEqual([...saved.materials],['holz']);assert.deepEqual([...original.materials],['holz']);
  const family=C.facetState(original,'family','Stimming-Kleidung');assert.equal(family.family,'Stimming-Kleidung');assert.equal(family.materials.size,0);
  assert.throws(()=>C.facetState(original,'unknown','x'));
});
test('Discovery keeps photos at the end and concepts near the beginning',()=>{
  const state={...defaults(),variants:true}, rows=C.galleryViews(C.filterItems(data.items,state),state);
  assert(rows.slice(0,72).some(r=>!r.item.images.length));assert(rows.slice(-36).filter(r=>r.item.images.length).length>=12);
  assert.equal(new Set(rows.map(r=>r.key)).size,rows.length);
  let most=0;for(let n=0;n<rows.length-35;n++)most=Math.max(most,rows.slice(n,n+36).filter(r=>/tangle/i.test(r.item.title)).length);
  assert(most<=10,'Tangles should not dominate a full screen of the general gallery: '+most);
});
test('Every previously illustrated entry was reviewed and all new photo choices have provenance',()=>{
  const research=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/research-v11-1.json'),'utf8'));
  assert.equal(research.items.length,27);assert.equal(research.image_overrides.length,49);
  assert.equal(new Set(research.reviews.map(r=>r.id)).size,152);
  for(const item of [...research.items,...research.image_overrides]){assert(item.images.length);assert(item.image_source_url?.startsWith('https://'));assert(item.image_attribution);}
  assert.equal(data.items.find(i=>i.id==='R01-056').title,'Stimmgabel (Klangstab)');
});

test('Gemini proposals resolve exactly once without changing existing identities',()=>{
  const r=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/research-v11-2.json'),'utf8'));
  assert.equal(data.version,'v11.4');assert.equal(r.decisions.length,36);
  assert.equal(new Set(r.decisions.map(d=>d.incoming_id)).size,36);
  for(const [decision,count] of [['new',15],['merge',15],['omit',6]])assert.equal(r.decisions.filter(d=>d.decision===decision).length,count);
  for(const d of r.decisions){assert.equal(data.items.some(i=>i.id===d.incoming_id),d.decision==='new');if(d.decision==='merge')assert(data.items.some(i=>i.id===d.target_id));}
  assert.deepEqual([...data.items.map(i=>i.sequence)].sort((a,b)=>a-b),Array.from({length:data.total},(_,n)=>n));
});
test('All 147 R01 action prompts are complete and retain any appended cautions',()=>{
  const r=data.items.filter(i=>i.id.startsWith('R01-'));assert.equal(r.length,147);
  for(const i of r){assert(i.actions.length>=2&&i.actions.length<=3,i.id);assert(i.action_prompt.startsWith(i.actions.join(' · ')),i.id);assert(!i.actions.some(a=>/^(Sanftes|Wiederholtes|Unter|Kühl,)$/.test(a)));}
});
test('Material review records evidence and leaves uncertain compositions unresolved',()=>{
  const r=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/research-v11-2.json'),'utf8'));
  assert.equal(r.material_reviews.length,68);assert.equal(r.material_reviews.filter(x=>x.decision==='classified').length,58);
  for(const x of r.material_reviews){const i=data.items.find(i=>i.id===x.id);assert(i);assert.equal(i.materials.includes('unbekannt'),x.decision==='unresolved',x.id);}
  assert.deepEqual(data.items.find(i=>i.id==='R02-022').materials,['unbekannt']);assert(data.items.find(i=>i.id==='R02-002').materials.includes('pflanzen'));
  const signets=data.items.find(i=>/ONO.*Signets/i.test(i.title));assert(signets.materials.includes('silikon'));
  for(const i of data.items){for(const a of i.actions)assert(i.search_terms.includes(a),i.id);}
});
test('New object images and new activity illustrations remain distinct and documented',()=>{
  const newer=data.items.filter(i=>i.id.startsWith('R02-'));assert.equal(newer.length,15);
  assert.equal(newer.filter(i=>i.images.length).length,9);assert.equal(newer.filter(i=>!i.images.length).length,6);
  for(const i of newer){if(i.images.length){assert(i.image_source_url.startsWith('https://'));assert(i.image_attribution);assert.notEqual(i.image_role,'illustration');}
  else {assert.equal(i.kind,'activity');const svg=fs.readFileSync(path.join(__dirname,'..',i.illustration),'utf8');assert(svg.includes('<svg'));}}
  const js=fs.readFileSync(path.join(__dirname,'../assets/site.js'),'utf8');assert(js.includes('extraIdeas(item)'));assert(js.includes('escape(item.everyday_alternative)'));assert(js.includes('encodeURIComponent(term)'));
});
test('v11.3 adds 80 curated entries and 34 R01 Commons photo upgrades with complete provenance',()=>{
  const v113=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/research-v11-3.json'),'utf8'));
  assert.equal(v113.items.length,80);assert.equal(v113.image_overrides.length,34);
  const r03=data.items.filter(i=>i.id.startsWith('R03-'));assert.equal(r03.length,80);
  assert.equal(r03.filter(i=>i.images.length).length,67);assert.equal(r03.filter(i=>!i.images.length).length,13);
  for(const i of r03){assert(i.actions.length>=2&&i.actions.length<=3,i.id);assert(i.action_prompt.startsWith(i.actions.join(' · ')),i.id);assert(i.everyday_alternative,i.id);assert(i.explore_terms?.length>=2,i.id);}
  for(const ov of v113.image_overrides){const item=data.items.find(i=>i.id===ov.id);assert(item&&item.images.length===1,ov.id);assert.equal(item.image_role,'representative_photo');}
});
test('v11.4 adds 108 entries across co-regulation, everyday relief and collections, with clean person-free imagery and v8-23 photo',()=>{
  const v114=JSON.parse(fs.readFileSync(path.join(__dirname,'../source_data/research-v11-4.json'),'utf8'));
  assert.equal(v114.items.length,108);assert.equal(v114.image_overrides.length,10);
  const r04=data.items.filter(i=>i.id.startsWith('R04-'));assert.equal(r04.length,108);
  assert.equal(r04.filter(i=>i.family==='Ko-Regulation & Miteinander').length,32);
  assert.equal(r04.filter(i=>i.family==='Alltags-Erleichterung & Reizschutz').length,18);
  assert.equal(r04.filter(i=>i.family==='Sammeln, Sortieren & Ordnung').length,12);
  for(const i of r04){assert(i.actions.length>=2&&i.actions.length<=3,i.id);assert(i.action_prompt.startsWith(i.actions.join(' · ')),i.id);assert(i.everyday_alternative,i.id);assert(i.explore_terms?.length>=2,i.id);}
  assert.equal(data.items.find(i=>i.id==='v8-23').images.length,1);
  assert.equal(data.items.find(i=>i.id==='R01-095').images.length,1);
  assert.equal(data.items.find(i=>i.id==='R01-088').title,'Duftende Zedernholz-Hölzer & -Kugeln (Schrank- & Handschmeichler-Holz)');
  assert(data.items.find(i=>i.id==='R03-018').images[0].includes('Soap_bubble_reflection'));
  assert(data.items.find(i=>i.id==='R01-045').images[0].includes('Throw_Pillow'));
  assert(data.items.find(i=>i.id==='R03-066').images[0].includes('Flowingtap'));
  assert(data.items.find(i=>i.id==='R02-014').images[0].includes('Hundepfeife'));
  assert(data.items.find(i=>i.id==='R01-054').images[0].includes('Kneipp_Barfu'));
  assert(data.items.find(i=>i.id==='R03-065').images[0].includes('Nice_Cup_of_Tea'));
  assert(data.items.find(i=>i.id==='product-funfunction-mesh-swing').images[0].includes('SVhammocks'));
});
console.log(`${passed} checks passed.`);
