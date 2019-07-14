"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Store =
/*#__PURE__*/
function () {
  function Store(provider, config) {
    _classCallCheck(this, Store);

    _defineProperty(this, "_prefix", 'jsvc:');

    _defineProperty(this, "_core", null);

    _defineProperty(this, "_config", null);

    _defineProperty(this, "_reducers", null);

    _defineProperty(this, "_storage", null);

    _defineProperty(this, "_store", null);

    _defineProperty(this, "_util", null);

    this._config = config;
    this._storage = provider.service('@storage');
    this._util = provider.service('@util');
    this._core = provider.service('__core__');
    var _this$_core$collectio = this._core.collection,
        names = _this$_core$collectio.names,
        services = _this$_core$collectio.services;
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
          keys.forEach(function (key) {
            if (!key.startsWith(_this._prefix)) return;
            var path = key.split(':')[1];
            toGet.push(storage.getItem(key).then(function (value) {
              try {
                _this._util.set(state, path, JSON.parse(value));
              } catch (error) {// TODO: put something here
              }
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
      this._store = store;
      var _this$_core$collectio2 = this._core.collection,
          names = _this$_core$collectio2.names,
          services = _this$_core$collectio2.services;

      for (var name in names) {
        if (!names.hasOwnProperty(name)) continue;
        var service = services[names[name]];

        if (service.persist) {
          this._persistService(service);
        }
      }
    }
  }, {
    key: "_persistService",
    value: function _persistService(service) {
      var _this3 = this;

      if (service.persist === true) {
        // Persist whole service
        this._persistState(service.service);
      } else {
        // Should be array, persist by keys
        service.persist.forEach(function (path) {
          _this3._persistState(service.service + '.' + path);
        });
      }
    }
  }, {
    key: "_persistState",
    value: function _persistState(path) {
      var _this4 = this;

      var lastState;
      var storage = this._storage;
      var get = this._util.get;

      var handleChange = function handleChange() {
        var currentState = get(_this4._store.getState(), path);

        if (currentState !== lastState) {
          lastState = currentState; // Write to storage

          if (storage && path) storage.setItem(_this4._prefix + path, JSON.stringify(currentState));
        }
      };

      var unsubscribe = this._store.subscribe(handleChange);

      handleChange();
      return unsubscribe;
    }
  }, {
    key: "getStore",
    value: function getStore() {
      return this._store;
    }
  }, {
    key: "getState",
    value: function getState() {
      return this._store.getState();
    }
  }, {
    key: "dispatch",
    value: function dispatch(action) {
      return this._store.dispatch(action);
    }
  }], [{
    key: "start",
    value: function start(provider) {
      var store = provider.service('@store');
      return store._createStore();
    }
  }]);

  return Store;
}();

exports["default"] = Store;

_defineProperty(Store, "service", '@store');