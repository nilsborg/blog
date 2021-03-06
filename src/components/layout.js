import React from 'react'
import PropTypes from 'prop-types'

import Header from './header'
import Footer from './footer'

import style from './layout.module.scss'
import '../assets/scss/global.scss'

const Layout = ({ children }) => (
  <div className={style.wrapper}>
    <Header />
    <main className={style.main}>{children}</main>
    <Footer />
  </div>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
