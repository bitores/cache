# cache

#### API

- addFile
- addFiles
- addDir
- addDirs
- debug

#### e.g.
```
let Cache = require('../src/index');
let path = require('path');


let cache = new Cache({
  namespace: 'LIB',
  prefix: '.__cache.js',
  base: path.resolve(process.cwd(), 'test')
})

cache.addDir('example')
cache.addFile('file.js')

cache.use('component').addDirs(['example1', 'example2']).addFiles(['file1.js', 'file2.js']);

cache.watcher.on('change', (path) => {
  // cache.debug()
})
```
