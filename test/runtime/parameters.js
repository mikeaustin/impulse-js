'use strict';

var Parameters = require('../../lib/runtime/parameters');
var Union = require('../../lib/runtime/union');
var Range = require('../../lib/runtime/range');
require('../../lib/runtime/types');

//
// Parameters Tests
//

console.log("\nparameters.js\n");

var params = new Parameters([{foo: Int, $: 1}, {bar: Undefined.or(Int)}]);

test(' params.apply([10])[0] === 10 ', {params: params});
test(' params.apply([{foo: 10}])[0] === 10 ', {params: params});
test(' params.apply([])[0] === 1 ', {params: params});


String.prototype.slice.parameters = new Parameters([{begin: Number}, {end: Undefined.or(Number)}]);

var foo = "foo";

test(' foo.slice.apply(foo, [1]) === "oo" ', {foo: foo});
test(' foo.slice.apply(foo, [{begin: 1}]) === "oo" ', {foo: foo});
test(' foo.slice.apply(foo, [0, 1]) === "f" ', {foo: foo});
test(' foo.slice.apply(foo, [0, {end: 1}]) === "f" ', {foo: foo});
test(' foo.slice.apply(foo, [{begin: 0, end: 1}]) === "f" ', {foo: foo});


Number.case = String.case = Array.prototype.case = function (that) {
  return this.isTypeOf(that);
}

Number.prototype.case = String.prototype.case = function (that) {
  return this.isEqual(that);
}

var numberOrString = Parameters.define([{foo: Union.of(Number, String, [Int], Boolean)}], function (foo) {
  var $; switch (true) {                            // return switch (foo) {
    case R(1, 5).case(foo):                         //
    case (7).case(foo):     $ = "1..5, 7";  break;  //   case 1..5, 7: "1..5, 7"
    case R(100, Infinity).case(foo):  $ = "100..Inf"; break;  //   case 10..Inf: "10..Inf"  
    case Number.case(foo):  $ = "Number";   break;  //   case Number:  "Number"
    case String.case(foo):  $ = "String";   break;  //   case String:  "String"
    case [Int].case(foo):   $ = "[Int]";    break;  //   case [Int]:   "[Int]"
    default:                $ = "default";  break;  //   else          "default";
  } return $;                                       // }
});

global.R = Range.of;

test(' numberOrString(10) === "Number" ', {numberOrString: numberOrString});
test(' numberOrString("10") === "String" ', {numberOrString: numberOrString});
test(' numberOrString([10]) === "[Int]" ', {numberOrString: numberOrString});
test(' numberOrString(3) === "1..5, 7" ', {numberOrString: numberOrString});
test(' numberOrString(7) === "1..5, 7" ', {numberOrString: numberOrString});
test(' numberOrString(200) === "100..Inf" ', {numberOrString: numberOrString});
test(' numberOrString(true) === "default" ', {numberOrString: numberOrString});
