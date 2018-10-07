const {
  FSWatcher
} = require('chokidar');

class Watcher {
  constructor(callback, option = {}) {

    this._option = option;
    this._callback = callback;

    this._watcher = this.init(callback);
  }

  init(callback) {
    let watcher = new FSWatcher(this._option);

    watcher
      .on('addDir', path => {
        callback('addDir', path)
      })
      .on('unlinkDir', path => {
        callback('unlinkDir', path)
      })
      .on('add', path => {
        callback('add', path)
      })
      .on('unlink', path => {
        callback('unlink', path)
      })
      .on('change', path => {
        callback('change', path)
      })
      .on('error', error => {
        callback('error', path)
      })

    return watcher;
  }

  add(args) {
    this._watcher.add(args)
  }

  remove(args) {
    this._watcher.unwatch(args)
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