# Personal Website

This is the repo for my personal website, [charlieegan3.com](https://charlieegan3.com).
The site has gone through a number of revisions, see Git history and [way back
machine](https://web.archive.org/web/*/http://charlieegan3.com).

The purpose of the site is to act as an online space that I have
control over - unlike one has on social networks such as LinkedIn. I also
sometimes use it to try out new things - Middleman, GAE, netlify or tachyons
for example.

This is a 'static site'<sup>1</sup> but it does make a request to a
[JSON file](https://s3.amazonaws.com/charlieegan3/status.json) that represents
my 'current state'. This is updated by a
[another project](https://github.com/charlieegan3/json-charlieegan3) which runs
as a task on Heroku.

---

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

<sup>1.</sup>This is running on GAE and is built as a static site but not
technically running as one. Application handlers are defined in `app.yaml`.
