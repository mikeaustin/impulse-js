"use strict";

var Immutable = require("../node_modules/immutable/dist/immutable.js");

var Impulse = (function() {
  //
  // class Extension
  //
  // Holds information about extension methods and scoping, and provides ways
  // to add and invoke functions. Use extend() to add extension methods.
  //

  function Extension(parent) {
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

    for (var scope = this; scope != null; scope = scope.parent) {
      for (var proto = _this; proto != null; proto = getPrototypeOf(proto)) {

        var method = scope.methods.get(proto);
 
        if (method !== undefined) {
          return method.apply(_this, args);
        }
      }
    }

    return "error";
  }

  //
  // function extend(type, parent, func)
  //
  // Add an extention method to type. Parent is the lexically scoped outer
  // method. Because of hoisting, the first use will be undefined.
  // 

  function extend(type, parent, func) {
    var extension = parent;

    if (parent === undefined || parent.methods.get(type) !== undefined) {
      extension = new Extension(parent);
    }

    return extension.add(type, func);
  }

  return {
    extend: extend
  };
})();


//
// Tests
//

var _toString = Impulse.extend(Object, _toString, function(hideProperties) {
  if (this === Object.prototype) {
    return "Object";
  }

  var getPrototypeOf = Object.getPrototypeOf;
  var constructorName = this.constructor.name + " ";
  var properties = [];

  if (typeof(this) === "object" || typeof(this) === "function") {
    if (!hideProperties) {
      for (var p in this) {
        if (this.hasOwnProperty(p)) {
          properties.push(p + ": " + _toString.apply(this[p], []));
        }
      }
    }

    if (properties.length !== 0)
      return constructorName + "{ " + properties.join(", ") + " }";
    else
      return constructorName + "{ }";
  } else {
    //return this.toString();
  }
});

var _toString = Impulse.extend(Array, _toString, function() {
  if (this === Array.prototype) {
    return "Array";
  }

  return "[" + this.join(", ") + "]";
});

var _toString = Impulse.extend(_toString.methods.constructor, _toString, function() {
  if (this === _toString.methods.constructor.prototype) {
    return "Map";
  }

  var items = this.map(function(value, key) {
    var keyString = _toString.apply(key, [true]);
    var valueString = _toString.apply(value, []);

    return keyString + ": " + valueString;
  }).join(", ");

  return "Map { " + items + " }";
});

console.log(_toString.apply({ foo: [1, 2, 3] }));
console.log(_toString.apply(_toString));

