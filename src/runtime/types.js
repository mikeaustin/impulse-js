"use strict";

global.Int = function Int() { }

global.Int.prototype = new Number();
global.Int.prototype.constructor = Int;

global.Undefined = function Undefined() { }
global.Undefined.isTypeOf = function(that) { return that === undefined; }


Boolean.prototype.assertType = String.assertType = function(that) {
  if (!(this instanceof that)) {
    throw Error("Type assertion; Expected a '" + this.constructor.name + "' but found a '" + that.name + "'");
  }
  
  return this;
}


//
// Object.isTypeOf(that)
//

Object.isTypeOf = function(that) {
  return this.prototype.isPrototypeOf(Object(that));
}

Number.isTypeOf = function(that) {
  return typeof that === "number" || that instanceof this;
}

String.isTypeOf = function(that) {
  return typeof that === "string" || this.prototype.isPrototypeOf(that);
}

Boolean.isTypeOf = function(that) {
  return typeof that === "boolean" || this.prototype.isPrototypeOf(that);
}

Int.isTypeOf = function(that) {
  if (!(typeof that === "number" || this.prototype.isPrototypeOf(that))) {
    return false;
  }

  return isFinite(that) && Math.floor(that) === that;
}

Array.prototype.isTypeOf = function(that) {
  if (!Object.getPrototypeOf(this).isPrototypeOf(that)) {
    return false;
  }

  for (var i = 0; i < that.length; i++) {
    if (!this[0].isTypeOf(that[i])) {
      return false;
    }
  }

  return true;
}


//
// Object.isEqual(that)
//

Boolean.prototype.isEqual = Number.prototype.isEqual = String.prototype.isEqual = function(that) {
  return this.valueOf() === that;
}

Array.prototype.isEqual = function(that) {
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


//
// Object.from(value)
//

Boolean.from = function(value) {
  if (Boolean.isTypeOf(value)) {
    return value;
  }
  
  if (String.isTypeOf(value)) {
    switch (value) {
      case "true": return true;
      case "false": return false;
    }
  }
  
  throw TypeError("Can't convert " + value + " to Boolean");
}

//
// Returns the argument converted to a Number, or returns the
// argument itself if already a number. Throws a TypeError if
// the argument can't be converted.
//

Number.from = function(value, radix) {
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

  throw TypeError("Can't convert " + value + " to Number");
}

Int.from = function(value, radix) {
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

  throw TypeError("Can't convert " + value + " to Number");
}

String.from = function(value, separator) {
  if (String.isTypeOf(value)) {
    return value;
  }

  if (Number.isTypeOf(value)) {
    return value.toString();
  } else if ([String].isTypeOf(value)) {
    return value.join(separator ? separator : "");
  }

  throw TypeError("Can't convert " + value + " to String");
}


//
// Tests
//

console.log("\ntypes.js\n");

test(' Number.from("1.5") === 1.5 ');
test(' Int.from("FF", 16) === 255 ');
test(' Number.from("foo") === "TypeError" ', function(e) { return e instanceof TypeError; } );
test(' Int.from("1.5") === "TypeError" ', function(e) { return e instanceof TypeError; } );
test(' String.from(["a", "b"]) === "ab" ');
test(' String.from(["a", "b"], ", ") === "a, b" ');
test(' Boolean.from("false") === false ');

console.log("");

//console.log("assertType: ", true.assertType(Boolean));
//console.log("assertType: ", "foo".constructor.assertType("foo", Boolean));

test(' (1).isEqual(1) === true ');
test(' ("foo").isEqual("foo") === true ');
test(' (true).isEqual(true) === true ');

console.log("");

test(' Number.isTypeOf(1) === true ');
test(' Int.isTypeOf(1) === true ');
test(' Int.isTypeOf(1.5) === false ');
test(' String.isTypeOf("foo") === true ');
test(' Boolean.isTypeOf(true) === true ')

console.log("");

test(' [].isTypeOf([]) ');
test(' [Number].isTypeOf([1, 2, 3]) === true ')
test(' [String].isTypeOf(["foo", "bar"]) === true ')
test(' [Number].isTypeOf([1, 2, "x"]) === false ')
test(' [Object].isTypeOf([1, "foo"]) === true');
