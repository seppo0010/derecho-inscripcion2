FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y\
	python3\
	python3-pip\
	&& rm -rf /var/lib/apt/lists/*

RUN pip3 install pysentimiento tqdm
RUN python3 -c "import pysentimiento;pysentimiento.create_analyzer(task='sentiment', lang='es')"

COPY ./main.py /src/main.py

WORKDIR /data
CMD /src/main.py
