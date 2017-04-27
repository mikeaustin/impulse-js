'use strict';

var Tuple = require('../../src/runtime/tuple');

console.log("\ntuple.js\n");

global.T = Tuple.of;

test(' T(1, 2).concat(T(3, 4)).isEqual(T(1, 2, 3, 4)) === true');
//test(' (T([1, 2], [3, 4]).map((a, b) => a + b)).isEqual([4, 6]) ');
//console.log(T(R(1, 2), R(3, 4)).map((a, b) => a + b));
test(' T().isTypeOf(T()) === true');
test(' T(String, Number).isTypeOf(T("foo", 5)) === true');
test(' T(String, T(Number, String), [Number]).isTypeOf(T("foo", T(10, "bar"), [1, 2, 3])) === true');
