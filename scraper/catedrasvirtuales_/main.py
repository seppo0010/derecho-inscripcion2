#!/usr/bin/env python3
import pytesseract
from PIL import Image
import os
import json
import re

with open('./data/catedrasvirtuales_/catedrasvirtuales_.json') as fp:
    data = json.loads(fp.read())['GraphImages']

results = []
for materia_turno in data:
    url = materia_turno['urls'][0]
    filename = re.search(r'/([0-9_n]+.jpg)', url)[1]
    img = os.path.join('data/catedrasvirtuales_', filename)
    if not os.path.isfile(img):
        continue
    text = re.sub(r'\s+', ' ', pytesseract.image_to_string(Image.open(img))).strip()
    if text == '':
        continue
    for comment in materia_turno['comments']['data']:
        results.append({
            'materia_turno': text,
            'text': comment['text'],
        })

with open('data/parsed.json', 'w') as fp:
    fp.write(json.dumps(results))
