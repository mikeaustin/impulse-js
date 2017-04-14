"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var getPrototypeOf = Object.getPrototypeOf;


//
// class Union
//

function Union(iterable) {
  this.values = Array.prototype.slice.call(iterable, 0);
}

Union.of = function() {
  return new Union(arguments);
};

// Union.prototype.from = function(that) {
//   return new Union([that]);
// }

Union.prototype.isTypeOf = function(that) {
  if (that instanceof Union) {
    for (var i = 0; i < this.values.length; i++) {
      if (this.values[i].isTypeOf(that.values[0])) {
        return true;
      }
    }
  }

  for (var i = 0; i < this.values.length; i++) {
    if (this.values[i].isTypeOf(that)) {
      return true;
    }
  }

  return false;
}

Union.prototype.match = function() {
  for (var i = 0; i < arguments.length; i++) {
    var parameterType = arguments[i].parameters[0].type;

    if (parameterType.isTypeOf(this.values[0])) {
      return arguments[i](this.values[0]);
    }
  }

  throw Error("No match");
}


//
// class Option
//

function Option(value) {
  this.value = value;
};

Option.of = function(value) {
  return new Option(value);
};

Option.prototype.isType = function(that) {
  if (getPrototypeOf(that) !== Option.prototype) {
    return false;
  }

  if (this.value && this.value.isType(that.value)) {
    return true;
  }
  
  return false;
}

module.exports = {
  Union: Union,
  Option: Option
};


//
// Tests
//

console.log("\nunion.js\n");

global.Union = Union;
global.Option = Option;

test(' Union.of(Number).isTypeOf(10) === true ');
test(' Union.of(Number, String).isTypeOf(10) === true');
test(' Union.of(Number, String).isTypeOf("foo") === true');
test(' Union.of(Number, String).isTypeOf(true) === false ')
test(' Union.of(Int, String).isTypeOf(1.5) === false ')
