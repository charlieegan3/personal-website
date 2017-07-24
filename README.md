# Personal Website

This is the repo for my personal website,
[charlieegan3.com](https://charlieegan3.com).

The site is a semi-professional online space that I have control over. I also
sometimes use it to try out new things like Middleman, GAE, Netlify, tachyons
CSS, Terraform, Cloudfront, Codebuild...  The site has likely passed the
over-engineered mark at this point - I should find a new project...

This is a 'static site' but it pulls in some 'live' [JSON
data](https://s3.amazonaws.com/charlieegan3/status.json) that represents my
'current state'. This is updated by a [another
project](https://github.com/charlieegan3/json-charlieegan3) which runs as a
task on Heroku.

The site is hosted on Cloudfront and S3; deployed using CodePipeline and
provisioned using Terraform. Terraform changes are not in CI/CD.

The site has gone through a number of revisions, see [Git
history](https://github.com/charlieegan3/personal-website/graphs/contributors)
and [way back machine](https://web.archive.org/web/*/http://charlieegan3.com).

---

My username, `charlieegan3`, comes from my selection of a Gmail address in
2005. _3_ was my primary-school lucky number.
