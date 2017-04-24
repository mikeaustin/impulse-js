'use strict';

var Immutable = require('immutable');

var Parameters = require('../src/runtime/parameters');
var Union = require('../src/runtime/union');

//
// Parameters Tests
//

console.log("\nparameters.js\n");

global.params = new Parameters([{foo: Int, $: 1}, {bar: Union.of(Int, Undefined)}]);

test(' params.apply([10])[0] === 10 ');
test(' params.apply([{foo: 10}])[0] === 10 ');
test(' params.apply([])[0] === 1 ');
//console.log(params.apply(["foo"]));


String.prototype.slice = Parameters.define([{beginIndex: Number}, {endIndex: Union.of(Number, Undefined), $: undefined}], String.prototype.slice);

global.foo = "foo";

test(' foo.slice.apply(foo, [1]) === "oo" ');
test(' foo.slice.apply(foo, [{beginIndex: 1}]) === "oo" ');
test(' foo.slice.apply(foo, [0, {endIndex: 1}]) === "f" ');
test(' foo.slice.apply(foo, [{beginIndex: 0, endIndex: 1}]) === "f" ');


Number.case = String.case = Array.prototype.case = function (that) {
  return this.isTypeOf(that);
}

Number.prototype.case = String.prototype.case = function (that) {
  return this.isEqual(that);
}

Immutable.Range.prototype.case = function (that) {
  return Number.isTypeOf(that) && this.includes(that);
}

var numberOrString = Parameters.define([{foo: Union.of(Number, String, [Int], Boolean)}], function (foo) {
  var $; switch (true) {                            // return switch (foo) {
    case R(1, 5).case(foo):                         //
    case (7).case(foo):     $ = "1..5, 7";  break;  //   case 1..5, 7: "1..5, 7"
    case R(100).case(foo):  $ = "100..Inf"; break;  //   case 10..Inf: "10..Inf"  
    case Number.case(foo):  $ = "Number";   break;  //   case Number:  "Number"
    case String.case(foo):  $ = "String";   break;  //   case String:  "String"
    case [Int].case(foo):   $ = "[Int]";    break;  //   case [Int]:   "[Int]"
    default:                $ = "default";  break;  //   else          "default";
  } return $;                                       // }
});

global.numberOrString = numberOrString;
global.R = Immutable.Range;

test(' numberOrString(10) === "Number" ');
test(' numberOrString("10") === "String" ');
test(' numberOrString([10]) === "[Int]" ');
test(' numberOrString(3) === "1..5, 7" ');
test(' numberOrString(7) === "1..5, 7" ');
test(' numberOrString(200) === "100..Inf" ');
test(' numberOrString(true) === "default" ');
