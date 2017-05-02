"use strict";

var passed = 0;
var failed = 0;

Object.prototype.bind = function() { return this.valueOf(); }

console.log("Impulse-JS Tests");

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
var Module = require("./runtime/module.js");
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
  Module: Module,
  define: Class.define,
  extend: Extension.extend
};

Number.prototype._add = function (that) { return this + that; };
Number.prototype._sub = function (that) { return this - that; };
Number.prototype._mul = function (that) { return this * that; };
Number.prototype._lt = function (that) { return this < that; };
Number.prototype._gt = function (that) { return this > that; };
Number.prototype._gte = function (that) { return this >= that; };

String.prototype.slice.parameters = new Parameters([{begin: Number}, {end: Union.of(Number, Undefined), $: undefined}]);


String.Iterator = Class.define(Object, {
  constructor: function (string) {
    this.string = string;
    this.index = 0;
  },

  next: function () {
    var charCode;

    if ((charCode = this.string.charCodeAt(this.index), charCode >= 0xD800 && charCode <= 0xDBFF) &&
        (charCode = this.string.charCodeAt(this.index + 1), charCode >= 0xDC00 && charCode <= 0xDFFF)) {
      this.value = this.string.slice(this.index, this.index + 2);
      this.index += 2;
    } else {
      this.value = this.string.charAt(this.index);
      this.index += 1;
    }

    this.done = this.index > this.string.length;

    return this;
  }
})

String.prototype.iterator = function () {
  return new String.Iterator(this);
}

String.prototype.reduce = function (func, init) {
  var accum = init;

  for (var iter = this.iterator().next(); !iter.done; iter = iter.next()) {
    accum = func(accum, iter.value);
  }

  return accum;
}

String.prototype._length = function () {
  return this.reduce((length, c) => length + 1, 0);
}

console.log("=====");

for (var iter = "f💩o".iterator().next(); !iter.done; iter = iter.next()) {
  console.log(iter.value);
}

console.log("'f💩o'.length ==", "f💩o"._length());
