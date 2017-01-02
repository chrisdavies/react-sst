var React = require('react');
var Tracker = require('./tracker');

module.exports = function connect(mapStateToProps, Element) {
  if (!Element) {
    Element = mapStateToProps;
    mapStateToProps = undefined;
  }

  var component = React.createClass({
    getInitialState: function() {
      this.tracker = new Tracker(
        this.context.ProxiedStore,
        this.context.store,
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
    store: React.PropTypes.object,
    ProxiedStore: React.PropTypes.func,
  };

  return component;
};
