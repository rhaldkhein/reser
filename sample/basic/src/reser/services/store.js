"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Store =
/*#__PURE__*/
function () {
  function Store(provider, config) {
    _classCallCheck(this, Store);

    _defineProperty(this, "base", null);

    _defineProperty(this, "_namespace", 'rsrx:');

    _defineProperty(this, "_collection", null);

    _defineProperty(this, "_config", null);

    _defineProperty(this, "_reducers", null);

    _defineProperty(this, "_storage", null);

    _defineProperty(this, "_util", null);

    this._config = config;
    this._storage = provider.service('storage');
    this._util = provider.service('__util__');
    this._collection = provider.service('__core__').collection;
    var _this$_collection = this._collection,
        names = _this$_collection.names,
        services = _this$_collection.services;
    var reducers = {};

    for (var name in names) {
      if (names.hasOwnProperty(name)) {
        var service = services[names[name]];
        if (service.reducer) reducers[name] = service.reducer;
      }
    }

    this._reducers = reducers;
  }

  _createClass(Store, [{
    key: "_defaultConfig",
    value: function _defaultConfig(arg) {
      return {
        store: (0, _redux.createStore)(arg.rootReducer || function (s) {
          return s;
        }, arg.initialState || {})
      };
    }
  }, {
    key: "_getInitialState",
    value: function _getInitialState() {
      var _this = this;

      var state = {};
      var storage = this._storage;

      if (storage) {
        return storage.getAllKeys().then(function (keys) {
          var toGet = [];
          keys.sort(function (a, b) {
            return a.length - b.length;
          });
          keys.forEach(function (key) {
            if (!key.startsWith(_this._namespace)) return;
            var path = key.split(':')[1]; // Async service should not be added in initial state

            toGet.push(storage.getItem(key).then(function (value) {
              _this._util.set(state, path, JSON.parse(value));
            }));
          });
          return Promise.all(toGet);
        }).then(function () {
          return state;
        });
      }

      return Promise.resolve({});
    }
  }, {
    key: "_createStore",
    value: function _createStore() {
      var _this2 = this;

      return Promise.resolve().then(function () {
        return _this2._getInitialState();
      }).then(function (state) {
        var arg = {
          rootReducer: (0, _redux.combineReducers)(_this2._reducers),
          initialState: state
        };
        var result = typeof _this2._config === 'function' ? _this2._config(arg) : _this2._defaultConfig(arg);

        _this2._setStore(result.store);
      });
    }
  }, {
    key: "_setStore",
    value: function _setStore(store) {
      this.base = store;
      var _this$_collection2 = this._collection,
          names = _this$_collection2.names,
          services = _this$_collection2.services;

      for (var name in names) {
        if (!names.hasOwnProperty(name)) continue;
        var service = services[names[name]];

        if (service.persist) {
          this._persistService(service, name);
        }
      }
    }
  }, {
    key: "_persistService",
    value: function _persistService(service, name) {
      var _this3 = this;

      if (service.persist === undefined) return;
      if (!name) throw new Error('Persistent service must have name'); // Write to storage

      if (service.persist === true) {
        // Persist whole service
        this._persistState(name);
      } else {
        // Should be array, persist by keys
        service.persist.forEach(function (path) {
          _this3._persistState(name + '.' + path);
        });
      } // Mutate reducer


      this.base.replaceReducer((0, _redux.combineReducers)(_objectSpread({}, this._reducers, _defineProperty({}, name, service.reducer))));
    }
  }, {
    key: "_persistState",
    value: function _persistState(path) {
      var _this4 = this;

      var lastState;
      var storage = this._storage;
      var get = this._util.get;

      var handleChange = function handleChange() {
        var currentState = get(_this4.base.getState(), path);

        if (currentState !== lastState) {
          lastState = currentState; // Write to storage

          if (storage && path) storage.setItem(_this4._namespace + path, JSON.stringify(currentState));
        }
      };

      var unsubscribe = this.base.subscribe(handleChange);
      handleChange();
      return unsubscribe;
    }
  }, {
    key: "getStore",
    value: function getStore() {
      return this.base;
    }
  }, {
    key: "getState",
    value: function getState() {
      return this.base.getState();
    }
  }, {
    key: "dispatch",
    value: function dispatch(action) {
      return this.base.dispatch(action);
    }
  }, {
    key: "replaceReducer",
    value: function replaceReducer(nextReducer) {
      return this.base.replaceReducer(nextReducer);
    }
  }, {
    key: "subscribe",
    value: function subscribe(listener) {
      return this.base.subscribe(listener);
    }
  }], [{
    key: "start",
    value: function start(provider) {
      var store = provider.service('store');
      return store._createStore();
    }
  }]);

  return Store;
}();

exports["default"] = Store;

_defineProperty(Store, "service", 'store');