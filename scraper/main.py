#!/usr/bin/env python3
import json
import re
import pysentimiento
from tqdm import tqdm

def read_json(path):
    with open(path) as filepointer:
        return json.loads(filepointer.read())

known_materias = read_json('catedrasvirtuales_/aliases.json')
analyzer = pysentimiento.SentimentAnalyzer('es')

def is_same_materia(materia_turno, materia):
    if materia_turno not in known_materias:
        raise Exception(f'Unknown materia {materia_turno}')
    return known_materias[materia_turno].get('materia', None) == materia

def is_same_departamento(materia_turno, departamento):
    if departamento is None:
        return False
    if materia_turno not in known_materias:
        raise Exception(f'Unknown materia {materia_turno}')
    return known_materias[materia_turno].get('departamento', None) == departamento

def is_docente_named(docente, tokens):
    if len(docente) > 2 and docente in tokens:
        return True
    docente_tokens = docente.split(' ')
    if len(docente_tokens) >= 2 and len(docente_tokens[0]) >= 3:
        return docente_tokens[0] in tokens
    return False

oferta = read_json('./oferta/data/oferta_cpc.json')
oferta.extend(read_json('./oferta/data/oferta_cpo.json'))

cv_ = read_json('catedrasvirtuales_/data/parsed.json')
for comment in cv_:
    comment['tokens'] = set(re.split('[^a-zA-Z]', comment['text'].lower()))

for o in tqdm(oferta):
    o['catedrasvirtuales_'] = []
    docente = re.sub(r'\s+[A-Z]\.$', '', o['docente'].split('-')[-1]).lower()
    for comment in tqdm(cv_):
        if (
                is_same_materia(comment['materia_turno'], o['materia']) or
                is_same_departamento(comment['materia_turno'], o.get('departamento', None))
            ) and is_docente_named(docente, comment['tokens']):
            o['catedrasvirtuales_'].append({
                'shortcode': comment['shortcode'],
                'text': comment['text'],
                'sentiment': analyzer.predict(comment['text']).probas,
            })

oferta_by_comision = {}
for o in oferta:
    if isinstance(o, dict) and o['comision'] not in ('Comisión', 'comisión'):
        oferta_by_comision[int(o['comision'])] = o

for o in oferta:
    o['centeno'] = []
    o['franja'] = []

for f in 'cpc', 'cpo':
    for op in tqdm(read_json(f'centeno/data/recomendaciones_{f}.json')):
        for comision in str(op['COMISIÓN']).split('/'):
            id_ = int(comision.strip())
            if id_ not in oferta_by_comision:
                continue
            oferta_by_comision[id_]['centeno'].append({
                'text': op['OPINIÓN'],
                'sentiment': analyzer.predict(op['OPINIÓN']).probas,
            })

for row in tqdm(read_json('franja/data/recommendations.json')):
    id_ = int(row['comision'])
    if id_ not in oferta_by_comision:
        continue
    oferta_by_comision[id_]['franja'].append({
        'text': row['opinion'],
        'sentiment': analyzer.predict(row['opinion']).probas,
    })

with open('data/data.json', 'w') as fp:
    fp.write(json.dumps({
        "oferta": list(oferta_by_comision.values()),
        "departamentos": read_json('departamentos.json'),
    }))
