var Immutable = require("../../node_modules/immutable/dist/immutable.js");

//
// class Extension
//
// Holds information about extension methods and scoping, and provides ways
// to add and invoke functions. Use extend() to add extension methods.
//

var Extension = function Extension(parent) {
  this.parent  = parent || null;
  this.methods = Immutable.Map();
};

// Add a new extention method, passing the type of object and the function

Extension.prototype.add = function(type, func) {
  this.methods = this.methods.set(type.prototype, func);

  return this;
}

// Call an extension method, passing in the "this" object and the arguments

Extension.prototype.apply = function(_this, args) {
  if (_this === null || _this === undefined) {
    return _this;
  }

  var getPrototypeOf = Object.getPrototypeOf;

  // Traverse the lexical scope from innermost to outermost
  
  for (var scope = this; scope != null; scope = scope.parent) {
    // Traverse the inheritance hierarchy of _this,
    // look for a match and call the appropriate function
    
    for (var proto = _this; proto != null; proto = getPrototypeOf(proto)) {
      var method = scope.methods.get(proto);
 
      if (method !== undefined) {
        return method.apply(_this, args);
      }
    }
  }

  return "error";
}

// Add an extention method to type. Parent is the lexically scoped outer
// method. Because of hoisting, the first use will be undefined.

function extend(type, parent, func) {
  var extension = parent;

  if (parent === undefined || parent.methods.get(type) !== undefined) {
    extension = new Extension(parent);
  }

  return extension.add(type, func);
}

module.exports = {
  extend: extend
}
