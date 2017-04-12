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

Union.isType = function(_this, that) {
  if (getPrototypeOf(that) !== Union.prototype) {
    return false;
  }

  for (var i = 0; i < _this.values.length; i++) {
  console.log("!!!", _this.values[i]);
    if (_this.values[i].constructor.isType(_this.values[i], that.values[i])) {
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

Option.isType = function(_this, that) {
  if (getPrototypeOf(that) !== Option.prototype) {
    return false;
  }

  if (_this.value && _this.value.constructor.isType(_this.value, that.value)) {
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

console.log(Union.of("Foo").constructor.isType(Union.of("Foo"), Union.of(String, Number)));
console.log(Option.of("Foo").constructor.isType(Option.of("Foo"), Option.of(String)));
console.log(Option.of().constructor.isType(Option.of(), Option.of(String)));
