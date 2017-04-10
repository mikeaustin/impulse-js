var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var List = Immutable.List;
var Range = Immutable.Range;

var getPrototypeOf = Object.getPrototypeOf;


function boolCheck(expression) {
  if (expression === true)
    return expression;
  else
    throw Error("Conditional requires a boolean expression");
}

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

Number.prototype.isType = String.prototype.isType = Array.prototype.isType = function(that) {
  return getPrototypeOf(this) === that.prototype;
}

//

Array.prototype.isType = function(that) {
  if (getPrototypeOf(that) !== Array.prototype) {
    return false;
  }
  
  for (var i = 0; i < this.length; i++) {
    if (!this[i].isType(that[0])) {
      return false;
    }
  }

  return true;
}

//

Tuple.prototype.isType = function(that) {
  if (getPrototypeOf(that) !== Tuple.prototype ||
      this.values.length != that.values.length) {
    return false;
  }

  for (var i = 0; i < this.values.length; i++) {
    if (!this.values[i].isType(that.values[i])) {
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

  return Immutable.List.prototype.zipWith.apply(head, [func].concat(tail));
};

module.exports = {
  Tuple: Tuple
};


//
// Tests
//

//var L = List.of;
//var T = Tuple.of;
//var R = function(start, end, step) {
//  return Range(start, end + 1, step);
//}
//
//if (boolCheck(2 > 1)) {
//  console.log("here");
//}
//
//console.log("=====");
//
//console.log(T(1, 2).concat(T(3, 4)));
//console.log(T([1, 2], [3, 4]).map((a, b) => a + b));
//console.log(T(R(1, 2), R(3, 4)).map((a, b) => a + b));
//
//console.log(">>>", T().isType(T()));
//console.log(">>>", T("foo", 5).isType(T(String, Number)));
//console.log(">>>", [].isType([]));
//console.log(">>>", [1, 2, 3].isType([Number]));
//console.log(">>>", [1, 2, "x"].isType([Number]));
//console.log(">>>", T("foo", T(10, "bar"), [1, 2, 3]).isType(T(String, T(Number, String), [Number])));
