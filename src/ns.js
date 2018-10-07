class NS {

  constructor(namespace) {
    this._curNS = namespace || null;
  }

  use(namespace) {
    this._curNS = namespace;
  }

  get ns() {
    return this._curNS;
  }

  error(msg) {
    throw new Error(msg);
  }
}

module.exports = exports = NS;