"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var proto = _interopRequireWildcard(require("./proto"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Util =
/*#__PURE__*/
function () {
  function Util(provider, custom) {
    _classCallCheck(this, Util);

    _defineProperty(this, "_core", null);

    this._core = provider.get('__core__');

    for (var key in custom) {
      if (this[key]) {
        // eslint-disable-next-line no-console
        console.warn("Built-in util can't add existing \"".concat(key, "\""));
        continue;
      }

      this[key] = custom[key];
    }
  }

  _createClass(Util, [{
    key: "getStatics",
    value: function getStatics(prop) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _this$_core$collectio = this._core.collection,
          names = _this$_core$collectio.names,
          services = _this$_core$collectio.services;
      var result = {};
      names = this.invert(names);

      for (var i = 0; i < services.length; i++) {
        var service = services[i];

        if (service.async) {
          service = service()._service;
          if (!service) continue;
        }

        var value = service[prop];
        if (value === undefined) continue;

        if (options.merge) {
          Object.assign(result, value);
          continue;
        }

        result[names[i]] = value;
      }

      return result;
    }
  }, {
    key: "loadAsyncServices",
    value: function loadAsyncServices() {
      var _this$_core$collectio2 = this._core.collection,
          names = _this$_core$collectio2.names,
          services = _this$_core$collectio2.services;
      var toLoad = [];
      names = this.invert(names);

      for (var _len = arguments.length, serviceNames = new Array(_len), _key = 0; _key < _len; _key++) {
        serviceNames[_key] = arguments[_key];
      }

      for (var i = 0; i < services.length; i++) {
        var service = services[i];
        if (!service.async) continue;
        service = service();
        if (serviceNames.length && serviceNames.indexOf(names[i]) === -1) continue;
        toLoad.push(service.load());
      }

      return Promise.all(toLoad);
    }
  }]);

  return Util;
}();

_defineProperty(Util, "service", 'util');

Object.assign(Util.prototype, proto);
var _default = Util;
exports["default"] = _default;