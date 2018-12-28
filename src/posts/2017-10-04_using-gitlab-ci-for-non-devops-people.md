---
title: Using Gitlab CI for non-devops people
date: 2017-10-04T13:12:17.005Z
tags:
  - security
  - gitlab
  - https
---
So we work a ton with Jekyll and headless CMS things lately. And that's all brilliant and everythings because you know – the usual things:

- Static pages are super scalable with having to think about backend performance multi database sync blabla and all those things, because … well because it's just static content
- It's a lot less attackable for evil people than a CMS exposed to the public, which – when it goes down due to hacking and watnot – also affects the frontend.
- Super simple to develop

And so on and so forth. Not going into the details here, because I think the advantages where discussed in great length in other places.

BUT all this content in headless CMS and static page generator things require a nicely setup CI system for you not to go nuts over all the button you gotta press, until the precious typo correction from your dear customer finally goes online.

## Enter Gitlab CI

Gitlab has this awesome Continuous Integration feature built right in. When I started working as a web developer back then, there was stuff like Jenkins and then a while later Travis and such tools that you might have heard of.

Well now, as far as I understand this, you don't need them anymore but can rather do monotonous monkey work right with Gitlab CI.

I was never really good with devops topics and running servers and such BUT I'm also very lazy and can easily mess things up when they're boring.

So I sat down this fine afternoon and took the time to google around and read the great [Gitlab CI documentation](https://docs.gitlab.com/ee/ci/yaml/README.html) and once and for all resolve this question of the **working, understandable** `.gitlab-ci.yml` file.

## My easy peasy Gitlab CI config – enjoy.

Quick overview:

We define two "stages": `build` and `deploy`.

1. The first one takes my Jekyll source and compiles that using gulp (in my case. You can totally run any command you would otherwise run in your terminal).
2. If the first one succeeds (building Jekyll without errors) the second one goes ahead and copies the outcome of the first stage via FTP to a server of your liking.

**Also important to know**: This second job there has a config line that reads `when: manual` which means you have to login to Gitlab and click a button for this to happen. I want that control, you might find it annoying. Remove the line if you want to FTP upload directly without anyone intervening.

All that looks like this in the pipelines overview:

![Pipeline Overview](/assets/gitlab-ci.png)

### .gitlab-ci.yml

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: starefossen/ruby-node:latest
  cache:
    paths:
      - node_modules/
      - gems/
  script:
    - npm install
    - npm install gulp -g
    - bundle install --path gems/
    - bundle exec jekyll contentful
    - gulp jekyll:prod
    - gulp minify
  artifacts:
    paths:
      - build
  only:
    - master

deploy_staging:
  stage: deploy
  environment:
    name: staging
    url: YOUR_STAGING_URL
  script:
    - apt-get update
    - apt-get install lftp
    - lftp -e "mirror -R build TARGET_DIRECTORY_ON_YOUR_SERVER" -u $USERNAME,$PASSWORD $HOST
  when: manual
```

I use this funny docker image there in the build job, because I needed one to have NodeJS and Ruby pre-installed. So I can use gulp you know.

Ah yes and for these funny variables here `$USERNAME` and so on … had to google that a bit too, to find the very obvious:

Go to your project's settings > CI/CD > Secret variables and just create those things.
