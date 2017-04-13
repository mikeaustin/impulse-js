"use strict";

var passed = 0;
var failed = 0;

console.log("Impulse-JS Tests");

global.test = function(expression, onException) {
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

var Types = require("./runtime/types.js");
var Tuple = require("./runtime/tuple.js");
var Union = require("./runtime/union.js");
var Extension = require("./runtime/extension.js");
var Parameters = require("./runtime/parameters.js");
var Module = require("./runtime/module.js");
var Operator = require("./runtime/operator.js");

var Extensions = require("./library/extensions.js");


var Impulse = {
  extend: Extension.extend,
  Tuple: Tuple.Tuple
};

module.exports = {
  Impulse: Impulse
}

var _toString = Extensions._toString;


//
// Tests
//

var T = Impulse.Tuple.of;

global._toString = _toString;

test(' _toString.apply({ foo: [1, 2, 3] }) == "Object { foo: [1, 2, 3] }" ');
//console.log(_toString.apply(_toString));

var _toString = Impulse.extend(Number, _toString, function() {
  return "here";
});


var foo = 10;

global.foo = foo;

test(' (foo.toString || _toString).apply(foo) == "10" ');

console.log("\n" + passed + " tests passed, " + failed + " tests failed.\n");
