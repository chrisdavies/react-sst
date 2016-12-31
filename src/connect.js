'use strict';

var React = require('react');
var Tracker = require('./tracker');

module.exports = function connect(mapStateToProps, Element) {
  if (!Element) {
    Element = mapStateToProps;
    mapStateToProps = undefined;
  }

  var component = React.createClass({
    getInitialState: function() {
      var ProxiedStore = this.context.ProxiedStore;

      this.tracker = new Tracker(
        new ProxiedStore(),
        this.props,
        mapStateToProps
      );

      return {};
    },

    shouldComponentUpdate: function(nextProps) {
      return this.tracker.shouldUpdate(nextProps);
    },

    render: function() {
      return React.createElement(
        Element,
        this.tracker.props,
        this.props.children
      );
    }
  });

  component.contextTypes = {
    ProxiedStore: React.PropTypes.func,
  };

  return component;
};
