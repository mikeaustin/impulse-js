"use strict";

/**
 * @constructor Tuple
 * @memberof module:Impulse
 *
 * @summary A tuple type that supports structural typing and multi-value mapping on iterables.
**/

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
