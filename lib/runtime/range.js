"use strict";

/**
 * @constructor Tuple
 * @memberof module:impulse
 *
 * @summary A tuple type that supports structural typing and multi-value mapping on iterables.
**/

// function Iterator(range) {
//   this.range = range;
//   this.index = range.begin;
//   this.result = { };
// }

// Iterator.prototype.constructor = Iterator;

// Iterator.prototype.next = function () {
//   this.result.value = this.index;
//   this.result.done = this.value > this.range.end;

//   return this.result;
// };


function Range(begin, end) {
  this.begin = begin;
  this.end   = end;
}

Range.of = function (begin, end) {
  return new Range(begin, end);
};

Range.prototype.includes = function(value) {
  return value >= this.begin && value <= this.end;
}

Range.prototype.case = function(value) {
  return Number.isTypeOf(value) && this.includes(value);
}

Range.prototype.map = function(func) {
  var array = [];

  for (var i = this.begin; i < this.end; ++i) {
    array.push(func(i));
  }

  return array;
}


//
// Exports
//

module.exports = Range;
