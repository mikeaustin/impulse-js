//
// types.js
//

Boolean.prototype.assertType = String.assertType = function(that) {
  if (!(this instanceof that)) {
    throw Error("Type assertion; Expected a '" + this.constructor.name + "' but found a '" + that.name + "'");
  }
  
  return this;
}

Number.prototype.isType = String.prototype.isType = Array.prototype.isType = function(that) {
  return Object.getPrototypeOf(this) === that.prototype;
}

Number.prototype.isEqual = String.prototype.isEqual = Array.prototype.isEqual = function(that) {
  return this.valueOf() === that;
}

Number.prototype.isType = function(that) {
  if (that.prototype === Int.prototype) {
    return isFinite(this) && Math.floor(this) === this.valueOf();
  }
  
  return Object.getPrototypeOf(this) === that.prototype;
}

global.Int = function Int() { }

global.Int.prototype = new Number();
global.Int.prototype.constructor = Int;

//

Array.prototype.isType = function(type) {
  if (Object.getPrototypeOf(type) !== Array.prototype) {
    return false;
  }
  
  for (var i = 0; i < this.length; i++) {
    if (!this[i].isType(type[0])) {
      return false;
    }
  }

  return true;
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
// Tests
//

//console.log("assertType: ", true.assertType(Boolean));
//console.log("assertType: ", "foo".constructor.assertType("foo", Boolean));

test(' (1).isType(Number) == true ');
test(' (1).isType(Int) == true ');
test(' (1.5).isType(Int) == false ');

test(' "foo".isType(String) == true ');

test(' Object.getPrototypeOf("foo") == String.prototype ')

test(' (1).isEqual(1) ');
