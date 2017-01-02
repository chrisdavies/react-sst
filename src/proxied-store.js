module.exports = getProxyConstructor;

function getProxyConstructor(store) {
  function Proxy() {
    this.$keys = {};
    this.$state = store.getState();
  }

  addProxyGetters(Proxy.prototype, store.getState());

  return Proxy;
}

function addProxyGetters(prot, state) {
  for (var prop in state) {
    addProxyGetter(prot, prop);
  }
}

function addProxyGetter(prot, prop) {
  Object.defineProperty(prot, prop, {
    enumerable: true,
    get: function () {
      this.$keys[prop] = true;
      return this.$state[prop];
    },
  });
}
