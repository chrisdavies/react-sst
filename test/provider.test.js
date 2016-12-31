'use strict';

const React = {
  createClass(def) {
    return function(props) {
      return Object.assign({}, def, {props: props});
    };
  }
};
const proxyquire = require('proxyquire');
const Provider = proxyquire('../src/provider', {
  'react': React
});

describe('Provider', function () {
  it('Specifies childContextTypes', function () {
    Provider.childContextTypes.ProxiedStore.should.eql(React.PropTypes.func);
  });

  it('creates a proxied store initially', function() {
    const provider = Provider({store: fakeStore({hi: 'there'})});
    provider.getInitialState();
    const ProxiedStore = provider.getChildContext().ProxiedStore;
    const prox = new ProxiedStore();
    prox.getState().hi.should.eql('there');
    prox.$keys.hi.should.be.true;
  });

  it('updates component state when global state changes', function() {
    let count = 0;
    const store = fakeStore({hi: 'there'});
    const provider = Provider({store});
    provider.setState = () => ++count;
    provider.componentDidMount();

    count.should.eql(0);
    store.onChange();
    count.should.eql(1);
  });

  it('passes children through to the render', function() {
    let count = 0;
    React.createElement = function(tag, props, children) {
      ++count;
      children.should.eql('MY LIL BEBE');
    }
    const store = fakeStore({hi: 'there'});
    const provider = Provider({store, children: 'MY LIL BEBE'});
    count.should.eql(0);
    provider.render();
    count.should.eql(1);
  });

  function fakeStore(state) {
    const store = {
      state,
      getState() {
        return this.state;
      },
      setState(state) {
        store.state = state;
      }
    };

    return store;
  }
});
