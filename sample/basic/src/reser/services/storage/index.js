"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _local = _interopRequireDefault(require("./local"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Storage =
/*#__PURE__*/
function () {
  function Storage(provider, config) {
    _classCallCheck(this, Storage);

    _defineProperty(this, "adapter", null);

    var result = typeof config === 'function' ? config() : this._defaultConfig();
    this.adapter = result.adapter;
  }

  _createClass(Storage, [{
    key: "_defaultConfig",
    value: function _defaultConfig() {
      return {
        adapter: new _local["default"]()
      };
    }
  }, {
    key: "setItem",
    value: function setItem(key, val) {
      return this.adapter.setItem(key, val);
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      return this.adapter.getItem(key);
    }
  }, {
    key: "getAllKeys",
    value: function getAllKeys() {
      return this.adapter.getAllKeys();
    }
  }]);

  return Storage;
}();

_defineProperty(Storage, "service", 'storage');

var _default = Storage;
exports["default"] = _default;