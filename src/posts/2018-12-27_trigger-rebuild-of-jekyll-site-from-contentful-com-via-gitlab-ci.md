---
date: 2017-11-05T14:15:11.102Z
title: Trigger rebuild of Jekyll site from contentful.com via Gitlab CI
---
Ok so if you’re like me currently, you're riding the static site generator train 🚂 and came to the part of the story, where the hero has to connect a CMS to the static site after all.

I was in the same situation: all the content was living neat and tidy in `yaml` files, till the client had more content updates than I anticipated. Which they forwarded to me via email.... which I hated. **A lot!**

So I went hunting for something that would have an interface and generate those `yaml` files for me.

Which is exactly what [Contentful](https://contentful.com) does. You can model your content in any way you like and it spits it out through a nice API. It even stores static files directly in some funky amazon cloud of doom thing … I think. Anyway, people can upload stuff and you get a url in the API response which you can dump into – for example – an `<img>` tag.

## How do I actually get the content?

Well in the case of Contentful and Jekyll, the people there where so nice to put together a [Jekyll plug-in](https://github.com/contentful/jekyll-contentful-data-import).

That grabs all the content and dumps it in your `_data` directory *(or where ever you’d like to put it)*. Just run:

```zsh
bundle exec jekyll contentful
```

If you don’t wanna use that or don’t have Jekyll but some other thing that likes `JSON` structured content, you can always just use curl or if you’re like me and wrapped Jekyll in a [Gulp](https://gulpjs.com/) workflow, use this handy Gulp task by [Ole Michelsen](https://ole.michelsen.dk/blog/download-and-edit-json-files-with-gulp.html):

```js
// import all the stuff.
// install with: npm i --save-dev ...
const
  gulp = require('gulp'),
  jeditor = require('gulp-json-editor'),
  request = require('request'),
  source = require('vinyl-source-stream'),
  streamify = require('gulp-streamify');

gulp.task('getContent', function() {
  return request({
    url: 'API_ENDPOINT_URL',
    headers: {
      'User-Agent': 'request'
    }
  })
    .pipe(source('content.json'))
    .pipe(
      streamify(
        jeditor(function(content) {
          return content.map(function(entry) {
            return {
              title: entry.title,
              date: entry.date,
              content: entry.excerpt,
              url: entry.link
            };
          });
        })
      )
    )
    .pipe(gulp.dest('src/_data/'));
});
```

This task also does some mapping in the middle there, which allows you to store only the content you actually need.

## Use Gitlab’s CI pipeline to rebuild your site.

So now that we have content in our site - which is very nice already - we gotta let the machines do the rest of the work.

I mean sure you could also have your client send you an email saying:

> Hey Nils I updated the text in this Contentful thing. Could u push that magic button and make it appear online?.

But I mean … 😐 that we can do better!

## So what are we doing again … ?

We want Contentful to tell Gitlab:

> Dude, I got new content here … you take it and do your thing with it.

Which would be, to grab the new content, rebuild our jekyll site with that new content and deploy the changes somewhere. So let's dig in:

1. Setup your `.gitlab-ci.yml` file ([Here]({% post_url 2017-10-04-gitlab-ci %}) is some inspiration).
2. Go to your project's pipeline settings: _Project Settings > CI/CD > Pipeline triggers_
3. Add a new trigger with a nice name
4. Grab the newly generated Token and merge it with this URL: `https://gitlab.com/api/v4/projects/3851008/ref/REF_NAME/trigger/pipeline?token=TOKEN` (REF_NAME is your branch by the way. Probably master).
5. Log in to Contentful and go to _Space Settings > Web Hooks_
6. Add that webhook URL, give it a name and maybe select custom events to trigger the pipeline for.

**So** now this is the part where I got super excited! Go ahead a and change some content in Contentful. And then to Gitlab to see if the pipeline went off.

…

It did not? … Hm. Maybe back to Contentful's webhook settings … Ah there's a red bubble on the webhook … That's probably not so good …

## Let's cut the disappointment short: It does not work.

(ノಠ益ಠ)ノ彡┻━┻

But it's not your fault! I'm honestly not even sure who's fault it is. The whole setup worked up until a couple weeks ago and either Gitlab or Contentful must have changed something, so it broke. Which is a bummer. A **big** one because it worked so well and easy.

I actually got into the trouble of opening an [issue](https://gitlab.com/gitlab-org/gitlab-ce/issues/39424) and talking to Contentful's support, which gave me this:

> Hi Nils,
>
> First of all sorry for the delay in getting back to you. Second, unfortunately currently there's no way to customize the headers included in the webhook calls but your use case proves that it might be interesting to consider in the future. A possible workaround would be to put a proxy to take the requests coming from  Contentful and forward those to Gitlab with the headers you need.
>
> Let us know if we can do anything else for you.
>
> best,
> Farruco Sanjurjo

Meep. BUT that is in fact exactly what I did because I really wanted this to work. My good friend Chris helped me put this Nginx snippet together:

```
server {
  listen 443 ssl;
  server_name gitlab-proxy.YOUR-DOMAIN.com;

  location / {
    proxy_http_version     1.1;
    proxy_set_header       Authorization "";
    proxy_set_header       Content-Type "application/json";
    proxy_set_header       Host gitlab.com;
    proxy_pass             https://gitlab.com/;
  }
  […] ssl stuff […]
}
```

So what this does is, it takes this header from Contentful:

```
"Content-Type": "application/vnd.contentful.management.v1+json"
```

and turns it into this (which is what Gitlab likes):

```
"Content-Type": "application/json"
```

I know this is crap. Let's face it. We wanted an easy solution and now we still need our own Nginx server to rewrite http headers?! Meep. But I figured I still write this post. Maybe somebody of either Contentful or Gitlab might read it and decide to do something about it.

– n
