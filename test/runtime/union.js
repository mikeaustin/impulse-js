'use strict';

var Union = require('../../lib/runtime/union');

//
// Union Tests
//

console.log("\nunion.js\n");

test(' Union.of(Number).isTypeOf(10) === true ', {Union: Union});
test(' Union.of(Number, String).isTypeOf(10) === true', {Union: Union});
test(' Union.of(Number, String).isTypeOf("foo") === true', {Union: Union});
test(' Union.of(Number, String).isTypeOf(true) === false ', {Union: Union});
test(' Union.of(Int, String).isTypeOf(1.5) === false ', {Union: Union});
