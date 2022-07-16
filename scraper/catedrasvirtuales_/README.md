```
$ docker build -t instagram-scraper .
$ docker run -it -v $(pwd)/data:/data -e TARGET=catedrasvirtuales_ -e USERNAME=<username> -e PASSWORD=<password> instagram-scraper
```
