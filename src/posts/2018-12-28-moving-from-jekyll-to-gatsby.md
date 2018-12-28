---
title: Moving from Jekyll to Gatsby
date: 2018-12-28T21:55:16.727Z
tags:
  - gatsby
  - jekyll
---
For the last 2-3 years my go-to-tool to build websites was Jekyll. Boom. There. Plain and simple. I used Jekyll for every kind of project that came our way.

I picked up on Jekyll during my last fulltime job in Berlin and stuck to it for a couple reasons:

- SUPER simple and straight forward
- Can read data from `json` and `yml` files which can basically come from anywhere as long as they're there before Jekyll runs
- Pretty flexible given how simple it is
- I like Ruby for whatever reason :)

Though all this is great, I recently finished up a bigger job which kinda demonstrated the boundaries of Jekyll's capabilities. Too many funky special cases, requirements/features, too many pages, etc … We managed in the end and the build time is actually not terrible BUT I decided right there to try something new. And that new thing was on the list for a while already.

## Checking out Gatsby 

I started following [@gatsbyjs on Twitter](https://twitter.com/gatsbyjs) a couple months back and since then, the posts saying something like "I rebuilt my site in Gatsby and it's super awesome-sauce!" appeared more frequently. 

During that time our tiny bureau also grew a bit. With a little help from our friends so to say :)

My new coding buddy Daniel wanted to check out Gatsby too, so we actually just turned the next website project into a Gatsby experiment. I'll definitely write something about that – but in another post. Which is gonna be great. Because the experient ended up introducting a lot more funky technologies that either of us expected.

## Thing's to know when moving a blog from Jekyll to Gatsby

So for now I'm just gonna sum up what kinda of hurdles I tripped over when moving this blog from Jekyll to Gatsby.

### Starters 

Setting up a new Gatsby project is pretty easy: `gatsby new [projectname]` and you're all set! 

I ran that command a couple times because I then discovered the [Gatsby starter projects](https://www.gatsbyjs.org/starters/?v=2) and I couldn't decide which one to pick. it basically boils down to the questions if you wanna start bare bones and add every piece yourself (which is what I'm doing right now for educational purposes) or grab a ready made package with – for a example – a finished CMS integration.  

### Netlify CMS with self hosted Gitlab as auth provider

I actually enjoy writing blog posts in my trusty code editor but I wanted to check out Netlify CMS for a while. I'm actually writing this blog post in Netlify CMS right now. With it's very pretty Markdown preview on the right side. 

There is a starter for Netlify CMS BUT I wanted to understand the individual steps necessary. Which also brings me to my first hurdle: Using your own Gitlab instance as authentication provider.

The starters and most documentation you find describes the pretty easy case to use Github, Gitlab.com or Bitbucket as auth provider. But it is in fact possible to use your own Gitlab instance – with this Netlify CMS configuration `static/admin/config.yml`:

```yaml
backend:
  name: gitlab
  repo: nils/blog-cms
  auth_type: implicit
  app_id: xxx
  api_root: https://gitlab.strandrover.com/api/v4
  base_url: https://gitlab.strandrover.com
  auth_endpoint: oauth/authorize
```

And theeeen this tiny piece of gatsby config makes it actually work:

```javascript
{
  resolve: `gatsby-plugin-netlify-cms`,
  options: {
    enableIdentityWidget: false,
  },
},
```

For reasons I didn't bother to understand, you have to disable something that seems to be called the "Identity Widget" – :)

Ah yes, make sure that the Gitlab User you authorize to log into Netlify CMS is not an admin because that might be a bit insecure. But your Gitlab is gonna remind you of that too.

### Rendering markdown files and creating URLs for them 

Coming from Jekyll, I kinda expected this part to be … done for me :D And well in most ways it actually is. There is a Markdown Plugin for Gatsby and of course there's a function to create any kind of slug you like and so and so forth. I just had to get used to the fact that a basic Gatsby project come with less default stuff than I thought. So you just have to enable all the things you need.

In my case I wanted:

1. Get markdown files from Netlify CMS into Gatsby 
2. Render each of them into Gatsby pages
3. Get nice URLs for each of them, including the date 
4. List the posts on the homepage

Number 1. is totally done for you, since Netlify CMS just commits markdown files into your repo and you're done – super nice! 👍 

Step 2 was a bit more to figure out for a Gatsby noob like me. I saw people using GraphQL to query all markdown files and then do something with them but I couldn't really do that because the `allMarkdownRemark` GraphQL results didnt have the URL on them I wanted them to have. 

So long story short, here's my `gatsby-node.js`:

```javascript
const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve(`./src/templates/post.js`),
          context: {
            // Data passed to context is available
            // in page queries as GraphQL variables.
            slug: node.fields.slug,
          },
        })
      })

      resolve()
    })
  })
}
```

The trick here is to hook into the `onCreateNode` API, filter out the markdown files and ADD the kind of slug you like and THEN use `createPages` to actually render the pages with appropriate URL. Sweet.

### To be continued 
