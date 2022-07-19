FROM ocrd/tesserocr
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y\
	tesseract-ocr-spa\
        && rm -rf /var/lib/apt/lists/*
RUN pip3 install pytesseract

COPY ./main.py /src/main.py

WORKDIR /
CMD /src/main.py
