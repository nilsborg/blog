import React from 'react'
import { graphql } from 'gatsby'

const Post = ({ data }) => {
  const post = data.markdownRemark

  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "DD.MM.YYYY")
        title
      }
    }
  }
`

export default Post
