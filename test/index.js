let CacheLib = require('../src/index');


let cache = new CacheLib({
  namespace: '',
  prefix: '__cache.js',
  cwd: `${process.cwd()}/test/example`
})