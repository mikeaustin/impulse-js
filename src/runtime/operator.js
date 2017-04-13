"use strict";

var extend = require("../runtime/extension.js").extend;




//
// Tests
//

Number.prototype.add = function(that) { return this + that; };

var x = 2;


var _mul = extend(Number, _mul, function(that) { return this * that; });

global.x = x;
global._mul = _mul;

test(' (x.add || _add).apply(x, [3]) == 5 ');
test(' (x.mul || _mul).apply(x, [3]) == 6 ');
