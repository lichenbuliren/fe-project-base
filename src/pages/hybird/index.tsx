import { useStores } from '@/hooks'
import { observer } from 'mobx-react'
import React from 'react'

const HybirdHome: React.FC = observer((props) => {
  const commonStore = useStores('commonStore')

  return (
    <>
      <div>Welcome Hybird Home</div>
      <div>current theme: {commonStore.theme}</div>
      <button type="button" onClick={() => commonStore.setTheme('black')}>
        set theme to black
      </button>
      <button type="button" onClick={() => commonStore.setTheme('red')}>
        set theme to red
      </button>
    </>
  )
})

export default HybirdHome
