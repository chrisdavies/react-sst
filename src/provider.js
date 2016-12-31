'use strict';

var React = require('react');
var makeProxiedStore = require('./proxied-store');

var Provider = React.createClass({
  getInitialState: function() {
    this.ProxiedStore = makeProxiedStore(this.props.store);
    return {};
  },

  getChildContext: function() {
    return {
      ProxiedStore: this.ProxiedStore
    };
  },

  componentDidMount: function() {
    var me = this;
    var store = this.props.store;
    var setStoreState = store.setState;

    store.setState = function(state) {
      setStoreState(state);
      me.setState({});
    };
  },

  render: function() {
    return React.createElement('div', null, this.props.children);
  }
});

Provider.childContextTypes = {
  ProxiedStore: React.PropTypes.func,
};

module.exports = Provider;
