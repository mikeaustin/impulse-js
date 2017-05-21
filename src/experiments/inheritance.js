"use strict";

function assert(string) {
  var result = eval(string);

  console.log(result + "\t" + string);
}

// Number, String are primitives, Array is an Object

assert("[].constructor === Array");
assert('(0).constructor === Number');
assert('"foo".constructor === String');

console.log("");

assert("[] instanceof Array");
assert('(0) instanceof Number');
assert('"foo" instanceof String');

console.log("");

assert('new Object([]).constructor === Array');
assert('new Object(0).constructor === Number');
assert('new Object("foo").constructor === String');

console.log("");

assert('new Object([]) instanceof Array');
assert('new Object(0) instanceof Number');
assert('new Object("foo") instanceof String');

console.log("");

assert("Array.prototype.isPrototypeOf([])");
assert("Number.prototype.isPrototypeOf(0)");
assert('String.prototype.isPrototypeOf("")');

console.log("");

assert('Array.prototype.isPrototypeOf(new Object([]))');
assert('Number.prototype.isPrototypeOf(new Object(0))');
assert('String.prototype.isPrototypeOf(new Object(""))');

console.log("");

assert('typeof [] === "object"');
assert('typeof 0 === "number"');
assert('typeof "foo" === "string"');

console.log("");

assert('null instanceof String');
assert('String.prototype.isPrototypeOf(null)');

