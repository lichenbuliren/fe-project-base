import { makeAutoObservable, observable } from 'mobx'

class CommonStore {
  title = ''
  theme = 'default'

  constructor() {
    makeAutoObservable(this)
  }

  setTheme(theme: string) {
    this.theme = theme
  }

  setTitle(title: string) {
    this.title = title
  }
}

export default new CommonStore()
