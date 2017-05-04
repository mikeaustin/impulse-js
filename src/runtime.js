"use strict";

var passed = 0;
var failed = 0;

Object.prototype.bind = function bind() { return this.valueOf(); }

global.test = function (expression, onException) {
  var result;

  try {
    result = global.eval(expression);
  } catch (e) {
    if (onException) {
      result = onException(e);
    } else {
      console.log(e);
    }
  }

  result ? ++passed : ++failed;

  console.log((result ? "  \x1B[32mpass\x1B[0m" : "  \x1B[31mfail\x1B[0m") + "  " + expression.trim());
}

// Runtime

var Types = require("./runtime/types");
var Tuple = require("./runtime/tuple.js");
var Union = require("./runtime/union.js");

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
  Module: Trait,
  define: Class.define,
  extend: Extension.extend
};

Number.prototype._add = function (that) { return this + that; };
Number.prototype._sub = function (that) { return this - that; };
Number.prototype._mul = function (that) { return this * that; };
Number.prototype._lt = function (that) { return this < that; };
Number.prototype._gt = function (that) { return this > that; };
Number.prototype._lte = function (that) { return this <= that; };
Number.prototype._gte = function (that) { return this >= that; };

Object.prototype._eql = function (that) { return this === that; }
Object.prototype._neql = function (that) { return this !== that; }

String.prototype.slice.parameters = new Parameters([{begin: Number}, {end: Union.of(Number, Undefined), $: undefined}]);

global.assertBoolean = function(value) {
  if (typeof value !== "boolean") {
    throw Error("X on line " + global.line + " is not a boolean expression");
  }

  return value;
}

// String.Iterator = Class.define(Object, {
//   constructor: function (string) {
//     this.string = string;
//     this.index = 0;
//   },

//   next: function () {
//     var charCode;

//     if ((charCode = this.string.charCodeAt(this.index), charCode >= 0xD800 && charCode <= 0xDBFF) &&
//         (charCode = this.string.charCodeAt(this.index + 1), charCode >= 0xDC00 && charCode <= 0xDFFF)) {
//       this.value = this.string.slice(this.index, this.index + 2);
//       this.index += 2;
//     } else {
//       this.value = this.string.charAt(this.index);
//       this.index += 1;
//     }

//     this.done = this.index > this.string.length;

//     return this;
//   }
// })

// String.prototype.iterator = function () {
//   return new String.Iterator(this);
// }

// String.prototype.reduce = function (func, init) {
//   var accum = init;

//   for (var iter = this.iterator().next(); !iter.done; iter = iter.next()) {
//     accum = func(accum, iter.value);
//   }

//   return accum;
// }

// String.prototype.map = function (func) {
//   return this.reduce((array, c) => array.concat([func(c)]), []);
// }

// String.prototype._length = function () {
//   return this.reduce((length, c) => length + 1, 0);
// }

// console.log("=====");

// for (var iter = "f💩o".iterator().next(); !iter.done; iter = iter.next()) {
//   console.log(iter.value);
// }

// console.log("'f💩o'.length == 3", "f💩o"._length() === 3);

// console.log('f💩o'.map(c => c.toUpperCase()));

var Iterable = global.Iterable = new Trait(Iterable, {
  reduce: function _reduce(iterator) {
    return function reduce(func, init) {
      var accum = init, iter = iterator.apply(this);

      for (var iter = iter.next(); !iter.done; iter = iter.next()) {
        accum = func(accum, iter.value);
      }
      
      return accum;
    }
  },

  _split: function _split(iterator) {
    return function split(separator) {
      var iter = iterator.apply(this);
      var array = [];
      var part = [];

      for (var iter = iter.next(); !iter.done; iter = iter.next()) {
        if (iter.value === separator) {
          array.push(part);

          part = [];
        } else {
          part.push(iter.value);
        }
      }

      array.push(part);

      return array.join("");
    }
  }
});

Map.prototype.update = function update(key, callback, init) {
  var value = this.get(key);

  this.set(key, callback(value ? value : init));

  return this;
}

Map.prototype.update.parameters = new Parameters([{key: Object}, {callback: Function}, {init: Object}]);
