"use strict";

var passed = 0;
var failed = 0;

Function.prototype.valueOf = function (thisArg) { return this.bind(thisArg); }


// Runtime

var Types = require("./runtime/types");
var Tuple = require("./runtime/tuple.js");
var Range = require("./runtime/range.js");
var Union = require("./runtime/union.js");
var UString = require("./runtime/string.js");

var Class = require("./runtime/class.js");
var Extension = require("./runtime/extension.js");
var Parameters = require("./runtime/parameters.js");
var Trait = require("./runtime/module.js");
var Operator = require("./runtime/operator.js");

// Library

var Extensions = require("./library/extensions.js");
var Extensions = require("./library/HTML.js");

//
// Exports
//

/**
 * @module Impulse
**/

module.exports = {
  Tuple: Tuple,
  Union: Union,
  Extension: Extension,
  Parameters: Parameters,
  Trait: Trait,
  define: Class.define,
  extend: Extension.extend
};

Number.prototype._add = function (that) { return this + that; };
Number.prototype._sub = function (that) { return this - that; };
Number.prototype._mul = function (that) { return this * that; };
Number.prototype._div = function (that) { return this / that; };
Number.prototype._mod = function (that) { return this % that; };

Number.prototype._lt = function (that) { return this < that; };
Number.prototype._gt = function (that) { return this > that; };
Number.prototype._lte = function (that) { return this <= that; };
Number.prototype._gte = function (that) { return this >= that; };

Object.prototype._eql = function (that) { return this === that; }
Object.prototype._neql = function (that) { return this !== that; }

String.prototype.slice.parameters = new Parameters([{begin: Number}, {end: Undefined.or(Number)}]);

global.assertBoolean = function(value) {
  if (typeof value !== "boolean") {
    throw Error("X on line " + global.line + " is not a boolean expression");
  }

  return value;
}

var TestTrait = global.TestTrait = new Trait(TestTrait, function (a, b) {
  //constructor: function TestTrait() {},

  return {
    test: function _test(a, b) {
      return a.apply(this) + b.apply(this);
    }
  }
}, ["a", "b"]);

var Iterable = global.Iterable = new Trait(Iterable, function(iterator) {
  return {
    reduce: function reduce(func, init) {
      var accum = init, iter = iterator.apply(this);

      for (var result = iter.next(); !result.done; result = iter.next()) {
        accum = func(accum, result.value);
      }
      
      return accum;
    },

    filter: function _filter(predicate) {
      var accum = [], iter = iterator.apply(this);

      for (var result = iter.next(); !result.done; result = iter.next()) {
        if (predicate(result.value)) {
          accum.push(result.value);
        }
      }

      if ([Object].isTypeOf(this) || Range.isTypeOf(this)) {
        return accum;
      } else {
        return new this.constructor.from(accum);
      }
    },

    _split: function _split(separator) {
      var iter = iterator.apply(this);
      var array = [];
      var part = new this.constructor().valueOf();

      for (var result = iter.next(); !result.done; result = iter.next()) {
        if (result.value === separator) {
          array.push(part);

          part = new this.constructor().valueOf();
        } else {
          part = part.append(result.value);
        }
      }

      array.push(part);

      return array;
    }
  }
});

Iterable.required = ["iterator"];

Map.prototype._idx = Map.prototype.get;
Map.prototype.concat = function(map) {
  for (var x of map) {
    this.set(x[0], x[1]);
  }
};
Map.prototype.append = function (tuple) { return this.set(tuple.values[0], tuple.values[1]); };
Map.prototype.update = function update(key, callback, init) {
  var value = this.get(key);

  this.set(key, callback(value ? value : init));

  return this;
}

Map.prototype.update.parameters = new Parameters([{key: Object}, {callback: Function}, {init: Object}]);

Array.prototype.append = function (value) {
  return this.concat([value]);
}

String.prototype.append = function (value) {
  return this + value;
}

Array.prototype._idx = String.prototype._idx = function (value) {
  if (Number.isTypeOf(value)) {
    return this[value];
  } else if (Range.isTypeOf(value)) {
    return this.slice(value.begin, value.end);
  }
}
