#!/usr/bin/env python3
import tabula
import pandas as pd

dfs = tabula.read_pdf("/data/oferta_cpc.pdf", pages='all', pandas_options={'header': None}, options='-l')
df = pd.concat(dfs).reset_index(drop=True)
df = df.iloc[1: , 1:]
df.columns = ['materia','comision','modalidad','docente','horario']
df.to_json('oferta_cpc.json', orient='records')

dfs = tabula.read_pdf("/data/oferta_cpo.pdf", pages='all', pandas_options={'header': None}, options='-l')
df = pd.concat(dfs).reset_index(drop=True)
df = df.iloc[1: , 1:7]
df.columns = ['materia','comision','modalidad','docente','horario','departamento']
df.to_json('oferta_cpo.json', orient='records')
