#!/usr/bin/env python3
import json
import re

def read_json(path):
    with open(path) as filepointer:
        return json.loads(filepointer.read())

oferta = read_json('./oferta/data/oferta_cpc.json')
oferta.extend(read_json('./oferta/data/oferta_cpo.json'))

cv_ = read_json('catedrasvirtuales_/data/catedrasvirtuales_/catedrasvirtuales_.json')['GraphImages']
for post in cv_:
    for comment in post['comments']['data']:
        comment['tokens'] = set(re.split('[^a-zA-Z]', comment['text'].lower()))

for o in oferta:
    o['catedrasvirtuales_'] = []
    docente = re.sub(r'\s+[A-Z]\.$', '', o['docente'].split('-')[-1]).lower()
    for post in cv_:
        for comment in post['comments']['data']:
            if len(docente) > 2 and docente in comment['tokens']:
                o['catedrasvirtuales_'].append(comment['text'])

oferta_by_comision = {}
for o in oferta:
    if isinstance(o, dict) and o['comision'] not in ('Comisión', 'comisión'):
        oferta_by_comision[int(o['comision'])] = o

for o in oferta:
    o['centeno'] = []
    o['franja'] = []

for f in 'cpc', 'cpo':
    for op in read_json(f'centeno/data/recomendaciones_{f}.json'):
        for comision in str(op['COMISIÓN']).split('/'):
            id_ = int(comision.strip())
            if id_ not in oferta_by_comision:
                continue
            oferta_by_comision[id_]['centeno'].append(op['OPINIÓN'])

for row in read_json('franja/data/recommendations.json'):
    id_ = int(row['comision'])
    if id_ not in oferta_by_comision:
        continue
    oferta_by_comision[id_]['franja'].append(row['opinion'])

print(json.dumps(list(oferta_by_comision.values())))
