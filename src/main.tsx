import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import '@/styles/global.less'
import { renderRoutes } from 'react-router-config'
import routes from './routes'
import stores from '@/stores'

ReactDOM.render(
  <React.StrictMode>
    <Provider stores={stores}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
