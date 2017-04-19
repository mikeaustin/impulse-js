"use strict";

var Extension = require("../runtime/extension.js").Extension;

function DivideByZeroError(message) {
  this.name = "DivideByZeroError";
  this.message = message;
}

DivideByZeroError.prototype = new Error();
DivideByZeroError.prototype.constructor = DivideByZeroError;

//
// Tests
//

console.log("\noperator.js\n");

Number.prototype.add = function (that) {
  return this + that;
};

Number.prototype.div = function (that) {
  if (that === 0) {
    throw new DivideByZeroError("Division by zero");
  }

  return this + that;
};

Number.prototype._cmp = function(that) {
  return this < that ? -1 : this > that ? 1 : 0;
}

Number.prototype.eql = function (that) {
  return this.isEqual(that);
}

var x = 2;

var _methods = Extension.extend(_methods, Number, {
    mul: function (that) { return this * that; }
});


global.x = x;
global._methods = _methods;

test(' (x.eql || _eql).apply(x, [2]) === true ');
test(' (x._cmp || _cmp).apply(x, [1]) === 1 ');
test(' (x._cmp || _cmp).apply(x, [2]) === 0 ');
test(' (x._cmp || _cmp).apply(x, [3]) === -1 ');

test(' (x.add || _methods.add).apply(x, [3]) === 5 ');
test(' (x.mul || _methods.mul).apply(x, [3]) === 6 ');
test(' x.div(0) === "DivideByZeroError" ', function (e) { return e instanceof DivideByZeroError; })

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.isEqual = function (that) {
  return this.x.isEqual(that.x) && this.y.isEqual(that.y);
}

Vector.prototype.add = function (that) {
  return new Vector(this.x + that.x, this.y + that.y);
}


global.Vector = Vector;

test(' new Vector(1, 2).add(new Vector(3, 4)).isEqual(new Vector(4, 6)) ');
//     new Vector(1, 2) + new Vector(3, 4)) == new Vector(4, 6) ');

/*

Numeric     _add, _sub, _mul, _div, _mod
Comparable  _cmp, _gt,  _lt,  _gte, _lte
Equatable   _eql

var Comparable = new Trait();

Comparable.methods._gt = function (that) {
  return 
}

*/
