---
title: "Heroku Deploy button treasure hunt with GitHub and BigQuery"
date: 2017-01-12 17:03:05 +0000
---

Sometime last year I listened to a [Changelog podcast episode](https://changelog.com/podcast/209)
about the GitHub data that's been made available on [BigQuery](https://cloud.google.com/bigquery/pricing),
Google's tool for querying large datasets. Over Christmas I finally thought up
a query worth running.

I'd been looking for a self-hosted Evernote alternative and was interested in
what people might have already built that was ready to 'self host' on Heroku.

So after a little fiddling about I settled on the following query:

```sql
SELECT repo_name FROM [bigquery-public-data:github_repos.files]
WHERE id IN (
  SELECT id FROM [bigquery-public-data:github_repos.contents]
  WHERE content CONTAINS 'https://www.herokucdn.com/deploy/button.png'
)
```

This gets a list of all the repos that have the Heroku button in some file
somewhere.

Next I wrote a simple script to get the extra data from the GitHub API
(description, homepage etc). After sorting by stars (because I couldn't think
of a better thing to sort by) we get the following:

1. [Huginn](https://github.com/cantino/huginn) - Create agents that monitor and act on your behalf.
2. [RocketChat](https://github.com/RocketChat/Rocket.Chat) - Slack like online chat.
3. [Keystone](https://github.com/keystonejs/keystone) - node.js cms and web app framework.
4. [Wekan](https://github.com/wekan/wekan/wiki) - The open-source Trello-like kanban.
5. [Paperwork](https://github.com/twostairs/paperwork) - OpenSource note-taking & archiving.

Full set of Heroku ready apps can be found [here](heroku-treasure/heroku-deploy-button-results.csv).
A few days later I got an invoice £11.76 so I guess it'll be a while before I
have such reckless fun like this again...
