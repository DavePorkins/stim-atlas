"""Rebuild v10 data from retained v9 sources + the dated media audit."""
import json,re,hashlib
from pathlib import Path
from illustrations import illustration
ROOT=Path(__file__).resolve().parents[1]
SENSES={'tactile':'Tasten','proprioceptive':'Druck & Kraft','vestibular':'Bewegung','visual':'Sehen','auditory':'Hören','olfactory':'Riechen','oral':'Mundgefühl','interoceptive':'Körperinneres'}
MATERIALS={'holz':'Holz','kork':'Kork','stein':'Stein','keramik':'Keramik','metall':'Metall','glas':'Glas','textil':'Textil','silikon':'Silikon','gummi':'Gummi','kunststoff':'Kunststoff','papier':'Papier','pflanzen':'Natur / Pflanzen','gel':'Gel / Knete','wasser':'Wasser','elektronik':'Elektronik','digital':'Digital','ohne-material':'Ohne Material','unbekannt':'Ungeklärt'}
TERMS={
 'holz':r'holz|wood|bambus|birke|buche',
 'kork':r'kork', 'stein':r'stein|kiesel|marmor|mineral', 'keramik':r'keramik|porzellan',
 'metall':r'metall|edelstahl|aluminium|messing|titan|kupfer|stahl|eisen|draht|\bmünze\b',
 'glas':r'\bglas\b|\bglass\b',
 'textil':r'textil|baumwolle|fleece|plüsch|minky|filz|samt|chenille|seide|wolle|garn|leinen|polyester|nylon|satin|gewebe|kordel|velours|lycra|denim|patchwork|ripsband|satinband|stoffrest|\bstoff\b|elasthan',
 'silikon':r'silikon|silicone', 'gummi':r'gummi|latex|rubber|elastomer|\btpe\b',
 'kunststoff':r'kunststoff|plastic|plastik|\babs\b|\bpla\b|\bpvc\b|acryl|harz|resin|3d-druck|\bpetg\b|kunstleder',
 'papier':r'papier|karton', 'pflanzen':r'pflanz|blumen|lavendel|kräuter|cedern|zedern|kaffee|orangenschale|bohnen|muschel|holzspan|tannenzapfen',
 'gel':r'\bgel\b|knete|putty|foam clay|schleim|slime|schaum|memory foam',
 'wasser':r'wasser|liquid|flüssigkeit|getränk', 'elektronik':r'elektronik|screen|bildschirm|smartphone|browser|gamepad|projektor|\bled\b|audio'}

def materials(raw):
 s=raw.lower()
 if s in ('kein material','ohne material','none','-'):return ['ohne-material']
 result=[key for key,pattern in TERMS.items() if re.search(pattern,s)]
 if re.search(r'audio|bildschirm|browser|smartphone|gamepad',s):result.append('digital')
 return result or ['unbekannt']

