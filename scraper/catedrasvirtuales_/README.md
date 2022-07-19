```
$ docker build -f scraper.Dockerfile -t instagram-scraper .
$ docker run -it -v $(pwd)/data:/data -e TARGET=catedrasvirtuales_ -e USERNAME=<username> -e PASSWORD=<password> instagram-scraper

$ docker build -f parser.Dockerfile -t instagram-parser .
$ docker run -it -v $(pwd)/data:/data instagram-parser
```
