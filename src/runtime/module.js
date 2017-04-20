"use strict";

var Extension = require("../runtime/extension");


function Trait(parent, funcs) {
  this.parent = parent || null;
  this.types = new Set();
  this.methods = parent ? parent.methods : { };

  for (var name in funcs) {
    this.methods[name] = funcs[name];
  }
}

Trait.isTypeOf = function(that) {
  return that instanceof this;
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

Trait.prototype.bind = function () {
  var methods = { };

  for (var name in this.methods) {
    methods[name] = this.methods[name].apply(null, arguments);
  }

  return methods;
}

function addtrait(type, parent) {
  var trait = new Trait(parent);

  return trait.add(type);
}

module.exports = Trait;

//

var Iterable = new Trait(Iterable, {
  map: function (iterator) {
    return function (func) {
      var array = [];
    
      var iter = iterator.apply(this);
    
      while (iter.moveNext()) {
        array.push(func(iter.value()));
      }
      
      return array;
    }
  }
});

//

var Iterator = function Iterator(array) {
  this.array = array;
  this.index = -1;
}

Iterator.prototype.moveNext = function () { return ++this.index < this.array.length; }
Iterator.prototype.value = function () { return this.array[this.index]; }

var _methods = Extension.extend(_methods, String, {
  iterator: function () {
    return new Iterator(this);
  }
});

var _methods = Extension.extend(_methods, String, Iterable.bind(_methods.iterator));


//
// Tests
//

global._methods = _methods;
global.Iterable = Iterable;

console.log("\nmodule.js\n");

test(' _methods.map.apply("abc", [c => c.charCodeAt(0)]).isEqual([97, 98, 99]) ');

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
