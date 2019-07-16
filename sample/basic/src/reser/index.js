"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withContainer = withContainer;
exports.withService = withService;
exports.withState = withState;
exports.andState = exports.andService = exports.and = and;
exports.createContainer = createContainer;
Object.defineProperty(exports, "StorageService", {
  enumerable: true,
  get: function get() {
    return _storage["default"];
  }
});
Object.defineProperty(exports, "StoreService", {
  enumerable: true,
  get: function get() {
    return _store["default"];
  }
});

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _jservice = _interopRequireDefault(require("jservice"));

var _collection = _interopRequireDefault(require("./collection"));

var _provider = _interopRequireDefault(require("./provider"));

var UtilService = _interopRequireWildcard(require("./services/util"));

var _storage = _interopRequireDefault(require("./services/storage"));

var _store = _interopRequireDefault(require("./services/store"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// DI container contexts
var ContainerContext = _react["default"].createContext();

var AsyncCountContext = _react["default"].createContext(0);

var ReactServices =
/*#__PURE__*/
function (_BaseBuilder) {
  _inherits(ReactServices, _BaseBuilder);

  function ReactServices() {
    var _this;

    _classCallCheck(this, ReactServices);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactServices).call(this));
    _this.collection = new _collection["default"](_assertThisInitialized(_this));
    _this.provider = new _provider["default"](_this.collection);
    return _this;
  }

  _createClass(ReactServices, [{
    key: "createScopedProvider",
    value: function createScopedProvider() {
      throw new Error('Scoped providers are not supported yet');
    }
  }]);

  return ReactServices;
}(_jservice["default"]);

function createContainer() {
  return new ReactServices().build(function (services) {
    services.add(UtilService, '__util__');
    services.add(_storage["default"]);
    services.add(_store["default"]);
  });
}

function mapStateToProps(serviceNames, state) {
  return serviceNames.reduce(function (result, name) {
    var val = state[name];
    if (val) result[name] = val;
    return result;
  }, {});
}

function withContainer(registry) {
  return function (ChildComponent) {
    return (
      /*#__PURE__*/
      function (_React$Component) {
        _inherits(_class, _React$Component);

        function _class(props) {
          var _this2;

          _classCallCheck(this, _class);

          _this2 = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
          _this2.state = {
            count: 0
          };
          _this2.container = createContainer().build(registry);

          _this2.container.start().then(function () {
            return _this2.forceUpdate();
          });

          _this2.contextValue = {
            provider: _this2.container.provider,
            asyncLoaded: function asyncLoaded() {
              _this2.setState({
                count: _this2.state.count + 1
              });
            }
          };
          return _this2;
        }

        _createClass(_class, [{
          key: "render",
          value: function render() {
            var store = this.container.provider.service('store').getStore();

            var childElement = _react["default"].createElement(ChildComponent, _objectSpread({
              container: this.container
            }, this.props));

            return _react["default"].createElement(ContainerContext.Provider, {
              value: this.contextValue
            }, _react["default"].createElement(AsyncCountContext.Provider, {
              value: this.state.count
            }, !store ? childElement : _react["default"].createElement(_reactRedux.Provider, {
              store: store
            }, childElement)));
          }
        }]);

        return _class;
      }(_react["default"].Component)
    );
  };
}

function withService() {
  for (var _len = arguments.length, serviceNames = new Array(_len), _key = 0; _key < _len; _key++) {
    serviceNames[_key] = arguments[_key];
  }

  return function (ChildComponent) {
    if (Array.isArray(serviceNames[serviceNames.length - 1])) {
      var states = serviceNames.pop();
      ChildComponent = withState.apply(null, states.length ? states : serviceNames)(ChildComponent);
    }

    return function (props) {
      return _react["default"].createElement(ContainerContext.Consumer, null, function (container) {
        return _react["default"].createElement(AsyncCountContext.Consumer, null, function () {
          return _react["default"].createElement(ChildComponent, _objectSpread({
            services: container.provider.createServices(serviceNames, container.asyncLoaded)
          }, props));
        });
      });
    };
  };
}

function withState() {
  for (var _len2 = arguments.length, serviceNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    serviceNames[_key2] = arguments[_key2];
  }

  return function (ChildComponent) {
    if (Array.isArray(serviceNames[serviceNames.length - 1])) {
      var services = serviceNames.pop();
      ChildComponent = withService.apply(null, services.length ? services : serviceNames)(ChildComponent);
    }

    return (0, _reactRedux.connect)(function (state) {
      return {
        state: typeof serviceNames[0] === 'function' ? serviceNames[0](state) : mapStateToProps(serviceNames, state)
      };
    })(ChildComponent);
  };
}

function and() {
  for (var _len3 = arguments.length, serviceNames = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    serviceNames[_key3] = arguments[_key3];
  }

  return Array.isArray(serviceNames[0]) ? serviceNames[0] : serviceNames;
}