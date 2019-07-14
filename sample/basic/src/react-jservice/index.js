"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withContainer = withContainer;
exports.withService = withService;
exports.createContainer = createContainer;

var _react = _interopRequireDefault(require("react"));

var _jservice = _interopRequireDefault(require("jservice"));

var _collection = _interopRequireDefault(require("./collection"));

var _provider = _interopRequireDefault(require("./provider"));

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

var ContainerContext = _react["default"].createContext();

var ReactJService =
/*#__PURE__*/
function (_BaseBuilder) {
  _inherits(ReactJService, _BaseBuilder);

  function ReactJService() {
    var _this;

    _classCallCheck(this, ReactJService);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactJService).call(this));
    _this.collection = new _collection["default"](_assertThisInitialized(_this));
    _this.provider = new _provider["default"](_this.collection);
    return _this;
  }

  _createClass(ReactJService, [{
    key: "createScopedProvider",
    value: function createScopedProvider() {
      throw new Error('Scoped providers are not supported yet');
    }
  }]);

  return ReactJService;
}(_jservice["default"]);

function createContainer() {
  return new ReactJService();
}

function withContainer(ChildComponent, registry) {
  return (
    /*#__PURE__*/
    function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class(props) {
        var _this2;

        _classCallCheck(this, _class);

        _this2 = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, props));
        _this2.state = {};
        _this2.container = createContainer().build(registry);
        _this2.contextValue = {
          provider: _this2.container.provider,
          asyncLoaded: function asyncLoaded() {
            _this2.setState({});
          }
        };
        return _this2;
      }

      _createClass(_class, [{
        key: "render",
        value: function render() {
          return _react["default"].createElement(ContainerContext.Provider, {
            value: this.contextValue
          }, _react["default"].createElement(ChildComponent, _objectSpread({
            container: this.container
          }, this.props)));
        }
      }]);

      return _class;
    }(_react["default"].Component)
  );
}

function withService(ChildComponent) {
  for (var _len = arguments.length, serviceNames = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    serviceNames[_key - 1] = arguments[_key];
  }

  return function (props) {
    return _react["default"].createElement(ContainerContext.Consumer, null, function (container) {
      return _react["default"].createElement(ChildComponent, _objectSpread({
        services: container.provider.createServices(serviceNames, container.asyncLoaded)
      }, props));
    });
  };
}