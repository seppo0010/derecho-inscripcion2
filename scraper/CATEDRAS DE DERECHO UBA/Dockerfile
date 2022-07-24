FROM python:buster
RUN pip3 install git+https://github.com/kevinzg/facebook-scraper.git

COPY main.py /usr/src/main.py
WORKDIR /
CMD /usr/src/main.py
