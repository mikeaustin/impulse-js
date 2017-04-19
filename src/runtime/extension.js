"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");


//
// class Extension
//
// Holds information about extension methods and scoping, and provides ways
// to add and invoke functions. Use extend() to add extension methods.
//

function Extension2(parent, type, func) {
  this.parent = parent || null;
  this.type = type;
  this.func = func;
}

Extension2.prototype.apply = function (_this, args) {
  for (var scope = this; scope !== null; scope = scope.parent) {
    if (scope.type.isTypeOf(_this)) {
      return scope.func.apply(_this, args);
    }
  }
};

Extension2.extend = function (parent, type, funcs) {
  function Scope() { }

  Scope.prototype = parent || null;

  var scope = new Scope();

  for (var name in funcs) {
    scope[name] = new this(parent ? parent[name] : null, type, funcs[name]);
  }

  return scope;
}

var _methods = Extension2.extend(_methods, Number, {
  add: function (that) {
    return this + that;
  },

  sub: function (that) {
    return this - that;
  }
});

console.log(_methods.add.apply(2, [3]), _methods.sub.apply(2, [3]));


var Extension = function Extension(parent) {
  this.parent  = parent || null;
  this.methods = Immutable.Map();
};

// Add a new extention method, passing the type of object and the function

Extension.prototype.add = function (type, func) {
  this.methods = this.methods.set(type.prototype, func);

  return this;
}

Extension.prototype.lookup = function (_this) {
  // Traverse the lexical scope from innermost to outermost
  
  for (var scope = this; scope !== null; scope = scope.parent) {
    // Traverse the inheritance hierarchy of _this,
    // look for a match and call the appropriate function

    for (var proto = _this; proto !== null; proto = Object.getPrototypeOf(proto)) {
      var method = scope.methods.get(proto);
 
      if (method !== undefined) {
        return method;
      }
    }
  }
}

Extension.prototype.construct = function (_this, args) {
  var constructor = this.lookup(_this);
  
  function Constructor() {
    return constructor.apply(this, args);
  }
  
  Constructor.prototype = constructor.prototype;
  
  var instance = new Constructor();
  
  instance.constructor = constructor;
  
  return instance;
}

// Call an extension method, passing in the "this" object and the arguments

Extension.prototype.apply = function (_this, args) {
  if (_this === null || _this === undefined) {
    return _this;
  }

  return this.lookup(_this).apply(_this, args);
}

// Add an extention method to type. Parent is the lexically scoped outer
// method. Because of hoisting, the first use will be undefined.

function extend(type, parent, func) {
  var extension = parent;

  //if (parent === undefined || parent.methods.get(type) !== undefined) {
    extension = new Extension(parent);
  //}

  return extension.add(type, func);
}

module.exports = {
  extend: extend
}


//
// Tests
//

console.log("\nextension.js\n");

var _capitalize = extend(String, _capitalize, function () {
  return this[0].toUpperCase() + this.slice(1);
});

var _factorial = extend(Number, _factorial, function _factorial() {
  if (this === 0) {
    return 1;
  }

  return this * _factorial.apply(this - 1);
});

global.foo = "foo";
global._capitalize = _capitalize;
global._factorial = _factorial;

test(' (foo.capitalize || _capitalize).apply(foo) === "Foo" ');
test(' (foo.toUpperCase || _toUppderCase).apply(foo) === "FOO" ');

test(' _factorial.apply(5, []) === 120 ');
