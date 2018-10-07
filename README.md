# cache

> cache file path , and cache some variable

- npm i --save @huangzj/cache

#### API

- use(namespace)
- addFile(filepath)
- addFiles([filepath])
- addDir(dirpath)
- addDirs([dirpath])
- addKV(key, value)
- debug()

#### e.g.
```
let Cache = require('@huangzj/cache');
let path = require('path');


let cache = new Cache({
  namespace: 'LIB',
  prefix: '.__cache.js',
  base: path.resolve(process.cwd(), 'test')
})

cache.addDir('example')
cache.addFile('file.js')

cache.use('component').addDirs(['example1', 'example2']).addFiles(['file1.js', 'file2.js']);

cache.addKeyValue('k', 'fff1w1e6r54w6e4r')
cache.addKeyValue('k1', {
  a: 3,
  b: 4
})

```
