---
date: 2017-09-17T22:00:00.000Z
title: Let's encrypt this blog
---
## Gitlab rulez!1

Quick thing to know about me: I'm super in love with [Gitlab](https://gitlab.com) because:

- They went for the missing features on Github that those folks apparently never wanted to come up with
- They just took on Github – which is pretty awesome by itself
- They're entirely remote team and still deliver this brilliant work!

Kudos!

## Gitlab Pages + Let's encrypt

So this blog is – OF COURSE! – hosted on Gitlab pages. You get free https when using their domain but starting NAO it's also reachable on this awesome domain: [https://nilsb.org](https://nilsb.org).

Of course I also wanted to serve this blog over https, so here's the very nice [howto article](https://about.gitlab.com/2016/04/11/tutorial-securing-your-gitlab-pages-with-tls-and-letsencrypt/) that I followed.

Only caveat somehow is that I have to manually refresh the cert every 3 months … bummer. But ok. Repeating calendar event to the rescue. Maybe that's going to improve in the future?

One important thing though: Add this bit to the head of your site, so search engines get that you would like the site to be served through https:

```
<link rel="canonical" href="https://YOURDOMAIN.org/specific/page" />
```

So what I did for this Jekyll blog is, add an `env` variable to my `_config.yml` and `_config.gitlab.yml` which in the latter reads:

```
env: prod
```

and then in my `head.html`:

```html
{% raw %}
{% if site.env == 'prod '%}
  <script>
  const host = '{{ page.url }}';

  if (host == window.location.host && window.location.protocol != 'https:') {
    window.location = window.location.toString().replace(/^http:/, 'https:');
  }
  </script>
{% endif %}
{% endraw %}
```

GO Gitlab!

– n
