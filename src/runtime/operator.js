"use strict";

var extend = require("../runtime/extension.js").extend;


Number.prototype.add = function(that) { return this + that; };

var x = 2;


var _mul = extend(Number, _mul, function(that) { return this * that; });

console.log("aaa", (x.add || _add).apply(x, [3]));
console.log("aaa", (x.mul || _mul).apply(x, [3]));
