const {
  FSWatcher
} = require('chokidar');
const path = require('path')
const {
  readFile,
  writeFile,
} = require('fs');

class CacheLib {
  constructor(opt) {
    if (this instanceof CacheLib === false) return new CacheLib(opt);
    this.namespace = opt.namespace || '__cache__';
    this.prefix = opt.prefix || '.__cache__.js';
    this.base = opt.base || process.cwd();
    this._dirs = [];
    this._files = [];
    this._watchers = [];
    this._parts = {};

    this._curPart = opt.name || 'root';
    this._curWatcher = null;
  }

  use(name) {
    return this.useWatcher(name);
  }

  useWatcher(name) {
    this._curPart = name;
    if (this._parts[name] == null) {
      this._curWatcher = new FSWatcher({
        ignored: /(^|[\/\\])\../,
        persistent: true
      });

      var log = console.log.bind(console);
      this._curWatcher
        .on('addDir', path => {
          log(`Directory ${path} has been added`)
          this._dirs.push(path)
        })
        .on('unlinkDir', path => {
          log(`Directory ${path} has been removed`)
        })
        .on('add', path => {
          log(`File ${path} has been added`)
          this._files.push(path)
        })
        .on('unlink', path => {
          log(`File ${path} has been removed`)
        })
        .on('change', path => {
          log(`File ${path} has been changed`)
        })
        .on('error', error => {
          log(`Watcher error: ${error}`)
        })

      this._parts[name] = this._curWatcher;
      this.addWatcher(this._curWatcher);
    }

    this._curWatcher = this._parts[name];
    console.log(name, this._curWatcher)

    return this;
  }

  checkWatcher() {
    if (this._curWatcher === null) {
      this.useWatcher(this._curPart)
    }
  }

  addDir(dir) {
    this.checkWatcher()
    let dirPath = path.resolve(this.base, dir)
    this._curWatcher.add(dirPath);
    // this._dirs.push(dirPath);
    return this;
  }

  addDirs(dirs) {
    this.checkWatcher()
    dirs.map((dir) => {
      let dirPath = path.resolve(this.base, dir)
      this._curWatcher.add(dirPath);
      // this._dirs.push(dirPath);
    })

    return this;
  }

  addFile(file) {
    this.checkWatcher()
    let filePath = path.resolve(this.base, file)
    this._curWatcher.add(filePath);
    // this._files.push(filePath)
    return this;
  }

  addFiles(files) {
    this.checkWatcher()
    files.map(file => {
      let filePath = path.resolve(this.base, file)
      this._curWatcher.add(filePath);
      // this._files.push(filePath)
    })
    return this;
  }

  addWatcher(watcher) {
    let watchers = this._watchers;
    if (watchers.indexOf(watcher) < 0) {
      watchers.push(watcher)
    }
  }

  unWatcher(watcher) {
    let watchers = this._watchers,
      index = watchers.indexOf(watcher);
    if (index > -1) {
      watchers.splice(index, 1)

      // Get list of actual paths being watched on the filesystem
      var watchedPaths = watcher.getWatched();

      // Un-watch some files.
      watcher.unwatch(watchedPaths);

      // Stop watching.
      watcher.close();
    }
  }

  debug() {
    console.log()
  }
}

exports = module.exports = CacheLib;