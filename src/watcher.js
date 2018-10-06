const {
  FSWatcher
} = require('chokidar');

class Watcher {
  constructor(name, callback, option = {}) {

    this.name = name;
    this.option = option;
    this._callback = callback;

    this._watcher = this.init(name, callback);
  }

  init(name, callback) {
    let watcher = new FSWatcher(this.option);

    // watcher.on('raw', (event, path, details) => {
    //   callback(event, path, name)
    // })

    watcher
      .on('addDir', path => {
        callback('addDir', path, name)
      })
      .on('unlinkDir', path => {
        callback('unlinkDir', path, name)
      })
      .on('add', path => {
        callback('add', path, name)
      })
      .on('unlink', path => {
        callback('unlink', path, name)
      })
      .on('change', path => {
        callback('change', path, name)
      })
      .on('error', error => {
        callback('error', path, name)
      })

    return watcher;
  }

  add(...args) {
    this._watcher.add(args)
  }

  close() {
    let watcher = this._watcher;
    var watchedPaths = watcher.getWatched();
    watcher.unwatch(watchedPaths);
    watcher.close();
  }

  get watcher() {
    return this._watcher;
  }
}


module.exports = Watcher;