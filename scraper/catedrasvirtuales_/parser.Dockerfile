FROM ocrd/tesserocr
RUN pip3 install pytesseract
COPY ./main.py /src/main.py

WORKDIR /
CMD /src/main.py
