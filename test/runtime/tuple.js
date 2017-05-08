'use strict';

var Tuple = require('../../src/runtime/tuple');

console.log("\ntuple.js\n");

test(' Tuple.of(1, 2).concat(Tuple.of(3, 4)).isEqual(Tuple.of(1, 2, 3, 4)) === true', {Tuple: Tuple});
//test(' (T([1, 2], [3, 4]).map((a, b) => a + b)).isEqual([4, 6]) ');
//console.log(T(R(1, 2), R(3, 4)).map((a, b) => a + b));
test(' Tuple.of().isTypeOf(Tuple.of()) === true', {Tuple: Tuple});
test(' Tuple.of(String, Number).isTypeOf(Tuple.of("foo", 5)) === true', {Tuple: Tuple});
test(' Tuple.of(String, Tuple.of(Number, String), [Number]).isTypeOf(Tuple.of("foo", Tuple.of(10, "bar"), [1, 2, 3])) === true', {Tuple: Tuple});
