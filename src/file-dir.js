const path = require('path')
const NS = require('./ns.js');
const Watcher = require('./watcher.js');

class FileDir extends NS {
  constructor(namespace, base, callback, option) {
    super(namespace);
    this._curWatcher = null;
    this._callback = callback;
    this._option = option;
    this._base = base;
    this._dirs = [];
    this._files = [];

    this.init();
  }

  get watcher() {
    return this._curWatcher;
  }

  init() {
    this._curWatcher = new Watcher(this.watcherCallback.bind(this), this._option)
  }

  resolve(url) {
    return path.resolve(this._base, url);
  }

  addDir(path, isWatcher = true) {
    path = this.resolve(path);
    let index = this._dirs.indexOf(path);
    if (index === -1) {
      isWatcher ? this._curWatcher.add(path) : this._dirs.push(path)
    }
  }

  removeDir(path, isWatcher = true) {
    let index = this._dirs.indexOf(path);
    if (index > -1) {
      isWatcher ? this._curWatcher.remove(path) : this._dirs.splice(index, 1)
    }
  }

  addDirs(paths, isWatcher = true) {
    if (Object.prototype.toString.call(paths) !== "[object Array]") {
      this.error(`${paths} not Array`)
      return;
    }

    paths.forEach(path => {
      path = this.resolve(path);
      let index = this._dirs.indexOf(path);
      if (index === -1) {
        isWatcher ? this._curWatcher.add(path) : this._dirs.push(path)
      }
    });
  }

  addFile(path, isWatcher = true) {
    path = this.resolve(path);
    let index = this._files.indexOf(path);
    if (index === -1) {
      isWatcher ? this._curWatcher.add(path) : this._files.push(path)
    }
  }

  removeFile(path, isWatcher = true) {
    let index = this._files.indexOf(path);
    if (index > -1) {
      isWatcher ? this._curWatcher.remove(path) : this._files.splice(index, 1)
    }
  }

  addFiles(paths, isWatcher = true) {
    if (Object.prototype.toString.call(paths) !== "[object Array]") {
      this.error(`${paths} not Array`)
      return;
    }

    paths.forEach(path => {
      path = this.resolve(path);
      let index = this._files.indexOf(path);
      if (index === -1) {
        isWatcher ? this._curWatcher.add(path) : this._files.push(path)
      }
    });
  }

  watcherCallback(event, path) {
    switch (event) {
      case 'addDir':
        {
          this.addDir(path, false);
          this._callback();
        }
        break;
      case 'unlinkDir':
        {
          this.removeDir(path, false);
          this._callback();
        }
        break;
      case 'add':
        {
          this.addFile(path, false);
          this._callback();
        }
        break;
      case 'unlink':
        {
          this.removeFile(path, false);
          this._callback();
        }
        break;
      default:
        {

        }
    }
  }

  toJson() {
    return {
      '_dirs': this._dirs,
      '_files': this._files
    }
  }
}



exports = module.exports = FileDir;