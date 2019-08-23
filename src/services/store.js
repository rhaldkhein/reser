import { createStore, combineReducers } from 'redux'

export default class Store {
  static service = 'store'

  base = null
  _namespace = 'rsrx:'
  _collection = null
  _config = null
  _reducers = null
  _storage = null
  _util = null

  constructor(provider, config = {}) {
    if (config.namespace) this._namespace += config.namespace + ':'
    this._config = config
    this._storage = provider.service('storage')
    this._util = provider.service('util')
    this._collection = provider.service('core').collection
    this._reducers = this._util.getStatics('reducer')
  }

  _defaultConfig(arg) {
    return {
      store: createStore(
        arg.rootReducer,
        arg.initialState
      )
    }
  }

  _getInitialState() {
    let state = {}
    let storage = this._storage
    if (storage) {
      return storage.getAllKeys()
        .then(keys => {
          const toGet = []
          keys.sort((a, b) => a.length - b.length)
          keys.forEach(key => {
            if (!key.startsWith(this._namespace)) return
            const path = key.split(':')[1]
            // Async service should not be added in initial state
            toGet.push(
              storage.getItem(key).then(value => {
                this._util.set(state, path, JSON.parse(value))
              })
            )
          })
          return Promise.all(toGet)
        })
        .then(() => state)
    }
    return Promise.resolve({})
  }

  _createStore() {
    return Promise.resolve()
      .then(() => this._getInitialState())
      .then(state => {
        let arg = {
          rootReducer: this._util.isEmpty(this._reducers) ?
            s => s :
            combineReducers(this._reducers),
          initialState: state
        }
        let result = (
          typeof this._config === 'function' ?
            this._config(arg) :
            this._defaultConfig(arg)
        )
        this._setStore(result.store)
      })
  }

  _setStore(store) {
    this.base = store
    const { names, services } = this._collection
    for (const name in names) {
      if (!names.hasOwnProperty(name)) continue
      const service = services[names[name]].value
      if (service.persist) {
        this._persistService(service, name)
      }
    }
  }

  _persistService(service, name) {
    if (service.persist === undefined) return
    if (!name) throw new Error('Persistent service must have name')
    // Write to storage
    if (service.persist === true) {
      // Persist whole service
      this._persistState(name)
    } else {
      // Should be array, persist by keys
      service.persist.forEach(path => {
        this._persistState(name + '.' + path)
      })
    }
    // Mutate reducer
    this.base.replaceReducer(
      combineReducers({
        ...this._reducers,
        [name]: service.reducer
      })
    )
  }

  _persistState(path) {
    let lastState
    let storage = this._storage
    let { get } = this._util
    let handleChange = () => {
      let currentState = get(this.state, path)
      if (currentState !== lastState) {
        lastState = currentState
        // Write to storage
        if (storage && path)
          storage.setItem(this._namespace + path, JSON.stringify(currentState))
      }
    }
    let unsubscribe = this.base.subscribe(handleChange)
    handleChange()
    return unsubscribe
  }

  get isReady() {
    return !!this.base
  }

  getStore() {
    return this.base
  }

  getState() {
    return this.state
  }

  dispatch(action) {
    return this.base.dispatch(action)
  }

  replaceReducer(nextReducer) {
    return this.base.replaceReducer(nextReducer)
  }

  subscribe(listener) {
    return this.base.subscribe(listener)
  }

  stateOf(name) {
    return this.state[name]
  }

  get state() {
    return this.base.getState()
  }

  static start(provider) {
    const store = provider.service('store')
    return store._createStore()
  }

}
