# cache

> cache file path , and cache some variable

- npm i --save @huangzj/cache

#### config

- defaultNS:
- prefix:
- base:
- format:

#### API

- use(namespace)
- addFile(filepath)
- addFiles([filepath])
- addDir(dirpath)
- addDirs([dirpath])
- addKV(key, value)
- toJson()
- debug()

#### e.g.
```
let Cache = require('@huangzj/cache');
let path = require('path');


let cache = new Cache({
  defaultNS: 'default',
  prefix: '.__cache.js',
  base: path.resolve(process.cwd(), 'test'),
  format: (data) => {
    return `module.exports = ${JSON.stringify(data, undefined,2)}`;
  }
})

cache.addDir('example')
cache.addFile('file.js')
cache.addKV('k1', {
  a: 3,
  b: 4
})

cache.b = 1;
cache.use('component').addDirs(['example1', 'example2']).addFiles(['file1.js', 'file2.js']);


cache.addKV('k', 'fff1w1e6r54w6e4r')
cache.addKV('k1', {
  a: 3,
  b: 4
})

cache.use('__').a = 1;
cosole.log(cache.toJson())

cache.watcher.on('change', () => {
  console.log('change...')
})

cache.use('default').watcher.on('change', () => {
  console.log('change...')
})
```
