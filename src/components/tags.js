import React from 'react'

import style from './tags.module.scss'

const Tags = ({ tags }) => (
  <aside className={style.tags}>
    {tags.map((tag, index) => {
      return (
        <span key={index} className={style.tag}>
          {tag}
        </span>
      )
    })}
  </aside>
)

export default Tags
