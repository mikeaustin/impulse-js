'use strict';

var Union = require('../../src/runtime/Union');

//
// Union Tests
//

console.log("\nunion.js\n");

global.Union = Union;
//global.Option = Option;

test(' Union.of(Number).isTypeOf(10) === true ');
test(' Union.of(Number, String).isTypeOf(10) === true');
test(' Union.of(Number, String).isTypeOf("foo") === true');
test(' Union.of(Number, String).isTypeOf(true) === false ')
test(' Union.of(Int, String).isTypeOf(1.5) === false ')
