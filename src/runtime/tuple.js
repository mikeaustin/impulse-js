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

Tuple.prototype.isType = function(type) {
  if (Object.getPrototypeOf(type) !== Tuple.prototype ||
      this.values.length !== type.values.length) {
    return false;
  }

  for (var i = 0; i < this.values.length && i < type.values.length; i++) {
    if (!this.values[i].isType(type.values[i])) {
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

global.L = List.of;
global.T = Tuple.of;
global.R = function(start, end, step) {
  return Range(start, end + 1, step);
}

test(' T(1, 2).concat(T(3, 4)).isEqual(T(1, 2, 3, 4)) ');
//test(' (global.T([1, 2], [3, 4]).map((a, b) => a + b)).isEqual([4, 6]) ');
//console.log(T(R(1, 2), R(3, 4)).map((a, b) => a + b));
test(' T().isType(T()) == true');
test(' T("foo", 5).isType(T(String, Number)) ');
test(' [].isType([]) ');
test(' [1, 2, 3].isType([Number]) ');
test(' [1, 2, "x"].isType([Number]) == false');
test(' T("foo", T(10, "bar"), [1, 2, 3]).isType(T(String, T(Number, String), [Number])) == true');
