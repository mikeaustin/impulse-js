"use strict";

var Extension = require("../runtime/extension");


/**
 * @constructor Trait
 * @memberof module:impulse
 *
 * @summary Traits allow classes to be extended without modification, and support isTypeOf() when used as parameters.
**/

function Trait(parent, funcs, required) {
  this._parent = parent || null;
  this._types = new Set();
  this._methods = funcs;
  
  this.required = required;
}

Trait.isTypeOf = function(that) {
  return that instanceof this;
}

Trait.prototype.add = function (type) {
  this._types = this._types.add(type);

  return this;
}

Trait.prototype.isTypeOf = function (value) {
  for (var scope = this; scope !== null; scope = scope._parent) {
    for (var type of scope._types) {
      if (type.isTypeOf(value)) {
        return true;
      }
    }
  }

  return false;
}

Trait.prototype.bind = function() {
  return this._methods.apply(null, arguments);
}

Trait.addtrait = function(type, parent) {
  var trait = parent ? clone(parent) : new Trait();

  return trait.add(type);
}

function clone(object) {
  if (object == null || typeof object != "object") {
    return object;
  }

  var copy = new object.constructor();

  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      copy[property] = object[property];
    }
  }

  return copy;
}


//
// Exports
//

module.exports = Trait;

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
