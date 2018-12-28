import { Link, StaticQuery } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Header = () => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            title
          }
        }
      }
    `}
    render={data => (
      <header>
        <div>
          <h1>
            <Link to="/">{data.site.siteMetadata.title}</Link>
          </h1>
        </div>
      </header>
    )}
  />
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
