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
  if (getPrototypeOf(that) !== Tuple.prototype ||
      this.values.length != that.values.length) {
    return false;
  }

  for (var i = 0; i < this.values.length; i++) {
    if (this.values[i].isType(that.values[i])) {
      return true;
    }
  }

  return false;
}

module.exports = {
  Union: Union
};
