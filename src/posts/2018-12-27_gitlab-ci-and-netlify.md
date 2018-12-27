---
date: 2018-08-25T22:00:00.000Z
title: Gitlab CI and Netlify
---
**Update: Using new [netlify node cli](https://cli.netlify.com/) instead of binary package**

It's a sunny Sunday and I for whatever reason woke up after 5 hours of sleep to the idea "I should try Netlify and see what all the fuss is about".

So that's what I did. This post is primarily to remind me how to deploy static sites from my own Gitlab instance to netlify, while leaving the CI part to Gitlab.

It's actually worth mentioning, that I let Netlify build my Jekyll/Gulp/Node setup by accident the first time I used their command line tools, and it was A. super fast to install all those packages B. just worked :D …

The console output on Netlify just ran through the whole thing, installed all the Gems and Node packages and stuff, then ran `gulp build:prod` and finished after like 20 seconds with the message "Your site is now live with this URL: somethingsomething.netlify.com".

I was pretty impressed.

Anyway, I still want all that on the Gitlab CI side of things. So what I do, to deploy a Jekyll site to Netlify is:

1. Run `netlify create` in the root of the project
2. Go grab the site id by running `netlify sites` and select the newly create site from the list (or the web interface, in which the site showed up now too)
3. Add this to the deploy step of the `.gitlab-ci.yml`:

```yaml
deploy:
  stage: deploy
  script:
    - yarn add netlify-cli
    - yarn run netlify deploy -s SITE_ID -p OUTPUT_DIRECTORY -t $NETLIFY_ACCESS_TOKEN
  only:
    - master
```

Now put your [Netlify Personal Access Token](https://app.netlify.com/account/applications) as a variable in the Gitlab Project's CI Settings: `Settings > CI/CD > Variables` with key `NETLIFY_ACCESS_TOKEN`.

Happy Deploying!
