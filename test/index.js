let Cache = require('../src/index');
let path = require('path');


let cache = new Cache({
  namespace: 'LIB',
  prefix: '.__cache.js',
  base: path.resolve(process.cwd(), 'test')
})

cache.addDir('example')
cache.addFile('file.js')
cache.addKV('k1', {
  a: 3,
  b: 4
})
cache.use('component').addDirs(['example1', 'example2']).addFiles(['file1.js', 'file2.js']);


cache.addKV('k', 'fff1w1e6r54w6e4r')
cache.addKV('k1', {
  a: 3,
  b: 4
})