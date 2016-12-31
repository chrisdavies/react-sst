'use strict';

module.exports = function makeProxy(state, handler) {
  if (window.Proxy) {
    return new window.Proxy(state, handler);
  }

  var prox = {};

  for (var key in state) {
    proxyGet(prox, key, state, handler);
  }

  return prox;
};

function proxyGet(prox, prop, state, handler) {
  Object.defineProperty(prox, prop, {
    get: function () {
      return handler.get(state, prop);
    },
    enumerable: true,
  });
}
