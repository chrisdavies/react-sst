'use strict';

const React = require('react');
const MockReact = {
  createClass(def) {
    return function(props) {
      return Object.assign({}, def, {props: props});
    };
  }
};
const mockTracker = {};
const proxyquire = require('proxyquire');
const connect = proxyquire('../src/connect', {
  'react': MockReact,
  './tracker': function(Proxy, store, props, mapStateToProps) {
    mockTracker._Proxy = Proxy;
    mockTracker._store = store;
    mockTracker._props = props;
    mockTracker._mapStateToProps = mapStateToProps;
    return mockTracker;
  }
});

describe('connect', function () {
  it('expects ProxiedStore and state to be contextually provided', function () {
    const Component = connect({});
    Component.contextTypes.store.should.eql(React.PropTypes.object);
    Component.contextTypes.ProxiedStore.should.eql(React.PropTypes.func);
  });

  it('does not require mapStateToProps', function () {
    let count = 0;
    const props = {children: 'MY CHILDREN'};
    MockReact.createElement = function(element, props, children) {
      element.should.eql('MOCK');
      props.should.eql('MY PROPS');
      children.should.eql('MY CHILDREN');
      ++count;
    };

    count.should.eql(0);
    const component = connect('MOCK')();
    component.tracker = {props: 'MY PROPS'};
    component.props = {children: 'MY CHILDREN'};
    component.render();
    count.should.eql(1);
  });

  it('creates a proxied store when initializing', function () {
    const mapStateToProps = () => {};
    const component = connect(mapStateToProps, {})();
    component.context = {
      store: {
        name: 'MOCK STORE'
      },
      ProxiedStore: {
        name: 'MOCK PROXY'
      }
    };
    component.props = {yo: 'yo'};
    component.getInitialState();

    mockTracker._Proxy.name.should.eql('MOCK PROXY');
    mockTracker._store.name.should.eql('MOCK STORE');
    mockTracker._props.should.eql({yo: 'yo'});
    mockTracker._mapStateToProps.should.eql(mapStateToProps);
  });

  it('updates if the tracker dictates', function () {
    let shouldUpdate = false;

    mockTracker.shouldUpdate = (props) => {
      props.should.eql('MY PROPS');
      return shouldUpdate;
    };

    const component = connect({})();
    component.context = {ProxiedStore: function () { }};
    component.getInitialState();

    component.shouldComponentUpdate('MY PROPS').should.be.false;

    shouldUpdate = true;

    component.shouldComponentUpdate('MY PROPS').should.be.true;
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
