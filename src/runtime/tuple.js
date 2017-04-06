var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var List = Immutable.List;
var Range = Immutable.Range;


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

Object.typeEquals = function(that) {
  return this.prototype === Object.getPrototypeOf(that);
}

Number.prototype.typeEquals = Object.typeEquals;
String.typeEquals = Object.typeEquals;
Array.prototype.typeEquals = Object.typeEquals;

String.prototype.isType = function(that) {
  return Object.getPrototypeOf(this) === that.prototype;
}

//

Tuple.prototype.typeEquals = function(that) {
  var getPrototypeOf = Object.getPrototypeOf;

  for (var i = 0; i < this.values.length; i++) {
    if (getPrototypeOf(this.values[i]) != getPrototypeOf(that.values[i])) {
      return false;
    }
  }

  return true;
}

Tuple.prototype.isType = function(that) {
  var getPrototypeOf = Object.getPrototypeOf;

  for (var i = 0; i < this.values.length; i++) {
    if (getPrototypeOf(this.values[i]) !== that.values[i].prototype) {
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

var L = List.of;
var T = Tuple.of;
var R = function(start, end, step) {
  return Range(start, end + 1, step);
}

if (boolCheck(2 > 1)) {
  console.log("here");
}

console.log("=====");

console.log(T(1, 2).concat(T(3, 4)));
console.log(T([1, 2], [3, 4]).map((a, b) => a + b));
console.log(T(R(1, 2), R(3, 4)).map((a, b) => a + b));

var a = T("foo", 100), b = T("bar", 200);

console.log(">>>", a.typeEquals(b));
