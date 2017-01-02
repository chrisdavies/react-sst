module.exports = Tracker;

function Tracker(Proxy, store, props, mapStateToProps) {
  this.store = store;
  this.mapStateToProps = mapStateToProps || function() {
    return {};
  };
  this.proxy = new Proxy();
  this.$sst = this.proxy;

  makeProps(this, props);
}

Tracker.prototype = {
  shouldUpdate: function (nextProps) {
    var prevSst = this.$sst;
    var prevProps = this.prevProps;

    this.$sst = nextSst(this);

    makeProps(this, nextProps);

    return (diff(prevProps, this.prevProps) || diff(prevSst, this.$sst));
  }
};

function nextSst(me) {
  var keys = (me.proxy && me.proxy.$keys) || me.$sst;
  var accessedState = {};
  var fullState = me.store.getState();

  for (var key in keys) {
    accessedState[key] = fullState[key];
  }

  me.proxy = undefined;

  return accessedState;
}

function makeProps(me, props) {
  me.prevProps = Object.assign({}, props, me.mapStateToProps(me.store.getState(), props));
  return me.props = Object.assign({}, {$sst: me.$sst, $action: me.store.actions}, me.prevProps);
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
