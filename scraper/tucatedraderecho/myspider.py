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
        self.tags = []

    def handle_starttag(self, tag, attrs):
        if tag == 'img': return
        if tag == 'br': return
        if tag == 'input': return
        self.tags.append(tag)

    def handle_endtag(self, tag):
        if tag != self.tags[-1]:
            raise Exception(f'Closing tag {tag}, stack is {">".join(self.tags)}')
        self.tags = self.tags[:-1]

    def handle_data(self, d):
        if 'script' in self.tags or 'style' in self.tags:
            return
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
            option_id = int(option.attrib['value'])
            if option_id > -1:
                yield response.follow('https://tucatedraderecho.com.ar/sumoNodoCombo.php?base=CPC&anexo=.CPC.info&Id=' + str(option_id), self.parse_results, meta={'base': 'CPC', 'ref_id': option_id})

        for option in response.css('.CPO .combo option'):
            option_id = int(option.attrib['value'])
            if option_id > -1:
                yield response.follow('https://tucatedraderecho.com.ar/sumoNodoCombo.php?base=CPO&anexo=.CPO.info&Id=' + str(option_id), self.parse_results, meta={'base': 'CPO'})

    def parse_results(self, response):
        base = response.meta['base']
        for option in response.css(':not(.materias) option'):
            id = int(option.attrib['value'])
            if id > -1:
                yield response.follow(f'https://tucatedraderecho.com.ar/sumoNodoCombo.php?base={base}&anexo=.{base}.info&Id={id}', self.parse_results, meta={
                    'base': base,
                    'ref_id': id,
                })

        for option in response.css('.materias option'):
            ref_id = response.meta['ref_id']
            id = int(option.attrib['value'])
            if id > -1:
                yield response.follow(f'https://tucatedraderecho.com.ar/muestroInfo.php?base={base}&anexo=.{base}.info&Id={id}&id_materia={ref_id}', self.parse_materia, meta={
                    'base': base,
                })

    def parse_materia(self, response):
        for el in response.xpath('//ul/li').extract():
            text = strip_tags(el)
            text = text.replace('INFORMACION RELEVADA', '')
            text = text.replace('(click para copiar info)', '')
            text = re.sub(r'\n+', '\n', text)
            text = re.sub(r'^\s+', '', text, flags=re.MULTILINE)
            yield {
                'text': text,
            }
