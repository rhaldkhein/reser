
/**
 * A polyfill for asyncStorage that uses localStorage
 */

class Storage {

  constructor() {
    try {
      localStorage.setItem('____', '')
      localStorage.removeItem('____')
      this.available = true
    } catch (e) {
      this.available = false
    }
  }

  setItem(key, val) {
    if (this.available) localStorage.setItem(key, val)
    return Promise.resolve()
  }

  getItem(key) {
    let val = null
    if (this.available) val = localStorage.getItem(key)
    return Promise.resolve(val)
  }

  getAllKeys() {
    return Promise.resolve(this.available ?
      Object.keys(localStorage) : [])
  }

}

export default Storage
