FROM python:buster
RUN pip3 install pandas openpyxl
COPY ./main.py /src/main.py

WORKDIR /data
CMD /src/main.py
