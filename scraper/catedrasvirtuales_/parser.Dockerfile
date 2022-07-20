FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y software-properties-common &&\
	apt-add-repository -y ppa:alex-p/tesseract-ocr-devel &&\
	apt-get update && apt-get install -y\
	tesseract-ocr\
	tesseract-ocr-spa\
	python3\
	python3-pip\
	&& rm -rf /var/lib/apt/lists/*
RUN pip3 install pytesseract pysentimiento
RUN python3 -c "import pysentimiento;pysentimiento.SentimentAnalyzer('es')"
RUN pip3 install tqdm

COPY ./main.py /src/main.py

WORKDIR /
CMD /src/main.py
