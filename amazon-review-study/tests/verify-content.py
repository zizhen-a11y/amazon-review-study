from pathlib import Path
from docx import Document
import json, re, sys
root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1])
data=json.loads((root/'materials.json').read_text())
ps=[p.text for p in Document(source).paragraphs if p.text]
assert data['summary']==ps[ps.index('Locked AI Summary (V4)')+1]
reconstructed=[]
for r in data['reviews']:
 reconstructed.extend([r['reviewerName'],r['ratingText']+'  '+r['title'],r['dateText'],'Verified Purchase',*r['body']])
 assert r['rating']==r['ratingText'].count('★')
 if r['helpfulText']:
  reconstructed.append(r['helpfulText'])
  assert r['helpfulCount']==(1 if r['helpfulText'].startswith('One') else int(r['helpfulText'].split()[0]))
 reconstructed.append('Helpful   |   Report')
assert reconstructed==ps[ps.index('Top reviews from the United States')+1:]
assert len(data['reviews'])==40
assert [r['id'] for r in data['reviews']]==list(range(1,41))
assert (root/'control.html').read_bytes()==(root/'treatment.html').read_bytes()
js=(root/'materials.js').read_text()
assert json.loads(js.removeprefix('window.STUDY_MATERIALS = ').rstrip(';\n'))==data
print('PASS: exact Word paragraph round-trip, all metadata, helpful counts, order, 40 reviews, identical HTML, shared JS/JSON data.')
