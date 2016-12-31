'use strict';

const getConstructor = require('../src/proxied-store');
const should = require('chai').should();

describe('proxied-store', function () {
  it('gets state initially', function() {
    const state = {a: 'a!', b: 'b!'};
    const Proxy = getConstructor(fakeStore(state));
    const prox = new Proxy().getState();

    prox.a.should.eql('a!');
    prox.b.should.eql('b!');
  });

  it('2nd access yields only those props initially requested', function() {
    const state = {a: 'a!', b: 'b!'};
    const Proxy = getConstructor(fakeStore(state));
    const prox = new Proxy();

    prox.getState().b.should.eql('b!');
    should.not.exist(prox.getState().a);
  });

  function fakeStore(state={hi: 'there'}) {
    return {
      getState() {
        return state;
      }
    };
  }
});
