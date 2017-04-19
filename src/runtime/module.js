"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");
var extend = require("../runtime/extension.js").extend;
var Extension2 = require("../runtime/extension").Extension2;


function Trait(parent) {
  this.parent = parent || null;
  this.types = new Set();
  this.methods = parent ? parent.methods : { };
}

Trait.prototype.add = function (type) {
  this.types = this.types.add(type);

  return this;
}

Trait.prototype.isTypeOf = function (value) {
  for (var scope = this; scope !== null; scope = scope.parent) {
    for (var type of scope.types) {
      if (type.isTypeOf(value)) {
        return true;
      }
    }
  }

  return false;
}

function addtrait(type, parent) {
  var trait = new Trait(parent);

  return trait.add(type);
}

module.exports = {
  name: "Module",
  Trait: Trait
}

//

var Iterable = new Trait();

Iterable.methods.map = function (iterate) {
  return function (func) {
    var array = [];
  
    var iter = iterate.apply(this);
  
    while (iter.moveNext()) {
      array.push(func(iter.value()));
    }
    
    return array;
  }
}

//

var Iterator = function Iterator(array) {
  this.array = array;
  this.index = -1;
}

Iterator.prototype.moveNext = function () { return ++this.index < this.array.length; }
Iterator.prototype.value = function () { return this.array[this.index]; }

var _methods = Extension2.extend(_methods, [Object], {
  iterate: function () {
    return new Iterator(this);
  }
});

var _methods = Extension2.extend(_methods, [Object], {
  map: Iterable.methods.map(_methods.iterate),
});

// for (var name in Iterable.methods) {
//   eval("var _" + name + " = Iterable.methods[name]");
// }

//
// Tests
//

global.array = [1, 2, 3];
global._methods = _methods;
global.Iterable = Iterable;

console.log("\nmodule.js\n");

test(' _methods.map.apply(array, [n => n * n]).isEqual([1, 4, 9]) ');

void function () {
  var Iterable = new addtrait([Number], Iterable);

  var temp = global.Iterable;
  global.Iterable = Iterable;

  test(' Iterable.isTypeOf([1, 2, 3]) === true ');
  test(' [Number].isTypeOf([1, 2, 3]) === true ');
  test(' Iterable.isTypeOf(["foobar"]) === false ');

  global.Iterable = temp;
}();

test(' Iterable.isTypeOf([1, 2, 3]) === false ');

/*

Value : Type

0 : 1	Bottom								== Void
1 : 1	Unit					()			== ()
1 : 1	Scalar					1			== Number
1 : N	Union or Intersection	1			== (Number | String), (Number & String)
N : 1	Array					[1, 2, 3]	== [Number]
N : N	Record					(1, "foo")	== (Number, String)

1 : 0	Untyped Scalar
N : 1	Top						1, "foo"	== Object


import { symbol } from "core-js/es6/symbol";

import * from core-js.fn.object.assign;


eval("var symbol = Symbol.symbol;");


import foo, bar from library;

import * from library.module;

*/
