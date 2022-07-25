FROM python:buster
ENV DEBIAN_FRONTEND=noninteractive
RUN pip3 install scrapy

COPY ./myspider.py /src/myspider.py

WORKDIR /
CMD scrapy runspider /src/myspider.py -t json -o /data/data.json
