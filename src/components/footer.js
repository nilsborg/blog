import React from 'react'

import style from './footer.module.scss'

const Footer = () => (
  <footer className={style.footer}>
    <p>Hi there, my name is Nils Borgböhmer.</p>
    <p>
      You found the blog I always wanted to have, where I write about stuff that
      I like.
    </p>
    <p>
      Probably alot of this will be about living the designer and web developer
      freelance life, which always throws up some hurdles to blog about.
    </p>
    <p>
      Also I'm a proud dad and might chuck a couple very wise comments your way
      about that too{' '}
      <span role="img" aria-label="Grin">
        😬
      </span>
      .
    </p>
    <p>
      You can reach me{' '}
      <a href="https://twitter.com/nilsborgboehmer" rel="noop">
        on Twitter
      </a>{' '}
      or through <a href="https://strandrover.com">our tiny bureau website</a>.
    </p>
    <p>– n</p>
  </footer>
)

export default Footer
