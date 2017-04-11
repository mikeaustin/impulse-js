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

//

Union.prototype.isType = function(that) {
  if (getPrototypeOf(that) !== Union.prototype) {
    return false;
  }

  for (var i = 0; i < this.values.length; i++) {
    if (this.values[i].isType(that.values[i])) {
      return true;
    }
  }

  return false;
};


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

console.log(Union.of("Foo").isType(Union.of(String, Number)));
console.log(Option.of("Foo").isType(Option.of(String)));
console.log(Option.of().isType(Option.of(String)));
