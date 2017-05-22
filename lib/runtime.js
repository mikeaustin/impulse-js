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
 * @module impulse
**/

module.exports = {
  Tuple: Tuple,
  Union: Union,
  Range: Range,
  Extension: Extension,
  Parameters: Parameters,
  Trait: Trait,
  define: Class.define,
  extend: Extension.extend
};


String.prototype.slice.parameters = new Parameters([{begin: Number}, {end: Undefined.or(Number)}]);

global.assertBoolean = function(value) {
  if (typeof value !== "boolean") {
    throw Error("X on line " + global.line + " is not a boolean expression");
  }

  return value;
}


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

global.reduce = function (func, init) {
  var accum = init;

  for (var result = func(accum); result !== undefined; result = func(accum)) {
    accum = result;
  }

  return accum;
}
