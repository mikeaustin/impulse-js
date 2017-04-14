"use strict";

//
// tuple.js
//

var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var List = Immutable.List;
var Range = Immutable.Range;


//
// class Tuple
//

function Tuple(iterable) {
  this.values = Array.prototype.slice.call(iterable, 0);
}

Tuple.of = function() {
  return new Tuple(arguments);
};

//

Tuple.prototype.isTypeOf = function(that) {
  if (!Object.getPrototypeOf(this).isPrototypeOf(that)) {
    return false;
  }

  for (var i = 0; i < this.values.length && i < that.values.length; i++) {
    if (!this.values[i].isTypeOf(that.values[i])) {
      return false;
    }
  }

  return true;
}

Tuple.prototype.isEqual = function(that) {
  if (Object.getPrototypeOf(that) !== Tuple.prototype ||
      this.values.length !== that.values.length) {
    return false;
  }

  for (var i = 0; i < this.values.length; i++) {
    if (!this.values[i].isEqual(that.values[i])) {
      return false;
    }
  }

  return true;
}

// Concatinate two tuples

Tuple.prototype.concat = function(tuple) {
  return new Tuple(this.values.concat(tuple.values));
};

// Map over each iterable value in parallel

Tuple.prototype.map = function(func) {
  if (this.values.length === 0) {
    return [];
  }

  var head = this.values[0];
  var tail = this.values.slice(1);

  var result = Immutable.List.prototype.zipWith.apply(head, [func].concat(tail));

  return result;
};

module.exports = {
  Tuple: Tuple
};


//
// Tests
//

console.log("\ntuple.js\n");

global.L = List.of;
global.T = Tuple.of;
global.R = function(start, end, step) {
  return Range(start, end + 1, step);
}

test(' T(1, 2).concat(T(3, 4)).isEqual(T(1, 2, 3, 4)) === true');
//test(' (T([1, 2], [3, 4]).map((a, b) => a + b)).isEqual([4, 6]) ');
//console.log(T(R(1, 2), R(3, 4)).map((a, b) => a + b));
test(' T().isTypeOf(T()) === true');
test(' T(String, Number).isTypeOf(T("foo", 5)) === true');
test(' T(String, T(Number, String), [Number]).isTypeOf(T("foo", T(10, "bar"), [1, 2, 3])) === true');
