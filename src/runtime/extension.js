var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var getPrototypeOf = Object.getPrototypeOf;

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

Extension.prototype.construct = function(_this, args) {
  var constructor = this.lookup(_this);
  
  function Constructor() {
    return constructor.apply(this, args);
  }
  
  Constructor.prototype = constructor.prototype;
  
  var instance = new Constructor();
  
  instance.constructor = constructor;
  
  return instance;
}

Extension.prototype.lookup = function(_this) {
  // Traverse the lexical scope from innermost to outermost
  
  for (var scope = this; scope != null; scope = scope.parent) {
    // Traverse the inheritance hierarchy of _this,
    // look for a match and call the appropriate function
    
    for (var proto = _this; proto != null; proto = getPrototypeOf(proto)) {
      var method = scope.methods.get(proto);
 
      if (method !== undefined) {
        return method;
      }
    }
  }
}

// Call an extension method, passing in the "this" object and the arguments

Extension.prototype.apply = function(_this, args) {
  if (_this === null || _this === undefined) {
    return _this;
  }

  return this.lookup(_this).apply(_this, args);
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


//
// Tests
//

console.log("\nextension.js\n");

var _capitalize = extend(String, _capitalize, function() {
  return this[0].toUpperCase() + this.slice(1);
});

global.foo = "foo";
global._capitalize = _capitalize;

test(' (foo.capitalize || _capitalize).apply(foo) == "Foo" ');
test(' (foo.toUpperCase || _toUppderCase).apply(foo) == "FOO" ');
