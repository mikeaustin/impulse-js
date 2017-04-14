"use strict";

var extend = require("../runtime/extension.js").extend;


//
// Tests
//

console.log("\noperator.js\n");

Number.prototype.add = function(that) { return this + that; };

var x = 2;
var _mul = extend(Number, _mul, function(that) { return this * that; });

global.x = x;
global._mul = _mul;

test(' (x.add || _add).apply(x, [3]) === 5 ');
test(' (x.mul || _mul).apply(x, [3]) === 6 ');


function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.isEqual = function(that) {
  return this.x.isEqual(that.x) && this.y.isEqual(that.y);
}

Vector.prototype.add = function(that) {
  return new Vector(this.x + that.x, this.y + that.y);
}


global.Vector = Vector;

test(' new Vector(1, 2).add(new Vector(3, 4)).isEqual(new Vector(4, 6)) ');
//     new Vector(1, 2) + new Vector(3, 4)) == new Vector(4, 6) ');
