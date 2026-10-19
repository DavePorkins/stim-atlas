"""Build static entry and optional self-contained HTML (no browser dependencies)."""
import json,base64,argparse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def build(standalone=False):
 template=(ROOT/'index.template.html').read_text(encoding='utf-8')
 catalog=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
 data=json.dumps(catalog,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
 template=template.replace('<!--DATA-->','<script id="catalog-data" type="application/json">'+data+'</script>')
 if standalone:
  template=template.replace('class="brand" href="./"','class="brand" href=""')
  template=template.replace('<!--STYLE-->','<style>'+(ROOT/'assets/site.css').read_text(encoding='utf-8')+'</style>')
  illustrations={i['id']:'data:image/svg+xml;base64,'+base64.b64encode((ROOT/i['illustration']).read_bytes()).decode() for i in catalog['items']}
  scripts='<script>const STIM_ILLUSTRATIONS='+json.dumps(illustrations)+';</script>'
  scripts+=''.join('<script>'+ (ROOT/'assets'/file).read_text(encoding='utf-8').replace('</script','<\\/script')+'</script>' for file in ['core.js','site.js'])
  template=template.replace('href="assets/favicon.svg"','href="data:image/svg+xml;base64,'+base64.b64encode((ROOT/'assets/favicon.svg').read_bytes()).decode()+'"')
 else:
  template=template.replace('<!--STYLE-->','<link rel="stylesheet" href="assets/site.css">')
  scripts='<script src="assets/core.js"></script><script src="assets/site.js"></script>'
 return template.replace('<!--SCRIPTS-->',scripts)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--preview',type=Path);args=parser.parse_args()
 (ROOT/'index.html').write_text(build(),encoding='utf-8')
 if args.preview:args.preview.write_text(build(True),encoding='utf-8')
 print('Static index built'+(' and standalone preview' if args.preview else ''))
