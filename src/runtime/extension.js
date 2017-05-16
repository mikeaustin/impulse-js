"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");


/**
 * @constructor Extension
 * @memberof module:Impulse
 *
 * @summary Holds information about extension methods and scoping, and provides ways
 * to add and invoke functions. Use extend() to add extension methods.
**/

function Extension(parent, type, func) {
//  this.parent = parent || null;
//  this.type = type;
//  this.func = func;
    this.methods = parent ? new Map(parent.methods) : new Map();
    this.methods.set(type.prototype, func);
}

Extension.prototype.apply = function (_this, _arguments) {
  // for (var scope = this; scope !== null; scope = scope.parent) {
  //   if (scope.type.isTypeOf(_this)) {
  //     return scope.func.apply(_this, args);
  //   }
  // }

  for (var proto = Object.getPrototypeOf(_this); proto !== null; proto = Object.getPrototypeOf(proto)) {
    var method = this.methods.get(proto);

    if (method !== undefined) {
      return method.apply(_this, _arguments);
    }
  }

  throw new Error("No match for method '" + this.type.name + "' found for type '" + this.func.name + "'");
};

Extension.extend = function (parent, type, funcs) {
  var scope = parent ? clone(parent) : new Object();

  for (var name in funcs) {
    scope[name] = new Extension(parent ? parent[name] : null, type, funcs[name]);
  }

  return scope;
}

function clone(object) {
  if (object == null || typeof object != "object") {
    return object;
  }

  var copy = new object.constructor();

  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      copy[property] = object[property];
    }
  }

  return copy;
}

// var Extension = function Extension(parent) {
//   this.parent  = parent || null;
//   this.methods = Immutable.Map();
// };

// // Add a new extention method, passing the type of object and the function

// Extension.prototype.add = function (type, func) {
//   this.methods = this.methods.set(type.prototype, func);

//   return this;
// }

// Extension.prototype.lookup = function (_this) {
//   // Traverse the lexical scope from innermost to outermost
  
//   for (var scope = this; scope !== null; scope = scope.parent) {
//     // Traverse the inheritance hierarchy of _this,
//     // look for a match and call the appropriate function

//     for (var proto = _this; proto !== null; proto = Object.getPrototypeOf(proto)) {
//       var method = scope.methods.get(proto);
 
//       if (method !== undefined) {
//         return method;
//       }
//     }
//   }
// }

// Extension.prototype.construct = function (_this, args) {
//   var constructor = this.lookup(_this);
  
//   function Constructor() {
//     return constructor.apply(this, args);
//   }
  
//   Constructor.prototype = constructor.prototype;
  
//   var instance = new Constructor();
  
//   instance.constructor = constructor;
  
//   return instance;
// }

// Call an extension method, passing in the "this" object and the arguments

// Extension.prototype.apply = function (_this, args) {
//   if (_this === null || _this === undefined) {
//     return _this;
//   }

//   return this.lookup(_this).apply(_this, args);
// }

// // Add an extention method to type. Parent is the lexically scoped outer
// // method. Because of hoisting, the first use will be undefined.

// function extend(type, parent, func) {
//   var extension = parent;

//   extension = new Extension(parent);

//   return extension.add(type, func);
// }


//
// Exports
//

module.exports = Extension;
