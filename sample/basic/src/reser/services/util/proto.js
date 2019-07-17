"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.set = set;
exports.pick = pick;
exports.isEmpty = isEmpty;
exports.mapObject = mapObject;
exports.isFunction = isFunction;
exports.isConstructor = isConstructor;
exports.invert = invert;

var _lodash = _interopRequireDefault(require("lodash.set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function get(obj, path) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  return String.prototype.split.call(path, /[,[\].]+?/).filter(Boolean).reduce(function (a, c) {
    return Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue;
  }, obj);
}

function set(obj, key, val) {
  return (0, _lodash["default"])(obj, key, val);
}

function pick(object, keys) {
  return keys.reduce(function (obj, key) {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }

    return obj;
  }, {});
}

function isEmpty(obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}

function mapObject(object, mapFn) {
  return Object.keys(object).reduce(function (result, key) {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isConstructor(fn) {
  return typeof fn === 'function' && fn.hasOwnProperty('prototype');
}

function invert(obj) {
  var ret = {};

  for (var key in obj) {
    ret[obj[key]] = key;
  }

  return ret;
}