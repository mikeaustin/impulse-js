"use strict";

//
// class Tuple
//

function Tuple(iterable) {
  this.values = Array.prototype.slice.call(iterable, 0);
}

Tuple.of = function () {
  return new Tuple(arguments);
};

//

Tuple.prototype.isTypeOf = function (that) {
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

Tuple.prototype.isEqual = function (that) {
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

Tuple.prototype.concat = function (tuple) {
  return new Tuple(this.values.concat(tuple.values));
};

// Map over each iterable value in parallel

Tuple.prototype.map = function (func) {
  if (this.values.length === 0) {
    return [];
  }

  var head = this.values[0];
  var tail = this.values.slice(1);

  var result = Immutable.List.prototype.zipWith.apply(head, [func].concat(tail));

  return result;
};

//
// Exports
//

module.exports = Tuple;
