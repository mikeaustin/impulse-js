"use strict";

var Tuple = require("./runtime/tuple.js");
var Union = require("./runtime/union.js");
var Extension = require("./runtime/extension.js");
var Parameters = require("./runtime/parameters.js");
var Module = require("./runtime/module.js");

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

var U = "undefined";
var T = Impulse.Tuple.of;

console.log(_toString.apply({ foo: [1, 2, 3] }));
console.log(_toString.apply(_toString));

console.log(_toString.apply(10));
console.log((10).toString());

var _toString = Impulse.extend(Number, _toString, function() {
  return "here";
});


var foo = 10;

console.log((foo.toString || _toString).apply(foo));
