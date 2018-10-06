const path = require('path')
const {
  writeFile,
  writeFileSync,
} = require('fs');
const Watcher = require('./watcher.js');

class Cache {
  constructor(opt = {}) {
    if (this instanceof Cache === false) return new Cache(opt);
    this.namespace = opt.namespace || '__cache__';
    this.prefix = opt.prefix || '.__cache__.js';
    this._base = opt.base || process.cwd();

    this._watchers = [];
    this._parts = {};

    this._curPart = opt.name || '__';
    this._curWatcher = null;
    this._cache = {};

    this._cache[this._curPart] = {
      dirs: [],
      files: []
    };
    this._curCache = this._cache[this._curPart];
  }

  use(name, option = {}) {
    return this.useWatcher(name, option);
  }

  useWatcher(name, option = {}) {
    this._curPart = name;
    if (this._parts[name] == null) {
      //
      this._cache[this._curPart] = {
        dirs: [],
        files: []
      };

      this._curWatcher = new Watcher(name, this.watcherCallback.bind(this), option)

      this._parts[name] = this._curWatcher;
      this.addWatcher(this._curWatcher);
    }

    this._curCache = this._cache[this._curPart];
    this._curWatcher = this._parts[name];

    return this;
  }

  watcherCallback(eventName, path, name) {
    let curCache = this._cache[name];
    switch (eventName) {
      case 'addDir':
        {
          let paths = curCache.dirs,
            index = paths.indexOf(path);
          if (index === -1) {
            curCache.dirs.push(path)
            this.writeFileSync()
          }
        }
        break;
      case 'unlinkDir':
        {
          let paths = curCache.dirs,
            index = paths.indexOf(path);
          if (index > -1) {
            paths.splice(index, 1)
          }
          this.writeFileSync()
        }
        break;
      case 'add':
        {
          let paths = curCache.files,
            index = paths.indexOf(path);
          if (index === -1) {
            curCache.files.push(path)
            this.writeFileSync()
          }
        }
        break;
      case 'unlink':
        {
          let paths = curCache.files,
            index = paths.indexOf(path);
          if (index > -1) {
            paths.splice(index, 1)
          }
          this.writeFileSync()
        }
        break;
      default:
        {

        }
    }
  }

  checkWatcher() {
    if (this._curWatcher === null) {
      this.useWatcher(this._curPart)
    }
  }

  resolve(url) {
    return path.resolve(this._base, url);
  }

  addDir(dir) {
    this.checkWatcher()
    let dirPath = this.resolve(dir)
    this._curWatcher.add(dirPath);

    return this;
  }

  addDirs(dirs) {
    this.checkWatcher()
    dirs.map((dir) => {
      let dirPath = this.resolve(dir)
      this._curWatcher.add(dirPath);
    })

    return this;
  }

  addFile(file) {
    this.checkWatcher()
    let filePath = this.resolve(file)
    this._curWatcher.add(filePath);

    return this;
  }

  addFiles(files) {
    this.checkWatcher()
    files.map(file => {
      let filePath = this.resolve(file)
      this._curWatcher.add(filePath);
    })

    return this;
  }

  addWatcher(watcher) {
    let watchers = this._watchers;
    if (watchers.indexOf(watcher) < 0) {
      console.log(watchers.length)
      watchers.push(watcher)
    }
  }

  unWatcher(watcher) {
    let watchers = this._watchers,
      index = watchers.indexOf(watcher);
    if (index > -1) {
      watchers.splice(index, 1)
      watcher.close();
    }
  }

  // write the cache file
  writeFileSync() {
    writeFileSync(path.resolve(this._base, this.prefix), `module.exports = ${JSON.stringify(this._cache,undefined,2)}`);
  }

  addKeyValue(k, val) {
    this._cache[k] = val;
    this.writeFileSync()
  }

  get watcher() {
    return this._curWatcher.watcher;
  }

  get base() {
    return this._base;
  }

  set base(base) {
    return this._base = base;
  }


  debug() {
    console.log(this._cache)
  }
}

exports = module.exports = Cache;