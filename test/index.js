let CacheLib = require('../src/index');
let path = require('path');


let cache = new CacheLib({
  namespace: '',
  prefix: '__cache.js',
  base: path.resolve(process.cwd(), 'test'),
  dirs: [],
  files: []
})

cache.addDir('example')
cache.addFile('file.js')
cache.debug();

cache.use('component').addDirs(['example1', 'example1']).addFiles(['file1.js', 'file2.js']).debug();