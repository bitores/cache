const {
  writeFile,
  writeFileSync,
} = require('fs');
const path = require('path')
const NS = require('./ns.js');

const KV = require('./kv.js');
const FD = require('./file-dir.js');

class Cache {
  constructor(option = {}) {
    if (this instanceof Cache === false) return new Cache(option);
    this.defaultNS = option.defaultNS || 'default';
    this.watcherOption = option.watcherOption || {};
    this.prefix = option.prefix || '.__cache__.js';
    this._base = option.base || process.cwd();
    this.format = option.format;
    this._cache = {};

    this.use(this.defaultNS)



    return new Proxy(this, {
      set: (target, key, value, receiver) => {
        if (key in target) return target[key] = value;
        else return target.addKV(key, value);
      },
      get: (target, property, receiver) => {
        if (property in target) {
          return target[property];
        }
        return target.getKV(property);
      }
    })
  }

  use(namespace) {

    if (this._cache.hasOwnProperty(namespace) === false) {
      this._cache[namespace] = {
        fd: new FD(namespace, this._base, this.writeFileSync.bind(this), this.watcherOption),
        kv: new KV(namespace)
      }
      this.writeFileSync();
    }

    this._curNS = this._cache[namespace];

    return this;
  }

  addDir(path) {
    this._curNS['fd'].addDir(path);
    return this;
  }

  addDirs(paths) {
    this._curNS['fd'].addDirs(paths);
    return this;
  }

  addFile(path) {
    this._curNS['fd'].addFile(path);
    return this;
  }

  addFiles(paths) {
    this._curNS['fd'].addFiles(paths);
    return this;
  }

  addKV(k, v) {
    this._curNS['kv'].add(k, v);
    return this;
  }

  getKV(k) {
    return this._curNS['kv'].get(k)
  }

  // write the cache file
  writeFileSync() {
    let pre = this.format && this.format(this.toJson());
    let content = pre ? pre : `module.exports = ${JSON.stringify(this.toJson(),undefined,2)}`;
    writeFileSync(path.resolve(this._base, this.prefix), content);
  }

  toJson() {
    let ret = {},
      cache = this._cache;
    for (let ns in cache) {
      let _fdCache = cache[ns]['fd'],
        _kvCache = cache[ns]['kv'];

      ret[ns] = {
        ..._fdCache.toJson(),
        ..._kvCache.toJson()
      }
    }

    return ret;
  }

  get watcher() {
    return this._curNS['fd'].watcher.watcher;
  }

  debug() {
    console.log(this.toJson())
  }
}


exports = module.exports = Cache;