import React from 'react'
import styles from './index.module.less'

interface IHomeProps {
  title: string
  backurl?: string
}

const Home: React.FC<IHomeProps> = (props) => {
  const { backurl } = props

  return <div className={styles.title}>welcome Home</div>
}

export default Home
