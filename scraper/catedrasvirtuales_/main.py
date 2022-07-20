#!/usr/bin/env python3
import pytesseract
import pysentimiento
from tqdm import tqdm
from PIL import Image
import os
import json
import re

analyzer = pysentimiento.SentimentAnalyzer('es')

with open('./data/catedrasvirtuales_/catedrasvirtuales_.json') as fp:
    data = json.loads(fp.read())['GraphImages']

results = []
for materia_turno in tqdm(data):
    url = materia_turno['urls'][0]
    filename = re.search(r'/([0-9_n]+.jpg)', url)[1]
    img = os.path.join('data/catedrasvirtuales_', filename)
    if not os.path.isfile(img):
        continue
    text = pytesseract.image_to_string(Image.open(img), lang='spa')
    text = re.sub(r'\s+', ' ', text).strip()
    if text == '':
        continue
    for comment in materia_turno['comments']['data']:
        results.append({
            'shortcode': materia_turno['shortcode'],
            'materia_turno': text,
            'text': comment['text'],
            'sentiment': analyzer.predict(comment['text']).probas,
        })

with open('data/parsed.json', 'w') as fp:
    fp.write(json.dumps(results))
