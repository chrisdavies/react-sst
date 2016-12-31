'use strict';

const Tracker = require('../src/tracker');
const should = require('chai').should();

describe('tracker', function () {
  it('passes initial state through as $sst', function() {
    const trak = new Tracker(fakeStore({hi: 'you'}), {});
    trak.props.$sst.hi.should.eql('you');
  });

  it('passes initial props through', function() {
    const trak = new Tracker(fakeStore({hi: 'you'}), {hi: 'bud', bye: 'sud'});
    trak.props.hi.should.eql('bud');
    trak.props.bye.should.eql('sud');
  });

  it('passes mapped props through', function() {
    const mapStateToProps = () => ({
      hi: 'mapped',
      there: 'THERE!',
    });
    const trak = new Tracker(
      fakeStore({hi: 'you'}),
      {hi: 'bud', bye: 'sud'},
      mapStateToProps
    );
    trak.props.hi.should.eql('mapped');
    trak.props.bye.should.eql('sud');
    trak.props.there.should.eql('THERE!');
  });

  it('should not update initially', function() {
    const trak = new Tracker(fakeStore({hi: 'you'}), {a: 'bud'});
    trak.shouldUpdate({a: 'bud'}).should.be.false;
  });

  it('should update if props change', function() {
    const trak = new Tracker(fakeStore({hi: 'you'}), {a: 'bud'});
    trak.shouldUpdate({a: 'bud'}).should.be.false;
    trak.shouldUpdate({a: 'zud'}).should.be.true;
    trak.shouldUpdate({a: 'zud'}).should.be.false;
  });

  it('should update if relevant state changes', function() {
    const store = fakeStore({hi: 'you'});
    const trak = new Tracker(store, {a: 'bud'});
    trak.shouldUpdate({a: 'bud'}).should.be.false;
    store.state = {hi: 'you'};
    trak.shouldUpdate({a: 'bud'}).should.be.false;
    store.state = {hi: 'yous'};
    trak.shouldUpdate({a: 'bud'}).should.be.true;
    trak.shouldUpdate({a: 'bud'}).should.be.false;
  });

  it('should update if mapped state changes', function() {
    let count = 0;
    const mapStateToProps = state => ({
      foo: state.b + '-' + (++count),
    });
    const trak = new Tracker(fakeStore({b: 'b'}), {}, mapStateToProps);
    trak.props.foo.should.eql('b-1');
    trak.shouldUpdate({}).should.be.true;
    trak.props.foo.should.eql('b-2');
  });

  it('should not update if mapped state does not change', function() {
    const mapStateToProps = state => ({
      foo: state.b + '-bling',
    });
    const trak = new Tracker(fakeStore({b: 'b'}), {}, mapStateToProps);
    trak.props.foo.should.eql('b-bling');
    trak.shouldUpdate({}).should.be.false;
    trak.props.foo.should.eql('b-bling');
  });

  function fakeStore(state) {
    return {
      state,
      getState() {
        return this.state;
      }
    };
  }
});