def main():
 source=json.loads((ROOT/'source_data/v9-catalog.json').read_text(encoding='utf-8'))
 audit=json.loads((ROOT/'source_data/image-audit.json').read_text(encoding='utf-8'))
 replacements=json.loads((ROOT/'source_data/photo-replacements.json').read_text(encoding='utf-8'))
 examples=json.loads((ROOT/'source_data/visual-examples.json').read_text(encoding='utf-8'))
 extra=json.loads((ROOT/'source_data/extra-objects.json').read_text(encoding='utf-8'))
 research=json.loads((ROOT/'source_data/research-v11.json').read_text(encoding='utf-8'))
 extra += research['items']
 overrides={i['id']:i for i in research.get('image_overrides',[])}
 result=[]
 for seq,old in enumerate(source['items']+extra):
  old={**old,**overrides.get(old['id'],{})}
  item={k:old.get(k) for k in ['id','legacy_id','title','description','kind','family','subcategory','senses','material_raw','actions','quiet','portable','status','provenance','source_url','search','action_prompt','safety','notes','image_role','image_source_url','image_attribution']}
  raw=item['material_raw'] or 'Unbekannt';item['material_raw']=raw
  item['materials']=materials(raw)
  item['images']=[u for u in old['images'] if audit.get(u,{}).get('ok')]
  key={'v8-4':'fidget-cube','product-ark-robochew':'product-ark-robochew'}.get(item['id'])
  if key:
   replacement=replacements[key]; urls=[u.replace('http://','https://',1) for u in replacement.get('og_images',[])]
   item['images']=[u for u in urls if audit.get(u,{}).get('ok')]+item['images']
   item['source_url']=replacement.get('source',item['source_url'])
  if item['id']=='v8-23':
   # The old URL was an unexpanded {w}/{h} thumbnail template. Keep a proper diagram.
   item['image_note']='Originale Bildadresse enthält nicht ersetzte Größenparameter; Illustration verwendet.'
  if item['id']=='product-calm-strips':
   item['source_url']='https://calmstrips.com/'
   item['source_note']='Der in v9 gespeicherte Produktlink lieferte 404; Hersteller-Hauptseite als Quelle.'
  item['examples']=[v for v in examples if v['parent_id']==item['id'] and audit.get(v['image'],{}).get('ok')]
  item['image_role']=item['image_role'] or ('reference_photo' if item['images'] else 'illustration')
  item['free']=item['kind']=='activity' and raw.lower() in ('kein material','ohne material')
  item['sequence']=seq
  item['search_terms']=[SENSES.get(s,s) for s in item['senses']]+[MATERIALS.get(m,m) for m in item['materials']]
  item['image_status']='http_get_decoded_2026-10-19' if item['images'] else 'local_representative_illustration'
  motif,svg=illustration(item);item['illustration_motif']=motif
  item['illustration']='assets/illustrations/'+item['id']+'.svg'
  file=ROOT/item['illustration'];file.parent.mkdir(parents=True,exist_ok=True);file.write_text(svg,encoding='utf-8')
  result.append(item)
 # Quietly varied opening wall. No per-user ranking or random changes during scroll.
 opening=['v8-6','v8-1','v8-54','product-fidget-wear-bead-pocket-hoodie','product-scentco-geladough','v8-8004','v8-32','v8-4001','v8-63','v8-8003','v8-22','v8-12','product-ark-chewable-bangle-bracelet','product-scentco-smillows','v8-4013','v8-45','v8-27','v8-8012','v8-35','v8-4025','v8-4004','v8-8009','v8-46','v8-4009','v8-19','v8-8002','v8-9','v8-33']
 photos=[i for i in result if i['images']]; concepts=[i for i in result if not i['images']]
 photos.sort(key=lambda i:(opening.index(i['id']) if i['id'] in opening else 999,hashlib.sha256(i['id'].encode()).hexdigest()))
 concepts.sort(key=lambda i:hashlib.sha256(i['id'].encode()).hexdigest())
 # A small number of activity studies stays discoverable before the photo-only run ends.
 activities=[i for i in concepts if i['kind']=='activity' and i['free']]
 order=[]
 for n,p in enumerate(photos):
  order.append(p)
  if n%24==23 and activities:order.append(activities.pop(0))
 order += [i for i in concepts if i not in order]
 for rank,item in enumerate(order):item['rank']=rank
 media_count=sum(bool(i['images']) for i in result)
 catalog={'visual_example_count':len(examples),'version':'v11','updated':'2026-10-19','total':len(result),'senses':SENSES,'materials':MATERIALS,'photo_items':media_count,'illustrated_items':len(result)-media_count,'notes':'All original v9 IDs preserved; 21 additional sourced clothing, scent and activity examples in research-v11.json. Image GET/decoding is a technical check, not verification of photo identity, rights or lasting hotlink availability. Research ideas are not verified retail products.','items':result}
 (ROOT/'data').mkdir(exist_ok=True)
 (ROOT/'data/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2),encoding='utf-8')
 print(f"{len(result)} items / {media_count} photo references / {len(result)-media_count} illustrations")
if __name__=='__main__':main()
