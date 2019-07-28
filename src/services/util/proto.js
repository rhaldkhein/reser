import _set from 'lodash.set'

export function get(obj, path, defaultValue = null) {
  return String.prototype.split.call(path, /[,[\].]+?/)
    .filter(Boolean)
    .reduce((a, c) => (Object.hasOwnProperty.call(a, c) ? a[c] : defaultValue), obj)
}

export function set(obj, key, val) {
  return _set(obj, key, val)
}

export function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key]
    }
    return obj
  }, {})
}

export function isEmpty(obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length
}

export function mapObject(object, mapFn) {
  return Object.keys(object).reduce(function (result, key) {
    result[key] = mapFn(object[key])
    return result
  }, {})
}

export function isFunction(fn) {
  return typeof fn === 'function'
}

export function isConstructor(fn) {
  return typeof fn === 'function' && fn.hasOwnProperty('prototype')
}

export function invert(obj) {
  let ret = {}
  for (let key in obj) ret[obj[key]] = key
  return ret
}
