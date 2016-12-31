'use strict';

module.exports = getProxyConstructor;

function getProxyConstructor(store) {
  function Proxy() {
    this.$store = store;
    this.$keys = {};
  }

  Proxy.prototype = {
    getState: getInitialState,
  };

  addProxyGetters(Proxy.prototype, store.getState());

  return Proxy;
}

function getInitialState() {
  this.getState = getAccessedState;
  return this;
}

function getAccessedState() {
  var accessedState = {};
  var fullState = this.$store.getState();

  for (var key in this.$keys) {
    accessedState[key] = fullState[key];
  }

  return accessedState;
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
      return this.$store.getState()[prop];
    },
  });
}
