const chokidar = require('chokidar');
const {
  readFile,
  writeFile,
} = require('fs');

class CacheLib {
  constructor(opt) {
    this.namespace = opt.namespace || '__cache__';
    this.cacheprefix = opt.cacheprefix || '.__cache__.js';
    this._cwd = opt.cwd || null;
    this._dirs = [];
    this._files = [];
    this._watchers = [];

    this.init();

  }

  init() {
    let cwd = this._cwd;
    if (cwd && cwd.length) {
      this.addDir(cwd);
    }
  }

  addDir(dir) {
    let watcher = chokidar.watch(dir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    // Full list of options. See below for descriptions. (do not use this example)
    // chokidar.watch('file', {
    //   persistent: true,

    //   ignored: '*.txt',
    //   ignoreInitial: false,
    //   followSymlinks: true,
    //   cwd: '.',
    //   disableGlobbing: false,

    //   usePolling: true,
    //   interval: 100,
    //   binaryInterval: 300,
    //   alwaysStat: false,
    //   depth: 99,
    //   awaitWriteFinish: {
    //     stabilityThreshold: 2000,
    //     pollInterval: 100
    //   },

    //   ignorePermissionErrors: false,
    //   atomic: true // or a custom 'atomicity delay', in milliseconds (default 100)
    // });

    var log = console.log.bind(console);


    watcher
      .on('addDir', path => log(`Directory ${path} has been added`))
      .on('unlinkDir', path => log(`Directory ${path} has been removed`))
      .on('error', error => log(`Watcher error: ${error}`))
      .on('ready', () => log('Initial scan complete. Ready for changes'))
      .on('raw', (event, path, details) => {
        log('Raw event info:', event, path, details);
      })
      .on('all', (event, path) => {
        console.log(event, path);
      })

    // watcher.on('change', (path, stats) => {
    //   if (stats) console.log(`File ${path} changed size to ${stats.size}`);
    // });

    // Watch new files.
    // watcher.add('new-file');
    // watcher.add(['new-file-2', 'new-file-3', '**/other-file*']);



    this.addWatcher(watcher);
  }

  addFile(file) {
    let watcher = chokidar.watch(file, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    var log = console.log.bind(console);

    watcher
      .on('add', path => log(`File ${path} has been added`))
      .on('change', path => log(`File ${path} has been changed`))
      .on('unlink', path => log(`File ${path} has been removed`));

    this.addWatcher(watcher);
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

  writeCache() {

  }

  readCache() {

  }
}

exports = module.exports = CacheLib;