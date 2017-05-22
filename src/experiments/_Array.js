"use strict";

var impulse = { };

impulse.Array = (function (_Array) {
  var Array = function () {
    this.push.apply(this, arguments);
  }

  Array.prototype = new _Array();
  Array.prototype.constructor = Array;
  Array.prototype.length = 0;
  Array.prototype.inspect = function () { return this.slice(); }
  Array.prototype.toString = function () { return this.slice().toString(); }
  Array.prototype.foo = function () { return "foo"; }
  Array.from = _Array.from;

  return Array;
})(Array);

(function () {
  var Array = impulse.Array;

  var a = new global.Array();
  a.push(1, 2, 3);
  var a1 = global.Array.from([1, 2, 3]);

  var b = new Array();
  b.push(1, 2, 3);
  var b1 = Array.from([1, 2, 3]);

  console.log(a, b);
  console.log(a.length, b.length);

  console.log(b.foo());
})();

