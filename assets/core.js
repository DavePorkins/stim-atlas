/* Pure catalogue and backup operations; also usable by the Node tests. */
(function (root) {
  'use strict';
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('de');
  const canonicalId = id => /^\d+$/.test(String(id)) ? 'v8-' + id : String(id);
  const hash = text => { let h = 2166136261; for (const c of String(text)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const kind = item => ['object', 'equipment'].includes(item.kind) ? 'object' : 'activity';
  function filterItems(items, state, progress = {}) {
    const words = normalize(state.query).trim().split(/\s+/).filter(Boolean);
    return items.filter(item => {
      if (state.type !== 'all' && kind(item) !== state.type) return false;
      if (state.favorites && !progress[item.id]?.fav) return false;
      if (state.senses.size && !item.senses.some(x => state.senses.has(x))) return false;
      if (state.materials.size && !item.materials.some(x => state.materials.has(x))) return false;
      if (state.family && item.family !== state.family) return false;
      if (state.quiet && !item.quiet) return false;
      if (state.free && !item.free) return false;
      const haystack = normalize([item.title, item.description, item.family, item.material_raw, item.search, ...(item.search_terms || []),...(item.examples || []).map(v=>v.label)].join(' '));
      return words.every(word => haystack.includes(word));
    }).sort((a, b) => {
      if (state.sort === 'az') return a.title.localeCompare(b.title, 'de') || a.id.localeCompare(b.id);
      if (state.sort === 'za') return b.title.localeCompare(a.title, 'de') || a.id.localeCompare(b.id);
      if (state.sort === 'new') return (b.sequence - a.sequence) || a.id.localeCompare(b.id);
      return (a.rank - b.rank) || a.id.localeCompare(b.id);
    });
  }
  function mergeProgress(current, incoming, overwrite = true) {
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) throw Error('Keine gültigen Favoritendaten.');
    const result = { ...current };
    for (const [rawId, value] of Object.entries(incoming)) {
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
      const id = canonicalId(rawId);
      if (!/^[\w-]{1,100}$/.test(id) || ['__proto__', 'constructor', 'prototype'].includes(id)) continue;
      if (!overwrite && Object.hasOwn(result, id)) continue;
      result[id] = {
        fav: value.fav === true,
        seen: Math.max(0, Math.min(Number(value.seen) || 0, 1000000)),
        rating: [-1, 0, 1, 2].includes(Number(value.rating)) ? Number(value.rating) : 0,
        note: typeof value.note === 'string' ? value.note.slice(0, 1500) : ''
      };
    }
    return result;
  }

  function photoViews(item) {
    const views = (item.images || []).map((image,index)=>({id:'photo-'+index,image,label:index===0?'Referenzfoto':'Weitere Ansicht '+(index+1),source_url:item.source_url,relation:'reference_photo'}));
    for (const example of item.examples || []) if (!views.some(v=>v.image===example.image)) views.push(example);
    return views;
  }
  function galleryViews(items, state) {
    const rows=[], words=normalize(state.query).trim().split(/\s+/).filter(Boolean);
    for (const item of items) {
      const choices=[null,...(state.variants ? (item.examples || []).filter(v=>v.image!==item.images[0]) : [])];
      choices.forEach((view,index)=>{
        if (state.variants && words.length) {
          const haystack=normalize([item.title,item.description,item.family,item.material_raw,item.search,...(item.search_terms||[]),view?.label||''].join(' '));
          if (!words.every(word=>haystack.includes(word))) return;
        }
        rows.push({item,view,key:item.id+'::'+(view?.id||'base'),rank:item.rank+index*7});
      });
    }
    if(state.sort==='discover') {
      // Spread named variants across the complete selection instead of a photo-only tail.
      const bases=rows.filter(r=>!r.view), grouped=new Map();
      for(const row of rows.filter(r=>r.view)) {
        if(!grouped.has(row.item.id))grouped.set(row.item.id,[]);
        grouped.get(row.item.id).push(row);
      }
      const variants=[];
      while([...grouped.values()].some(q=>q.length))for(const q of grouped.values())if(q.length)variants.push(q.shift());
      if(!bases.length)return variants;
      const mixed=[],totalVariants=variants.length;let taken=0;
      const take=()=>{
        const recent=new Set(mixed.slice(-7).map(r=>r.item.id));
        let index=variants.findIndex(r=>!recent.has(r.item.id));if(index<0)index=0;
        mixed.push(variants.splice(index,1)[0]);taken++;
      };
      bases.forEach((row,index)=>{mixed.push(row);const target=Math.floor((index+1)*totalVariants/(bases.length+1));while(taken<target)take();});
      while(variants.length)take();
      return mixed;
    }
    return rows;
  }
  const cloneState = state => ({...state,senses:new Set(state.senses),materials:new Set(state.materials)});
  function facetState(state, dimension, value) {
    if(!['senses','materials','family'].includes(dimension))throw Error('Unbekannte Filterdimension.');
    const next={variants:state.variants,type:'all',query:'',senses:new Set(),materials:new Set(),family:'',sort:'discover',favorites:false,quiet:false,free:false};
    if(dimension==='family')next.family=value;else next[dimension].add(value);
    return next;
  }
  function randomItem(items, currentId, random=Math.random) {
    // Pick catalogue objects, never colour tiles: every entry has one chance.
    const pool=items.filter(item=>item.id!==currentId);
    return pool.length ? pool[Math.min(pool.length-1,Math.max(0,Math.floor(random()*pool.length)))] : null;
  }
  const api = { cloneState, facetState, randomItem, photoViews, galleryViews, normalize, canonicalId, hash, kind, filterItems, mergeProgress };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.STIMCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
