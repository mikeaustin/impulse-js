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

Union.prototype.isType = function(type) {
  if (getPrototypeOf(type) !== Union.prototype) {
    return false;
  }

  for (var i = 0; i < type.values.length; i++) {
    if (this.values[0].isType(type.values[i])) {
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

global.Union = Union;
global.Option = Option;

test(' Union.of("Foo").isType(Union.of(String, Number)) == true ');
test(' Option.of("Foo").isType(Option.of(String)) == true ');
test(' Option.of().isType(Option.of(String)) == false ');
