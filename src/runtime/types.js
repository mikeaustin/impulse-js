"use strict";

var Union = require('../../src/runtime/union');


//
// class DivideByZero
//

global.DivideByZeroError = function (message) {
  this.name = "DivideByZeroError";
  this.message = message;
}

DivideByZeroError.prototype = new Error();
DivideByZeroError.prototype.constructor = DivideByZeroError;


//
// class Int
//

global.Int = function Int() { }

global.Int.prototype = new Number();
global.Int.prototype.constructor = Int;


//
// class Undefined
//

global.Undefined = function Undefined() { }
global.Undefined.isTypeOf = function (value) { return value === undefined; }
global.Undefined.or = function (that) { return Union.of(this, that); }


//
// assertType(that)
//

Boolean.prototype.assertType = String.assertType = function (that) {
  if (!(this instanceof that)) {
    throw new Error("Type assertion; Expected a '" + this.constructor.name + "' but found a '" + that.name + "'");
  }
  
  return this;
}


//
// this.isTypeOf(that)
//

Function.prototype.isTypeOf = function (that) {
  return that instanceof this;
}

Object.isTypeOf = function (that) {
  //return this.prototype.isPrototypeOf(Object(that));
  return Object(that) instanceof this;
}

Number.isTypeOf = function (that) {
  return typeof that === "number" || that instanceof this;
}

String.isTypeOf = function (that) {
  return typeof that === "string" || this.prototype.isPrototypeOf(that);
}

Boolean.isTypeOf = function (that) {
  return typeof that === "boolean" || this.prototype.isPrototypeOf(that);
}

Int.isTypeOf = function (that) {
  if (!(typeof that === "number" || this.prototype.isPrototypeOf(that))) {
    return false;
  }

  return isFinite(that) && Math.floor(that) === that;
}

Array.prototype.isTypeOf = function (that) {
  if (!Object.getPrototypeOf(this).isPrototypeOf(that)) {
    return false;
  }

  if (this[0] === Object.prototype) {
    return true;
  }

  for (var i = 0; i < that.length; i++) {
    if (!this[0].isTypeOf(that[i])) {
      return false;
    }
  }

  return true;
}


//
// this.isEqual(that)
//

Boolean.prototype.isEqual = Number.prototype.isEqual = String.prototype.isEqual = function (that) {
  return this.valueOf() === that;
}

Array.prototype.isEqual = function (that) {
  if (Object.getPrototypeOf(that) !== Array.prototype) {
    return false;
  }
  
  for (var i = 0; i < this.length && i < that.length; i++) {
    if (!this[i].isEqual(that[i])) {
      return false;
    }
  }

  return true;
}

Array.prototype._eql = Array.prototype.isEqual;


//
// this.from(value)
//

Boolean.from = function (value) {
  if (Boolean.isTypeOf(value)) {
    return value;
  }
  
  if (String.isTypeOf(value)) {
    switch (value) {
      case "true": return true;
      case "false": return false;
    }
  }
  
  throw new TypeError("Can't convert " + value + " to Boolean");
}

//
// Returns the argument converted to a Number, or returns the
// argument itself if already a number. Throws a TypeError if
// the argument can't be converted.
//

Number.from = function (value, radix) {
  // Return value if primitive or new String()

  if (Number.isTypeOf(value)) {
    return value;
  }

  // Return string value if it can be converted

  if (String.isTypeOf(value)) {
    var number = parseFloat(value);

    if (!isNaN(number)) {
      return number;
    }
  }

  // If it can't be converted, throw an exception

  throw new TypeError("Can't convert " + value + " to Number");
}

Int.from = function (value, radix) {
  // Return value if primitive or new String()

  if (Int.isTypeOf(value)) {
    return value;
  }

  // Return string value if it can be converted

  if (String.isTypeOf(value)) {
    if (value.indexOf(".") < 0) {
      var number = parseInt(value, radix);

      if (!isNaN(number)) {
        return number;
      }
    }
  }

  // If it can't be converted, throw an exception

  throw new TypeError("Can't convert " + value + " to Number");
}

String.from = function (value, separator) {
  if (String.isTypeOf(value)) {
    return value;
  }

  if (Number.isTypeOf(value)) {
    return value.toString();
  } else if ([String].isTypeOf(value)) {
    return value.join(separator ? separator : "");
  }

  throw new TypeError("Can't convert " + value + " to String");
}
