'use strict';

module.exports = Tracker;

function Tracker(store, props, mapStateToProps) {
  this.store = store;
  this.mapStateToProps = mapStateToProps || function() {
    return {};
  };

  buildProps(this, props);
}

Tracker.prototype = {
  shouldUpdate: function (nextProps) {
    var prevSst = this.prevSst;
    var prevProps = this.prevProps;

    buildProps(this, nextProps);

    return (diff(prevProps, this.prevProps) || diff(prevSst.$sst, this.prevSst.$sst));
  }
};

function buildSst(me) {
  return {$sst: me.store.getState(), $action: me.store.$action};
}

function buildProps(me, props) {
  me.prevProps = Object.assign({}, props, me.mapStateToProps(me.store.getState(), props));
  me.prevSst = buildSst(me);
  return me.props = Object.assign({}, me.prevSst, me.prevProps);
}

// The keys will always be the same, since we build o2 from o1's keys
function diff(o1, o2) {
  for (var key in o2) {
    if (o1[key] !== o2[key]) {
      return true;
    }
  }

  return false;
}
