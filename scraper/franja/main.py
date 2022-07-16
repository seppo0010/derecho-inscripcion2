#!/usr/bin/env python3
from glob import glob
import subprocess
import re
import json

recommendations = []
for path in glob('/data/*/*.pdf'):
    output = subprocess.check_output(('pdftotext', path, '-')).decode('utf-8')
    for rec in output.split('•'):
        rec = rec.strip()
        if re.match(r'^[0-9]{4}', rec):
            recommendations.append({'comision': int(rec[:4]), 'opinion': rec[4:]})
with open('/data/recommendations.json', 'w') as fp:
    fp.write(json.dumps(recommendations))
