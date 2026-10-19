'use strict';
(() => {
  const C = STIMCore, data = JSON.parse(document.getElementById('catalog-data').textContent);
  const items = data.items, byId = new Map(items.map(item => [item.id, item]));
  const $ = selector => document.querySelector(selector);
  const KEY = 'stim-studio-v10-progress';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  let storageWarning = false;
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { if (!storageWarning) { storageWarning = true; toast('Speichern nicht verfügbar. Bitte ein Backup exportieren.'); } return false; } }
  const paths = {
    shuffle:'<path d="m16 3 4 4-4 4m0 2 4 4-4 4M4 7h3c5 0 5 10 10 10h3M4 17h3c2 0 3-2 4-5m2-3c1-1 2-2 4-2h3"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    heart:'<path d="M20.2 5.5a5 5 0 0 0-7.1 0L12 6.6l-1.1-1.1a5 5 0 0 0-7.1 7.1L12 21l8.2-8.4a5 5 0 0 0 0-7.1Z"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    moon:'<path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z"/>',
    filter:'<path d="M3 7h18M3 17h18"/><circle cx="8" cy="7" r="2.5" fill="var(--bg)"/><circle cx="16" cy="17" r="2.5" fill="var(--bg)"/>',
    chevron:'<path d="m7 10 5 5 5-5"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',
    left:'<path d="m14 5-7 7 7 7"/>',right:'<path d="m10 5 7 7-7 7"/>',
    up:'<path d="M12 20V4m-7 7 7-7 7 7"/>',external:'<path d="M14 4h6v6M20 4 10 14M10 4H4v16h16v-6"/>',
    archive:'<path d="M4 8h16v12H4zM3 3h18v5H3zM10 12h4"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
    upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 17v4h16v-4"/>'
  };
  const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
  document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  let progress = {};
  for (const key of [KEY, 'stim-studio-v9-progress', 'stim-studio-v6-progress']) {
    try { progress = C.mergeProgress(progress, read(key, {}), false); } catch { /* A malformed older store must not stop the gallery. */ }
  }
  function stateFromURL() {
  const params = new URLSearchParams(location.search);
  return {variants:params.get('variants')!=='0',type:['object','activity'].includes(params.get('type')) ? params.get('type') : 'all',query:params.get('q') || '',senses:new Set((params.get('senses') || '').split(',').filter(x => data.senses[x])),materials:new Set((params.get('materials') || '').split(',').filter(x => data.materials[x])),family:params.get('family') || '',sort:['az','za','new'].includes(params.get('sort')) ? params.get('sort') : 'discover',favorites:params.has('favorites'),quiet:params.has('quiet'),free:params.has('free')};
  }
  const state=stateFromURL(), viewTrail=[];
  let filtered = [], galleryRows = [], rendered = 0, activeId = null, openedHere = false, returnFocus = null, toastTimer;
  let theme = read('stim-studio-v10-theme', read('stim-studio-v9-theme', read('stim-studio-v6-theme', 'dark')));
  if (!['dark','light'].includes(theme)) theme = 'dark';
  function setTheme(value) { theme = value; document.documentElement.dataset.theme = value; $('#theme').innerHTML = icon(value === 'dark' ? 'sun' : 'moon'); $('#theme').setAttribute('aria-label', value === 'dark' ? 'Helle Darstellung' : 'Dunkle Darstellung'); document.querySelector('meta[name="theme-color"]').content = value === 'dark' ? '#151715' : '#f0f1ec'; }
  setTheme(theme);
  function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200); }
  function updateURL() { const p = new URLSearchParams(); if (state.query) p.set('q', state.query); if (state.type !== 'all') p.set('type', state.type); if (state.senses.size) p.set('senses', [...state.senses].join(',')); if (state.materials.size) p.set('materials', [...state.materials].join(',')); if (state.family) p.set('family', state.family); if (state.sort !== 'discover') p.set('sort', state.sort); for (const k of ['favorites','quiet','free']) if (state[k]) p.set(k, '1'); if (!state.variants) p.set('variants','0'); const query = p.toString(); history.replaceState(null, '', location.pathname + (query ? '?' + query : '') + location.hash); }
  function updateControls() {
    document.querySelectorAll('[data-type]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.type === state.type)));
    $('#favorites').setAttribute('aria-pressed', String(state.favorites));
    const n = items.filter(item => progress[item.id]?.fav).length;
    $('#fav-count').textContent = n; $('#fav-count').hidden = !n;
    $('#favorites').setAttribute('aria-label', `${state.favorites ? 'Alle Einträge' : 'Favoriten'} anzeigen${n ? `, ${n} Favoriten` : ''}`);
    const count = state.senses.size + state.materials.size + Number(!!state.family) + Number(state.quiet) + Number(state.free);
    $('#filter-count').textContent = count; $('#filter-count').hidden = !count; $('#filters-toggle').classList.toggle('has-filters', !!count);
    const constrained=!!(state.query||state.type!=='all'||count||state.favorites||!state.variants||state.sort!=='discover');
    $('#view-actions').hidden=!constrained&&!viewTrail.length;
    $('#return-view').hidden=!viewTrail.length;
    const labels=[state.query&&'Suche: '+state.query,state.type==='object'&&'Objekte',state.type==='activity'&&'Aktivitäten',...Array.from(state.senses,s=>data.senses[s]),...Array.from(state.materials,m=>data.materials[m]),state.family,state.favorites&&'Favoriten',state.quiet&&'Leise',state.free&&'Kostenlos',!state.variants&&'Ohne Farbvarianten'].filter(Boolean).join(' · ');
    $('#selection-summary').textContent=labels||'Aktuelle Ansicht';$('#selection-summary').title=labels;
    $('#random').disabled=!filtered.length;
    $('#count').textContent = `${galleryRows.length} ${galleryRows.length===1?'Bild':'Bilder'}`; $('#count').title = `${filtered.length} Einträge${state.favorites?' in Favoriten':''}`;
  }
  function fallback(item) { return typeof STIM_ILLUSTRATIONS !== 'undefined' ? STIM_ILLUSTRATIONS[item.id] : item.illustration; }
  function mediaLabel(item) {
    if (!item.images.length) return 'Illustration';
    return ({representative_photo:'Symbolfoto',manufacturer_render:'Herstellerdarstellung'})[item.image_role] || '';
  }
  function mediaNote(item) {
    const note = !item.images.length ? 'Repräsentative Illustration, kein Produktfoto.'
      : item.image_role === 'representative_photo' ? 'Symbolfoto des Materials oder der Aktivität; kein bestimmtes Kaufprodukt.'
      : item.image_role === 'manufacturer_render' ? 'Herstellerdarstellung; KI-Erzeugung oder Bearbeitung für dieses Bild nicht ausgeschlossen.'
      : 'Externes Referenzfoto · Bildrechte beim jeweiligen Anbieter.';
    return note + (item.image_attribution ? ' ' + item.image_attribution : '');
  }
  function photo(item, holder, lazy = true, choice = null) {
    const img = document.createElement('img'); img.alt = item.title + (choice ? ' · '+choice.label : ''); img.width = 640; img.height = 640; img.decoding = 'async'; img.loading = lazy ? 'lazy' : 'eager'; img.referrerPolicy = 'no-referrer';
    const label = document.createElement('span'); label.className = 'illustration-label'; label.textContent = mediaLabel(item) || 'Illustration'; label.hidden = !mediaLabel(item);
    let attempt = 0;
    const next = () => {
      const src = (choice ? [choice.image] : item.images)[attempt++];
      if (src && /^https:\/\//.test(src)) { img.src = src; return; }
      img.onerror = null; img.src = fallback(item); img.alt = `Illustration: ${item.title}`; holder.classList.add('is-illustration'); holder.closest('.tile')?.classList.add('is-illustration'); label.textContent = 'Illustration'; label.hidden = false;
      const note = holder.closest('.detail-layout')?.querySelector('.source-note');
      if (note) note.textContent = 'Repräsentative Illustration, kein Produktfoto.' + (item.status === 'recherche' ? ' Konzept aus dem Recherchepaket; kein verifiziertes Verkaufsangebot.' : '');
    };
    img.onerror = next;
    holder.append(img, label); next();
  }
  function favButton(item, extra = '') { const saved = !!progress[item.id]?.fav; return `<button class="${extra}" data-fav="${escape(item.id)}" aria-pressed="${saved}" aria-label="${escape(item.title)}: ${saved ? 'Favorit entfernen' : 'Als Favorit merken'}">${icon('heart')}</button>`; }
  function card(row, index) {
    const {item,view}=row;
    const article = document.createElement('article'); article.className = 'tile'; article.dataset.id = item.id; article.dataset.view = view?.id || 'base';
    const open = document.createElement('button'); open.className = 'tile-open'; open.dataset.open = item.id; open.dataset.view = view?.id || ''; open.setAttribute('aria-label', item.title + (view ? ' · '+view.label : '') + ' – Details öffnen');
    photo(item, open, index >= 12, view);
    const caption = document.createElement('span'); caption.className = 'tile-caption'; caption.textContent = item.title + (view ? ' · '+view.label : ''); open.append(caption);
    article.append(open); article.insertAdjacentHTML('beforeend', favButton(item, 'tile-fav'));
    if (!item.images.length) article.classList.add('is-illustration');
    else if (mediaLabel(item)) article.classList.add('is-representative');
    // Photo fallback updates both the button and tile background without changing layout.
    return article;
  }
  let observer;
  function appendBatch() {
    const stop = Math.min(rendered + 36, galleryRows.length), frag = document.createDocumentFragment();
    for (let i = rendered; i < stop; i++) frag.append(card(galleryRows[i], i));
    rendered = stop; $('#gallery').append(frag); $('#end').hidden = rendered < galleryRows.length || !galleryRows.length;
    if (observer) { observer.unobserve($('#sentinel')); if (rendered < galleryRows.length) observer.observe($('#sentinel')); }
  }
  function render(resetScroll = false) {
    filtered = C.filterItems(items, state, progress); galleryRows = C.galleryViews(filtered,state); rendered = 0; $('#gallery').replaceChildren(); $('#empty').hidden = !!galleryRows.length; updateControls(); appendBatch();
    if (resetScroll && window.scrollY > 80) window.scrollTo({top:0,behavior:'instant'});
  }
  if ('IntersectionObserver' in window) observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting) && rendered < galleryRows.length) appendBatch(); }, {rootMargin:'700px 0px'});
  else window.addEventListener('scroll', () => { if ($('#sentinel').getBoundingClientRect().top < innerHeight + 700 && rendered < galleryRows.length) appendBatch(); }, {passive:true});
  function change() { updateURL(); render(true); }
  function syncControls() {
    $('#search').value=state.query;$('#family').value=state.family;$('#sort').value=state.sort;
    for(const key of ['quiet','free','variants'])$('#'+key).checked=state[key];
    document.querySelectorAll('.chip input').forEach(input=>{input.checked=state[input.closest('.chips').id].has(input.value);});
  }
  function reset() {
    Object.assign(state,{type:'all',query:'',family:'',sort:'discover',favorites:false,quiet:false,free:false,variants:true,senses:new Set(),materials:new Set()});
    viewTrail.length=0;syncControls();change();
  }
  function followFacet(dimension,value) {
    if(dimension==='senses'&&!data.senses[value]||dimension==='materials'&&!data.materials[value]||dimension==='family'&&!items.some(i=>i.family===value))return;
    viewTrail.push({state:C.cloneState(state),scroll:scrollY,rendered,focusId:returnFocus?.dataset.open});
    if(viewTrail.length>20)viewTrail.shift();
    finishClose();openedHere=false;history.replaceState(null,'',location.pathname+location.search);
    Object.assign(state,C.facetState(state,dimension,value));syncControls();
    $('#filters').hidden=true;$('#filters-toggle').setAttribute('aria-expanded','false');
    change();$('#return-view').focus({preventScroll:true});
  }
  function returnView() {
    const previous=viewTrail.pop();if(!previous)return;
    Object.assign(state,C.cloneState(previous.state));syncControls();updateURL();render();
    while(rendered<Math.min(previous.rendered,galleryRows.length))appendBatch();
    window.scrollTo({top:previous.scroll,behavior:'instant'});
    const button=[...document.querySelectorAll('.tile-open')].find(b=>b.dataset.open===previous.focusId);
    (button||$('#gallery')).focus({preventScroll:true});
  }
  function randomize() {
    const chosen=C.randomItem(filtered,activeId);if(!chosen)return;
    details(chosen.id,!$('#detail').open);
    $('#random-detail').focus({preventScroll:true});
  }
  function facetButton(dimension,value,label) {
    return `<button class="attribute-filter" data-facet="${dimension}" data-value="${escape(value)}" aria-label="${escape(label)} als Filter anwenden">${escape(label)}</button>`;
  }
  for (const [dimension, labels] of [['senses', data.senses], ['materials', data.materials]]) {
    for (const [value, label] of Object.entries(labels)) {
      const el = document.createElement('label'); el.className = 'chip'; el.innerHTML = `<input type="checkbox" value="${escape(value)}" ${state[dimension].has(value) ? 'checked' : ''}><span class="tick" aria-hidden="true"></span><span>${escape(label)}</span>`;
      el.querySelector('input').addEventListener('change', e => { if (e.target.checked) state[dimension].add(value); else state[dimension].delete(value); change(); });
      $('#' + dimension).append(el);
    }
  }
  [...new Set(items.map(item => item.family))].sort((a,b) => a.localeCompare(b,'de')).forEach(family => { const option = document.createElement('option'); option.value = option.textContent = family; $('#family').append(option); });
  $('#family').value = state.family; if ($('#family').value !== state.family) state.family = '';
  $('#search').value = state.query; $('#sort').value = state.sort; $('#quiet').checked = state.quiet; $('#free').checked = state.free; $('#variants').checked = state.variants;
  if (state.senses.size || state.materials.size || state.family || state.quiet || state.free) { $('#filters').hidden = false; $('#filters-toggle').setAttribute('aria-expanded','true'); }
  function toggleFavorite(id) {
    const value = !progress[id]?.fav; progress[id] = {...progress[id],fav:value}; write(KEY, progress);
    document.querySelectorAll('[data-fav]').forEach(b => { if (b.dataset.fav !== id) return; b.setAttribute('aria-pressed', String(value)); b.setAttribute('aria-label', byId.get(id).title + ': ' + (value ? 'Favorit entfernen' : 'Als Favorit merken')); });
    if (state.favorites) { const old = document.activeElement?.closest('.tile'), position = old ? [...$('#gallery').children].indexOf(old) : -1; const previousRendered = rendered; render(); while (rendered < Math.min(previousRendered, galleryRows.length)) appendBatch(); if (position >= 0) $('#gallery').children[Math.min(position, galleryRows.length - 1)]?.querySelector('.tile-open')?.focus({preventScroll:true}); }
    else updateControls();
    toast(value ? 'Gemerkt' : 'Favorit entfernt');
  }
  const kindLabel = {object:'Objekt',equipment:'Ausstattung',activity:'Aktivität',digital:'Digitale Idee',space:'Raumidee'};
  const safety = {falls_or_dizziness_check:'Balance- und Drehbewegungen langsam und in sicherer Umgebung ausprobieren.',allergy_and_scent_check:'Düfte und Pflanzen können Unverträglichkeiten auslösen. Rücksicht auf gemeinsam genutzte Räume nehmen.',food_or_chew_safety_check:'Geeignete kau- und lebensmittelechte Materialien verwenden; Hygiene und Verschleiß beachten.',avoid_temperature_extremes:'Extreme Temperaturen vermeiden.',pressure_and_fit_check:'Druck und Kompression dürfen nicht wehtun oder die Bewegungsfreiheit einschränken.',small_magnets_check:'Kleine Magnete und Kleinteile von Kindern fernhalten; Verschlucken ist gefährlich.'};

  function setupMedia(item, viewId) {
    const views=C.photoViews(item); let selected=Math.max(0,views.findIndex(v=>v.id===viewId)), reference=null, touchX=null;
    const stage=$('#detail-media'), controls=$('#media-controls'), thumbs=$('#photo-thumbs');
    function imagePanel(view, caption) {
      const box=document.createElement('div');box.className='media-image';photo(item,box,false,view);
      if(caption){const text=document.createElement('span');text.className='compare-label';text.textContent=view?.label||'Illustration';box.append(text);}
      return box;
    }
    function paint() {
      stage.replaceChildren();stage.classList.toggle('comparing',reference!==null);
      if(reference!==null)stage.append(imagePanel(views[reference],true));
      stage.append(imagePanel(views[selected]||null,reference!==null));
      const view=views[selected];
      controls.innerHTML=views.length ? `<span class="view-name" aria-live="polite">${escape(view.label)} <span class="muted">${selected+1}/${views.length}</span></span><button class="iconbutton" id="photo-prev" aria-label="Vorheriges Foto" ${selected===0?'disabled':''}>${icon('left')}</button><button class="iconbutton" id="photo-next" aria-label="Nächstes Foto" ${selected===views.length-1?'disabled':''}>${icon('right')}</button>${views.length>1?`<button class="compare-toggle" id="compare" aria-pressed="${reference!==null}">${reference===null?'Vergleichen':'Einzelbild'}</button>`:''}` : '';
      if(views.length){$('#photo-prev').onclick=()=>choose(selected-1,'photo-prev');$('#photo-next').onclick=()=>choose(selected+1,'photo-next');}
      if($('#compare'))$('#compare').onclick=()=>{if(reference===null){reference=selected;selected=selected===views.length-1?0:selected+1;}else reference=null;paint();$('#compare')?.focus({preventScroll:true});};
      thumbs.querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===selected));b.classList.toggle('reference',i===reference);});
      const link=$('#variant-source');
      if(link)link.href=item.image_source_url || view?.source_url || view?.image || item.source_url;
    }
    function choose(index,control){if(index<0||index>=views.length)return;selected=index;paint();history.replaceState(history.state,'',location.pathname+location.search+'#item='+encodeURIComponent(item.id)+'&view='+encodeURIComponent(views[selected].id));if(control){const b=$('#'+control);(b?.disabled?$('#compare'):b)?.focus({preventScroll:true});}}
    views.forEach((view,index)=>{const button=document.createElement('button');button.className='photo-thumb';button.title=view.label;button.setAttribute('aria-label',view.label);button.setAttribute('aria-pressed',String(index===selected));const img=document.createElement('img');img.src=view.image;img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';button.append(img);button.onclick=()=>choose(index);thumbs.append(button);});
    thumbs.hidden=views.length<2;controls.hidden=views.length<2;
    if(item.image_source_url || views.some(v=>v.source_url)){const link=document.createElement('a');link.id='variant-source';link.target='_blank';link.rel='noopener noreferrer';link.textContent='Bildquelle';$('.detail-links').prepend(link);}
    stage.ontouchstart=e=>{if(e.touches.length===1)touchX=e.touches[0].clientX;};
    stage.ontouchend=e=>{if(touchX===null)return;const dx=e.changedTouches[0].clientX-touchX;touchX=null;if(Math.abs(dx)>55)choose(selected+(dx<0?1:-1));};
    paint();
  }
  function details(id, push = true, viewId = null) {
    const item = byId.get(id); if (!item) return;
    if (!$('#detail').open) returnFocus = document.activeElement;
    const focusedControl = $('#detail').open ? document.activeElement?.id : null;
    activeId = id; progress[id] = {...progress[id],seen:(progress[id]?.seen || 0) + 1}; write(KEY, progress);
    let list = filtered.some(x => x.id === id) ? filtered : items; const pos = list.findIndex(x => x.id === id);
    const material = item.material_raw || 'Ungeklärt';
    $('#detail-content').innerHTML = `<div class="detail-tools"><span class="position">${pos + 1} / ${list.length}</span><button class="iconbutton" id="previous" aria-label="Vorheriger Eintrag" ${pos === 0 ? 'disabled' : ''}>${icon('left')}</button><button class="iconbutton" id="next" aria-label="Nächster Eintrag" ${pos === list.length - 1 ? 'disabled' : ''}>${icon('right')}</button><button id="random-detail" class="iconbutton" data-random aria-label="Zufälligen Eintrag aus der aktuellen Auswahl öffnen" title="Zufall aus der aktuellen Auswahl" ${filtered.filter(i=>i.id!==id).length?'':'disabled'}>${icon('shuffle')}</button>${favButton(item,'iconbutton')}<button class="iconbutton" data-close="detail" aria-label="Details schließen">${icon('close')}</button></div><div class="detail-layout"><div class="detail-media"><div class="media-stage" id="detail-media"></div><div class="media-controls" id="media-controls"></div><div class="photo-thumbs" id="photo-thumbs" aria-label="Fotos und Varianten"></div></div><div class="detail-info"><p class="provenance">${escape(kindLabel[item.kind])}${item.status === 'recherche' ? ' · Rechercheidee' : ''}${item.free ? ' · Kostenlos' : ''}</p><h2 id="detail-title">${escape(item.title)}</h2><p>${escape(item.description)}</p><dl class="detail-attributes"><dt>Wahrnehmung</dt><dd>${item.senses.filter(s=>data.senses[s]).map(s=>facetButton('senses',s,data.senses[s])).join(' ')}</dd><dt>Material</dt><dd>${item.materials.map(m=>facetButton('materials',m,data.materials[m])).join(' ')}<span class="material-note">${escape(material)}</span></dd><dt>Rubrik</dt><dd>${facetButton('family',item.family,item.family)}</dd>${item.action_prompt ? `<dt>Ausprobieren</dt><dd>${escape(item.action_prompt)}</dd>` : ''}</dl><div class="detail-links"><a href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.search || item.title)}" target="_blank" rel="noopener noreferrer">YouTube ${icon('external')}</a>${/^https:\/\//.test(item.source_url) ? `<a href="${escape(item.source_url)}" target="_blank" rel="noopener noreferrer">Quelle ${icon('external')}</a>` : ''}<a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(item.search || item.title)}" target="_blank" rel="noopener noreferrer">Bildersuche ${icon('external')}</a></div><p class="source-note">${escape(mediaNote(item))} ${item.status === 'recherche' ? 'Konzept aus dem Recherchepaket; kein verifiziertes Verkaufsangebot.' : ''}</p>${item.safety?.length ? `<p class="detail-safety">${escape(item.safety.map(s => safety[s] || s).filter(Boolean).join(' '))}</p>` : ''}</div></div>`;
    setupMedia(item,viewId);
    $('#previous').onclick = () => { if (pos > 0) details(list[pos - 1].id, false); };
    $('#next').onclick = () => { if (pos < list.length - 1) details(list[pos + 1].id, false); };
    if (!$('#detail').open) $('#detail').showModal();
    else if (['previous','next','random-detail'].includes(focusedControl)) {
      const same = $('#' + focusedControl); (same.disabled ? $('#detail [data-close]') : same).focus({preventScroll:true});
    }
    if (push) { openedHere = true; history.pushState({stimDetail:true}, '', location.pathname + location.search + '#item=' + encodeURIComponent(id) + (viewId ? '&view='+encodeURIComponent(viewId) : '')); }
    else history.replaceState(history.state, '', location.pathname + location.search + '#item=' + encodeURIComponent(id) + (viewId ? '&view='+encodeURIComponent(viewId) : ''));
  }
  function finishClose() { if ($('#detail').open) $('#detail').close(); activeId = null; if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true}); }
  function closeDetails() { finishClose(); if (openedHere) { openedHere = false; history.back(); } else history.replaceState(null, '', location.pathname + location.search); }
  function route() { const hp=new URLSearchParams(location.hash.slice(1)), id=hp.get('item'); if(id && byId.has(id)) details(id,false,hp.get('view')); else { openedHere=false;finishClose(); } }
  $('#detail').addEventListener('cancel', e => { e.preventDefault(); closeDetails(); });
  window.addEventListener('popstate',()=>{
    const next=stateFromURL(), signature=x=>JSON.stringify({...x,senses:[...x.senses],materials:[...x.materials]});
    if(signature(next)!==signature(state)){Object.assign(state,next);viewTrail.length=0;syncControls();render();}
    route();
  });
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', e => { if (e.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) { if (dialog.id === 'detail') closeDetails(); else dialog.close(); } }));
  document.addEventListener('click', e => {
    const button = e.target.closest('button'); if (!button) return;
    if (button.hasAttribute('data-random')) { randomize();return; }
    if (button.dataset.facet) { followFacet(button.dataset.facet,button.dataset.value);return; }
    if (button.dataset.fav) { toggleFavorite(button.dataset.fav); return; }
    if (button.dataset.open) { details(button.dataset.open,true,button.dataset.view || null); return; }
    if (button.dataset.type) { state.type = button.dataset.type; change(); return; }
    if (button.dataset.close) { if (button.dataset.close === 'detail') closeDetails(); else $('#' + button.dataset.close).close(); }
  });
  $('#search').addEventListener('input', e => { state.query = e.target.value; change(); });
  $('#sort').onchange = e => { state.sort = e.target.value; change(); };
  $('#family').onchange = e => { state.family = e.target.value; change(); };
  $('#quiet').onchange = e => { state.quiet = e.target.checked; change(); };
  $('#variants').onchange = e => { state.variants=e.target.checked; change(); };
  $('#free').onchange = e => { state.free = e.target.checked; change(); };
  $('#favorites').onclick = () => { state.favorites = !state.favorites; change(); };
  $('#filters-toggle').onclick = () => { const open = $('#filters').hidden; $('#filters').hidden = !open; $('#filters-toggle').setAttribute('aria-expanded', String(open)); };
  $('#reset').onclick = $('#empty-reset').onclick = $('#clear-view').onclick = reset;
  $('#return-view').onclick=returnView;
  $('.brand').addEventListener('click', e => { e.preventDefault(); reset(); window.scrollTo({top:0,behavior:'instant'}); });
  $('#theme').onclick = () => { setTheme(theme === 'dark' ? 'light' : 'dark'); write('stim-studio-v10-theme',theme); };
  $('#data').onclick = () => $('#data-dialog').showModal();
  $('#export').onclick = () => { const blob = new Blob([JSON.stringify({format:'stim-studio-backup-v10',version:'v10',progress,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'stim-atlas-meine-daten.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url),1000); };
  $('#import').onchange = async e => {
    const file = e.target.files?.[0]; if (!file) return;
    try {
      if (file.size > 5 * 1024 * 1024) throw Error('Die Datei ist zu groß (max. 5 MB).');
      const obj = JSON.parse(await file.text()); const merged = C.mergeProgress(progress, obj.progress);
      // Import is additive: an older backup cannot silently remove a current favorite.
      for (const id of Object.keys(progress)) if (progress[id].fav && merged[id]) merged[id].fav = true;
      progress = merged; const saved = write(KEY, progress); render();
      const matched = Object.keys(obj.progress).map(C.canonicalId).filter(id => byId.has(id)).length;
      $('#import-result').textContent = `${matched} vorhandene Einträge zugeordnet.${Object.keys(obj.progress).length > matched ? ' Weitere IDs bleiben für einen späteren Katalog erhalten.' : ''}${saved ? '' : ' Speichern nicht verfügbar; bitte Backup exportieren.'}`;
    } catch (err) { $('#import-result').textContent = 'Import fehlgeschlagen: ' + err.message; }
    e.target.value = '';
  };
  const top = () => window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth'});
  $('#top').onclick = $('#jump-top').onclick = top;
  window.addEventListener('scroll', () => { $('#jump-top').hidden = scrollY < 700; }, {passive:true});
  document.addEventListener('keydown', e => {
    const editing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if (!editing && !document.querySelector('dialog[open]') && (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'))) { e.preventDefault(); $('#search').focus(); }
    if ($('#detail').open && !editing && !e.altKey && !e.ctrlKey && !e.metaKey) { if(document.activeElement?.closest('.detail-media') && ['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const b=$(e.key==='ArrowRight'?'#photo-next':'#photo-prev');if(b&&!b.disabled)b.click();return;} if (e.key === 'ArrowRight' && !$('#next').disabled) { e.preventDefault(); $('#next').click(); } if (e.key === 'ArrowLeft' && !$('#previous').disabled) { e.preventDefault(); $('#previous').click(); } }
  });
  render(); route();
})();
