#!/usr/bin/env python3
import pandas as pd

for f in ('cpc', 'cpo'):
    xls = pd.ExcelFile(f'/data/recomendaciones_{f}.xlsx')
    pages = []
    for page_name in xls.sheet_names:
        if page_name in ('ÚLTIMOS CORTES CPO',):
            continue
        page = pd.read_excel(xls, page_name)
        page.columns = page.iloc[1]
        page = page.rename(columns={'COMISION': 'COMISIÓN', 'OPINION': 'OPINIÓN'})
        page = page[~page['COMISIÓN'].isna() & ~page['OPINIÓN'].isna()][['COMISIÓN', 'OPINIÓN']]
        page = page[page['OPINIÓN'] != 'SIN INFO.']
        page = page[page['OPINIÓN'] != 'SIN INFO']
        page = page[page['OPINIÓN'] != 'OPINIÓN']
        page = page[page['OPINIÓN'] != 'OPINION']
        pages.append(page)
    df = pd.concat(pages)
    df.to_json(f'recomendaciones_{f}.json', orient='records')
