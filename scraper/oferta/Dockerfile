FROM rappdw/docker-java-python
RUN pip3 install tabula-py

COPY ./main.py /src/main.py

WORKDIR /data
CMD /src/main.py
