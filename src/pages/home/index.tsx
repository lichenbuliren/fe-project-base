import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.less'

interface IHomeProps {
  title: string
  backurl?: string
}

const Home: React.FC<any> = (props) => {
  const { backurl, title } = props

  return (
    <>
      <div className={styles.title}>Welcome Home {title}</div>
      <Link to="/h5/">H5 模块</Link>
      <Link to="/hybird/">hybird 模块</Link>
    </>
  )
}

export default Home
