import scrapy
import re
from io import StringIO
from html.parser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = StringIO()
    def handle_data(self, d):
        self.text.write(d)
    def get_data(self):
        return self.text.getvalue()

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

class TuCatedraDerechoSpider(scrapy.Spider):
    name = 'seppo0010.github.io/derecho-inscripcion2/'
    start_urls = ['https://tucatedraderecho.com.ar/index.php?INVITADO=1']

    def parse(self, response):
        yield response.follow('https://tucatedraderecho.com.ar/index.php', self.parse_real_home)

    def parse_real_home(self, response):
        for option in response.css('.CPC .combo option'):
            materia_id = int(option.attrib['value'])
            if materia_id > -1:
                materia = option.css('::text').get()
                yield response.follow('https://tucatedraderecho.com.ar/sumoNodoCombo.php?base=CPC&anexo=.CPC.info&Id=' + str(materia_id), self.parse_materia_cpc, meta={
                    'materia': materia,
                    'materia_id': materia_id,
                })

    def parse_materia_cpc(self, response):
        materia = response.meta['materia']
        materia_id = response.meta['materia_id']
        for option in response.css('.materias option'):
            docente_id = int(option.attrib['value'])
            docente = option.css('::text').get()
            if docente_id > -1:
                yield response.follow(f'https://tucatedraderecho.com.ar/muestroInfo.php?base=CPC&anexo=.CPC.info&Id={docente_id}&id_materia={materia_id}', self.parse_materia_docente_cpc, meta={
                    'materia': materia,
                    'materia_id': materia_id,
                    'docente': docente,
                    'docente_id': docente_id,
                })

    def parse_materia_docente_cpc(self, response):
        for el in response.xpath('//ul/li//div[@id="tooltipinfo"]').extract():
            text = strip_tags(el)
            text = re.sub(r'\n+', '\n', text)
            text = re.sub(r'^\s+', '', text, flags=re.MULTILINE)
            yield {
                'materia': response.meta['materia'],
                'materia_id': response.meta['materia_id'],
                'docente': response.meta['docente'],
                'docente_id': response.meta['docente_id'],
                'text': text,
            }
