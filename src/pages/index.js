import React from 'react'
import { Link } from 'gatsby'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'
import Tags from '../components/tags'

import style from './index.module.scss'

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />

      <h1 className="page-heading">Posts</h1>

      {posts.map(({ node: { id, frontmatter, fields } }) => {
        return (
          <article key={id} className={style.post}>
            <time dateTime={frontmatter.date} itemprop="datePublished">
              {frontmatter.date}
            </time>

            <Link to={fields.slug}>
              <h2>{frontmatter.title}</h2>
            </Link>

            <Tags tags={frontmatter.tags} />
          </article>
        )
      })}
    </Layout>
  )
}

export const pageQuery = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD. MMMM YYYY")
            tags
          }
          fields {
            slug
          }
        }
      }
    }
  }
`

export default IndexPage
