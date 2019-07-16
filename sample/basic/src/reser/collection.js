"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jservice = require("jservice");

var _util = require("./services/util");

var _loader = _interopRequireDefault(require("./loader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ServiceCollection =
/*#__PURE__*/
function (_BaseServiceCollectio) {
  _inherits(ServiceCollection, _BaseServiceCollectio);

  function ServiceCollection(core) {
    var _this;

    _classCallCheck(this, ServiceCollection);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ServiceCollection).call(this, core));
    _this._core = core;
    return _this;
  }

  _createClass(ServiceCollection, [{
    key: "_push",
    value: function _push(Service, name, config, skip) {
      // Check if service is async or not
      if ((0, _util.isFunction)(Service) && !(0, _util.isConstructor)(Service)) {
        // Async service
        Service.service = name;
        var loader = new _loader["default"](this._core.provider, Service, name, config);

        var LoaderService = function LoaderService() {
          return loader;
        };

        LoaderService.type = Service.type;
        LoaderService.service = name;
        LoaderService.async = true;
        Service = LoaderService;
      }

      _get(_getPrototypeOf(ServiceCollection.prototype), "_push", this).call(this, Service, name, config, skip);
    }
  }, {
    key: "isAsyncService",
    value: function isAsyncService(name) {
      var names = this.names,
          services = this.services;

      for (var key in names) {
        if (names.hasOwnProperty(key) && key === name) {
          return services[names[key]].async || false;
        }
      }

      return true;
    }
  }, {
    key: "scoped",
    value: function scoped() {
      throw new Error('Scoped services are not supported yet');
    }
  }, {
    key: "transient",
    value: function transient() {
      throw new Error('Transient services are not supported yet');
    }
  }]);

  return ServiceCollection;
}(_jservice.ServiceCollection);

var _default = ServiceCollection;
exports["default"] = _default;