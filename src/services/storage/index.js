import Local from './local'

class Storage {
  static service = 'storage'

  adapter = null

  constructor(provider, config) {
    const result = typeof config === 'function' ?
      config() : this._defaultConfig()
    this.adapter = result.adapter
  }

  _defaultConfig() {
    return {
      adapter: new Local()
    }
  }

  setItem(key, val) {
    return this.adapter.setItem(key, val)
  }

  getItem(key) {
    return this.adapter.getItem(key)
  }

  getAllKeys() {
    return this.adapter.getAllKeys()
  }

}

export default Storage
