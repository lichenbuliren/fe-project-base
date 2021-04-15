import { useStores } from '@/hooks'
import { observer } from 'mobx-react'
import React from 'react'

const H5Home: React.FC = observer((props) => {
  const counterStore = useStores('counterStore')
  return (
    <>
      <div>Welcome H5 Home</div>
      <div>store counter: {counterStore.counter}</div>
      <button type="button" onClick={() => counterStore.increment()}>
        increment
      </button>
      <button type="button" onClick={() => counterStore.decrement()}>
        decrement
      </button>
    </>
  )
})

export default H5Home
