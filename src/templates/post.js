import React from 'react'
import { graphql, Link } from 'gatsby'

import Layout from '../components/layout'
import style from './post.module.scss'

import HomeIcon from '../assets/svg/home.svg'

const Post = ({ data }) => {
  const post = data.markdownRemark

  return (
    <Layout>
      <article
        className={style.post}
        itemScope
        itemType="http://schema.org/BlogPosting"
      >
        <header className={style.header}>
          <Link to="/" className={style.goHome} alt="Go home!">
            <HomeIcon />
          </Link>

          <h1 className={style.title} itemProp="name headline">
            {post.frontmatter.title}
          </h1>

          <aside className={style.meta}>
            <time dateTime={post.frontmatter.date} itemProp="datePublished">
              {post.frontmatter.date}
            </time>
          </aside>
        </header>

        <div
          className={style.content}
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "DD. MMMM YYYY")
        title
      }
    }
  }
`

export default Post
