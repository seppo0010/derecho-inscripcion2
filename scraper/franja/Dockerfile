FROM python:buster
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y\
        poppler-utils\
        && rm -rf /var/lib/apt/lists/*

COPY ./main.py /src/main.py

WORKDIR /data
CMD /src/main.py
