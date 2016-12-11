# Personal Site

This is the repo for my personal site, [charlieegan3.com](charlieegan3.com).
The site has gone through a number of revisions, take a look at the [way back
machine](https://web.archive.org/web/*/http://charlieegan3.com).

The purpose of the site is to act as an online introduction that I have 
creative control over (unlike social networks). I also sometime use it to play 
with new things - Middleman, GCP & netlify for example.

This is a static site but it does make a request to a 
[JSON file](https://s3.amazonaws.com/charlieegan3/status.json) that represents
my 'current state'. This is updated by a 
[separate project](https://github.com/charlieegan3/json-charlieegan3).

My username, charlieegan3, comes from my selection of a Gmail address in 2005.
_3_ was my primary school lucky number.

## Development

```bash
docker run -it -v "$(pwd):/app" -p 4567:4567 -w /app ruby bash
bundle install
middleman server
```

## Deployment

The app is deployed to a free-tier App Engine instance on GCP using wercker. To
manually deploy the app run: 

```bash
docker run -it -v "$(pwd):/app" -p 4567:4567 -w /app ruby bash
bundle install
middleman build
exit
gcloud app deploy --project charlieegan3-site --verbosity=info
```
