import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />

      <h1>Posts</h1>

      <ul>
        {posts.map(({ node: { id, frontmatter, fields } }) => {
          return (
            <li key={id}>
              <Link to={fields.slug}>{frontmatter.title}</Link>
              <time>{frontmatter.date}</time>
            </li>
          )
        })}
      </ul>
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
            date(formatString: "DD.MM.YYYY")
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
