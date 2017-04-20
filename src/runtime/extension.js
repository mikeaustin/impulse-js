"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");


//
// class Extension
//
// Holds information about extension methods and scoping, and provides ways
// to add and invoke functions. Use extend() to add extension methods.
//

function Extension(parent, type, func) {
  this.parent = parent || null;
  this.type = type;
  this.func = func;
}

Extension.prototype.apply = function (_this, args) {
  for (var scope = this; scope !== null; scope = scope.parent) {
    if (scope.type.isTypeOf(_this)) {
      return scope.func.apply(_this, args);
    }
  }
};

Extension.extend = function (parent, type, funcs) {
  function Scope() { }

  Scope.prototype = parent || null;

  var scope = new Scope();

  for (var name in funcs) {
    scope[name] = new this(parent ? parent[name] : null, type, funcs[name]);
  }

  return scope;
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

// module.exports = {
//   //extend: extend,
//   Extension
// }

module.exports = Extension;

//
// Tests
//

console.log("\nextension.js\n");

// var _methods = String.extend(_methods, null, {
//  capitalize: function () {
//    return this[0].toUpperCase() + this.slice(1);
//  }
// });

var _methods = Extension.extend(_methods, String, {
  capitalize: function () {
    return this[0].toUpperCase() + this.slice(1);
  }
});

var _methods = Extension.extend(_methods, Number, {
  factorial: function factorial() {
    if (this === 0) {
      return 1;
    }

    return this * factorial.apply(this - 1);
  }
});

global._methods = _methods;

test(' var foo = "foo"; (foo.capitalize || _methods.capitalize).apply(foo) === "Foo" ');
test(' var foo = "foo"; (foo.toUpperCase || _methods.toUppderCase).apply(foo) === "FOO" ');
test(' var num = 5; (num.factorial || _methods.factorial).apply(num, []) === 120 ');
