'use strict';

const sst = require('sst');
const Tracker = require('../src/tracker');
const buildProxy = require('../src/proxied-store');
const should = require('chai').should();

describe('tracker', function () {
  it('passes initial state through as $state', function() {
    const {store, trak} = makeTracker({hi: 'you'});
    trak.props.$state.hi.should.eql('you');
  });

  it('passes transform through', function() {
    const {store, trak} = makeTracker({hi: 'you'});
    trak.props.$transform.should.eql(store.$transform);
  });

  it('passes selector through', function() {
    const {store, trak} = makeTracker({hi: 'you'});
    trak.props.$selector.should.eql(store.$selector);
  });

  it('passes initial props through', function() {
    const {store, trak} = makeTracker({hi: 'you'}, {hi: 'bud', bye: 'sud'});
    trak.props.hi.should.eql('bud');
    trak.props.bye.should.eql('sud');
  });

  it('passes mapped props through', function() {
    const mapStateToProps = () => ({
      hi: 'mapped',
      there: 'THERE!',
    });

    const {store, trak} = makeTracker({hi: 'you'}, {hi: 'bud', bye: 'sud'}, mapStateToProps);

    trak.props.hi.should.eql('mapped');
    trak.props.bye.should.eql('sud');
    trak.props.there.should.eql('THERE!');
  });

  it('should not update initially', function() {
    const {store, trak} = makeTracker({hi: 'you'}, {a: 'bud'});
    trak.shouldUpdate({a: 'bud'}).should.be.false;
  });

  it('should update if props change', function() {
    const {store, trak} = makeTracker({hi: 'you'}, {a: 'bud'});
    trak.shouldUpdate({a: 'bud'}).should.be.false;
    trak.shouldUpdate({a: 'zud'}).should.be.true;
    trak.shouldUpdate({a: 'zud'}).should.be.false;
  });

  it('should update if relevant state changes', function() {
    const {store, trak} = makeTracker({hi: 'you'}, {a: 'bud'});
    trak.props.$state.hi.should.eql('you');
    trak.shouldUpdate({a: 'bud'}).should.be.false;
    store.getState().hi = 'you';
    trak.shouldUpdate({a: 'bud'}).should.be.false;
    store.getState().hi = 'yous';
    trak.shouldUpdate({a: 'bud'}).should.be.true;
    trak.shouldUpdate({a: 'bud'}).should.be.false;
  });

  it('should update if mapped state changes', function() {
    let count = 0;
    const mapStateToProps = state => ({foo: state.b + '-' + (++count)});
    const {store, trak} = makeTracker({b: 'b'}, {}, mapStateToProps);
    trak.props.foo.should.eql('b-1');
    trak.shouldUpdate({}).should.be.true;
    trak.props.foo.should.eql('b-2');
  });

  it('should not update if mapped state does not change', function() {
    const mapStateToProps = state => ({foo: state.b + '-bling'});
    const {store, trak} = makeTracker({b: 'b'}, {}, mapStateToProps);
    trak.props.foo.should.eql('b-bling');
    trak.shouldUpdate({}).should.be.false;
    trak.props.foo.should.eql('b-bling');
  });

  function makeTracker(state, trakState={}, mapStateToProps) {
    const store = sst(state, {});
    const Proxy = buildProxy(store);
    const trak = new Tracker(Proxy, store, trakState, mapStateToProps);

    return {store, trak};
  }
});
