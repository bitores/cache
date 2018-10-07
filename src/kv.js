const NS = require('./ns.js');

class KV extends NS {
  constructor(namespace) {
    super(namespace);
    this._kvs = {};
  }

  add(key, value) {
    this._kvs[key] = value;
  }

  get(key) {
    return this._kvs[key];
  }

  toJson() {
    return this._kvs;
  }
}


exports = module.exports = KV;