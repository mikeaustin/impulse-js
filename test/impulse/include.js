'use strict';
var __FILE__ = 'undefined';
var __LINE__ = '0';
var impulse = require('impulse-js/lib/runtime');
var Tuple = impulse.Tuple;
var Range = impulse.Range;
try {
  var $;
  var Aggregate = new impulse.Trait(Aggregate, function(reduce) {
    return {
      max: function max() {
        var _this = this;
        var $;
        return (__LINE__ = 5, $ = Math.max.valueOf(Math), $.apply || _.apply).apply($, [, _this]);
      }
    };
  }, ["reduce"]);

  var _ = impulse.extend(_, Array, {
    filter: function filter(func) {
      var _this = this;
      var $;
      return (__LINE__ = 13, $ = _this, $.filter || _.filter).apply($, [func]);
    }
  });
  var _ = impulse.extend(_, Array, Aggregate.bind.apply(Aggregate, Aggregate.required.map(method => Array[method] || _[method])));

  (__LINE__ = 18, $ = console, $.log || _.log).apply($, ["[1, 2, 3].max() ==", (__LINE__ = 18, $ = [1, 3, 2], $.max || _.max).apply($, [])]);
  var _ = impulse.extend(_, Number, {
    isEven: function isEven() {
      var _this = this;
      var $;
      return ($ = ($ = _this, $._mod || _._mod).apply($, [2]), $._eql || _._eql).apply($, [0]);
    },
    isOdd: function isOdd() {
      var _this = this;
      var $;
      return !((__LINE__ = 27, $ = _this, $.isEven || _.isEven).apply($, []));
    }
  });

  var odds = (__LINE__ = 31, $ = _, $.filter || _.filter).apply($, [(__LINE__ = 31, $ = _, $.isOdd || _.isOdd).apply($, [])]);
  (__LINE__ = 33, $ = console, $.log || _.log).apply($, ["odds([1, 2, 3]) ==", (__LINE__ = 33, odds).apply(null, [[1, 2, 3]])]);
  var Point = impulse.define(Object, {
    constructor: function Point(x, y) {
      var _this = this;
      var $;
      _this.x = x;
      _this.y = y;
    },
    _add: function _add(that) {
      var _this = this;
      var $;
      return new (Point)(($ = _this.x.valueOf(_this), $._add || _._add).apply($, [that.x.valueOf(that)]), ($ = _this.y.valueOf(_this), $._add || _._add).apply($, [that.y.valueOf(that)]));
    }
  });

  (__LINE__ = 52, $ = console, $.log || _.log).apply($, ["new Point(2, 3) + new Point(2, 3) ==", ($ = new (Point)(2, 3), $._add || _._add).apply($, [new (Point)(2, 3)])]);
} catch (e) {
  var stack = '\n' + e.stack.toString().split('\n').slice(1).join('\n');
  console.log(e.name + ': [' + __FILE__ + ' : ' + __LINE__ + ']', e.message, stack);
};