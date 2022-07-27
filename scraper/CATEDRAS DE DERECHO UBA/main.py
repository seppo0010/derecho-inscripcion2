#!/usr/bin/env python3
import os
from facebook_scraper import write_posts_to_csv

write_posts_to_csv(
    group=os.environ.get('SCRAPER_GROUP_ID'),
    credentials=(
        os.environ.get('SCRAPER_USERNAME'),
        os.environ.get('SCRAPER_PASSWORD'),
    ),
    filename='data/data.csv',
    matching=r'.+',
    pages=int(os.environ.get('SCRAPER_PAGES', 10)),
    encoding='utf-8',
    options={"comments": True},
)
