```
$ cat > .env <<<EOF
SCRAPER_GROUP_ID=1105532989621297
SCRAPER_USERNAME=****
SCRAPER_PASSWORD=****
SCRAPER_PAGES=40
EOF
$ docker build -t catedrasfb .
$ docker run --env-file .env -it -v "$(pwd)/data:/data" catedrasfb
```
