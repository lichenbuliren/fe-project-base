import React from 'react'
import { useLocation } from 'react-router-dom'
import { MobXProviderContext } from 'mobx-react'
import { StoreType } from '@/stores'

// 获取浏览器 ?后面的参数
export function useQuery() {
  const query: { [x: string]: string } = {}
  const search = useLocation().search
  const params = new URLSearchParams(search)
  params.forEach((val, key) => {
    query[key] = val
  })
  return query
}
interface ContextType {
  stores: StoreType
}

// 函数声明，重载
function useStores(): StoreType
function useStores<T extends keyof StoreType>(storeName: T): StoreType[T]

/**
 * 获取根 store 或者指定 store 名称数据
 * @param storeName 指定子 store 名称
 * @returns typeof StoreType[storeName]
 */
function useStores<T extends keyof StoreType>(storeName?: T) {
  const rootStore = React.useContext(MobXProviderContext)
  const { stores } = rootStore as ContextType
  return storeName ? stores[storeName] : stores
}

export { useStores }
