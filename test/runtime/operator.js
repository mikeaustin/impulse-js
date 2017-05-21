'use strict';

var Extension = require('../../src/runtime/extension');

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

var _ = Extension.extend(_, Number, {
    _mul: function (that) { return this * that; }
});


//test(' (x.eql || _.eql).apply(x, [2]) === true ');
test(' (x._cmp || _.cmp).apply(x, [1]) === 1 ', { x: x, _: _ });
test(' (x._cmp || _.cmp).apply(x, [2]) === 0 ', { x: x, _: _ });
test(' (x._cmp || _.cmp).apply(x, [3]) === -1 ', { x: x, _: _ });

test(' (x._add || _._add).apply(x, [3]) === 5 ', { x: x, _: _ });
test(' (x._mul || _._mul).apply(x, [3]) === 6 ', { x: x, _: _ });
test(' (x._div || _._dib)(0) === "DivideByZeroError" ', { x: x, _: _ }, function (e) { return e instanceof DivideByZeroError; })

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

test(' new Vector(1, 2)._add(new Vector(3, 4)).isEqual(new Vector(4, 6)) ', {Vector: Vector});
//     new Vector(1, 2) + new Vector(3, 4)) == new Vector(4, 6) ');
