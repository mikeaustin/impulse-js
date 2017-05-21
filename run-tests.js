// "use strict";

var execSync = require('child_process').execSync;

function system(command) {
  console.log(execSync(command).toString());
}

var passed = 0;
var failed = 0;

console.log("Impulse-JS Tests");

global.test = function (expression, context, onException) {
  var context = context || { };
  var result;

  try {
    with (context) {
      result = eval(expression);
    }
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

require("./lib/runtime/types");

// Runtime

require("./test/runtime/types");
require('./test/runtime/tuple');
require('./test/runtime/Union');
require('./test/runtime/extension');
require('./test/runtime/module');
require('./test/runtime/operator');
require('./test/runtime/parameters');

system('bin/impulse-js ./test/impulse/basics.im.js | node');
system('bin/impulse-js ./test/impulse/iterator.im.js | node');

// // Runtime

// var Types = require("./runtime/types");
// var Tuple = require("./runtime/tuple.js");
// var Union = require("./runtime/union.js");
// var Extension = require("./runtime/extension.js");
// var Parameters = require("./runtime/parameters.js");
// var Module = require("./runtime/module.js");
// var Operator = require("./runtime/operator.js");

// // Library

//var Extensions = require("./library/extensions.js");
// var Extensions = require("./library/HTML.js");

console.log("\n" + passed + " tests passed, " + failed + " tests failed.\n");
