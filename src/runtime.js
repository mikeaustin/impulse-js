"use strict";

var passed = 0;
var failed = 0;

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
var Extension = require("./runtime/extension.js");
var Parameters = require("./runtime/parameters.js");
var Module = require("./runtime/module.js");
var Operator = require("./runtime/operator.js");

// Library

var Extensions = require("./library/extensions.js");

var Impulse = {
  Extension: Extension,
  Tuple: Tuple,
  Parameters: Parameters
};

console.log("\n" + passed + " tests passed, " + failed + " tests failed.\n");

module.exports = Impulse;
