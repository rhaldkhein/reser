import { createStore, combineReducers } from 'redux'

export default class Store {
  static service = '@store'

  _prefix = 'jsvc:'
  _core = null
  _config = null
  _reducers = null
  _storage = null
  _store = null
  _util = null

  constructor(provider, config) {
    this._config = config
    this._storage = provider.service('@storage')
    this._util = provider.service('@util')
    this._core = provider.service('__core__')
    const { names, services } = this._core.collection
    let reducers = {}
    for (const name in names) {
      if (names.hasOwnProperty(name)) {
        const service = services[names[name]]
        if (service.reducer)
          reducers[name] = service.reducer
      }
    }
    this._reducers = reducers
  }

  _defaultConfig(arg) {
    return {
      store: createStore(
        arg.rootReducer || (s => s),
        arg.initialState || {}
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
          keys.forEach(key => {
            if (!key.startsWith(this._prefix)) return
            const path = key.split(':')[1]
            toGet.push(
              storage.getItem(key).then(value => {
                try {
                  this._util.set(state, path, JSON.parse(value))
                } catch (error) {
                  // TODO: put something here
                }
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
          rootReducer: combineReducers(this._reducers),
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
    this._store = store
    const { names, services } = this._core.collection
    for (const name in names) {
      if (!names.hasOwnProperty(name)) continue
      const service = services[names[name]]
      if (service.persist) {
        this._persistService(service)
      }
    }
  }

  _persistService(service) {
    if (service.persist === true) {
      // Persist whole service
      this._persistState(service.service)
    } else {
      // Should be array, persist by keys
      service.persist.forEach(path => {
        this._persistState(service.service + '.' + path)
      })
    }
  }

  _persistState(path) {
    let lastState
    let storage = this._storage
    let { get } = this._util
    let handleChange = () => {
      let currentState = get(this._store.getState(), path)
      if (currentState !== lastState) {
        lastState = currentState
        // Write to storage
        if (storage && path)
          storage.setItem(this._prefix + path, JSON.stringify(currentState))
      }
    }
    let unsubscribe = this._store.subscribe(handleChange)
    handleChange()
    return unsubscribe
  }

  getStore() {
    return this._store
  }

  getState() {
    return this._store.getState()
  }

  dispatch(action) {
    return this._store.dispatch(action)
  }

  static start(provider) {
    const store = provider.service('@store')
    return store._createStore()
  }

}
