'use strict'
var Impulse = require('./src/runtime');
String.prototype._add = function (that) { return this + that; };
Number.prototype._add = function (that) { return this + that; };
var $;
var Vector = Impulse.define(Object, {
  constructor: function Vector(x, y) {
    var _this = this;
    _this.x = x;
    _this.y = y;
  },
  _add: function _add(that) {
    var _this = this;
    return new Vector(($ = _this.x, $._add || _methods._add).apply($, [that.x]), ($ = _this.y, $._add || _methods._add).apply($, [that.y]));
  }
});

var _methods = Impulse.extend(_methods, Vector, {
  _sub: function _sub(that) {

    var _this = this;
    return new Vector(($ = _this.x, $._sub || _methods._sub).apply($, [that.x]), ($ = _this.y, $._sub || _methods._sub).apply($, [that.y]));
  }
});

console.log(">>>", Vector.isTypeOf);
console.log(_methods._sub.apply(new Vector(1, 2), [new Vector(3, 4)]));

//var result = ($ = new Vector(1, 2), $._sub || _methods._sub).apply($, [new Vector(3, 4)]);
//($ = console, $.log || _methods.log).apply($, [result]);

