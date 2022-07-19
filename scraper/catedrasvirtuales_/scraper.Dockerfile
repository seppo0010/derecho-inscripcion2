FROM python:buster
RUN pip3 install git+https://github.com/seppo0010/instagram-scraper.git@patch-1

WORKDIR /data
CMD ["sh","-c", "instagram-scraper $TARGET -u $USERNAME -p $PASSWORD --comments --verbose 2 --retry-forever"]
