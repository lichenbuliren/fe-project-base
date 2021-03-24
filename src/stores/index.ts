import counterStore from './counter'
import commonStore from './common'

const _store = {
  counterStore,
  commonStore
}

export type StoreType = typeof _store

export default _store
