"use strict";

var Extension = require("../runtime/extension.js");

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

Number.prototype._add = function (that) {
  return this + that;
};

Number.prototype._div = function (that) {
  if (that === 0) {
    throw new DivideByZeroError("Division by zero");
  }

  return this + that;
};

Number.prototype._cmp = function(that) {
  return this < that ? -1 : this > that ? 1 : 0;
}

//Number.prototype.eql = Number.prototype.isEqual;


var x = 2;

var _methods = Extension.extend(_methods, Number, {
    _mul: function (that) { return this * that; }
});


global.x = x;
global._methods = _methods;

//test(' (x.eql || _methods.eql).apply(x, [2]) === true ');
test(' (x._cmp || _methods.cmp).apply(x, [1]) === 1 ');
test(' (x._cmp || _methods.cmp).apply(x, [2]) === 0 ');
test(' (x._cmp || _methods.cmp).apply(x, [3]) === -1 ');

test(' (x._add || _methods._add).apply(x, [3]) === 5 ');
test(' (x._mul || _methods._mul).apply(x, [3]) === 6 ');
test(' (x._div || _methods._dib)(0) === "DivideByZeroError" ', function (e) { return e instanceof DivideByZeroError; })

function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.isEqual = function (that) {
  return this.x.isEqual(that.x) && this.y.isEqual(that.y);
}

Vector.prototype._add = function (that) {
  return new Vector(this.x + that.x, this.y + that.y);
}


global.Vector = Vector;

test(' new Vector(1, 2)._add(new Vector(3, 4)).isEqual(new Vector(4, 6)) ');
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
