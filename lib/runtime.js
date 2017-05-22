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


global.assertBoolean = function(value) {
  if (typeof value !== "boolean") {
    throw Error("X on line " + global.line + " is not a boolean expression");
  }

  return value;
}


global.reduce = function (func, init) {
  var accum = init;

  for (var result = func(accum); result !== undefined; result = func(accum)) {
    accum = result;
  }

  return accum;
}
