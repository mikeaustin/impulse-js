"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");
var extend = require("../runtime/extension.js").extend;


function Trait(parent, type) {
  this.parent = parent || null;
  this.types = new Set(type ? [type] : []);
  this.methods = { };
}

Trait.prototype.add = function (type) {
  this.types = this.types.add(type.prototype);

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

var Iterable = new Trait(Iterable);

Iterable.methods.map = function (iterate) {
  return function(func) {
    var array = [];
  
    var iter = iterate.apply(this);
  
    while (iter.moveNext()) {
      array.push(func(iter.value()));
    }
    
    return array;
  }
}


var Iterable = new Trait(Iterable, [Number]);

console.log(Iterable.isTypeOf([1, 2, 3]));
console.log(Iterable.isTypeOf(["foobar"]));


var array = [1, 2, 3];

var _Iterator = extend(Array, _Iterator, function() {
  var Iterator = function Iterator(array) {
    this.array = array;
    this.index = -1;
  }

  Iterator.prototype.moveNext = function() { return ++this.index < this.array.length; }
  Iterator.prototype.value = function() { return this.array[this.index]; }
  
  return Iterator;
}());

var _iterate = extend(Array, _iterate, function() {
  return _Iterator.construct(Array.prototype, [this]);
});

var _map = extend(Array, _map, Iterable.parent.methods.map(_iterate));


//
// Tests
//

global.array = array;
global._map = _map;

console.log("\nmodule.js\n");

test(' _map.apply(array, [n => n * n]).isEqual([1, 4, 9]) ');


// void function() {
//   function Iterable() {
//   }

//   Iterable.isTypeOf = function (value) {

//   }

//   var _filter = extend(Iterable, _filter, function(func) {

//   });

//   var foo = define({iterable: _Iterable}, function (iterable) {
//     iterable.map(function (n) { return n * n ; });
//   });
// }();

/*

How do you implement nested classes?
Copy methods or walk traits tree?
Add traits to constructor or instanced objects?


trait Iterable {
  function map(iterator)(func) {
    var array = [];
    
    var iter = this._traits.get(Iterable).iterator();
    while (iter.moveNext()) {
      array.push(iter.value());
    }
    
    return array;
  }
}

extend Array implements Iterable {
  class Iterator() {
    function moveNext() {
      this.index = this.index + 1;
    }
    
    function value() {
      return this.array[this.index];
    }
  }
  
  function Iterable.iterator() {
    return new Array.Iterator(this);
  }
}


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
