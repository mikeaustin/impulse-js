"use strict";

//
// An extension method helper type that:
//
// * Holds information about extension methods and scoping, and
// * Provides ways to add and invoke functions
//

var Extension = function (parent) {
  this.parent  = parent || null;
  this.methods = new Map();
};

// Add a new extention method, passing the type of object and the function

Extension.prototype.add = function (type, func) {
  this.methods.set(type.prototype, func);
}

// Call an extension method, passing in the "this" object and the arguments

Extension.prototype.apply = function (_this, args) {
  var getPrototypeOf = Object.getPrototypeOf;

  for (var scope = this; scope != null; scope = scope.parent) {
    for (var proto = getPrototypeOf(_this); proto != null; proto = getPrototypeOf(proto)) {
      var method = scope.methods.get(proto);
      
      if (method !== undefined) {
        return method.apply(_this, args);
      }
    }
  }
}


var _toString = new Extension(_toString);

_toString.add(Object, function () {
  return this.toString();
});

//_toString.add(Object, function () {
//  var str = "";
//
//  if (Object.getPrototypeOf(this) === Object.prototype) {
//    for (var p in this) {
//      str += p + ": " + this[p];
//    }
//  
//    return "{ " + str + " }";
//  } else {
//    return this.toString();
//  }
//});

function test() {
  _toString = new Extension(_toString);
  
  _toString.add(Array, function () {
    return "[" + this.join(", ") + "]";
  });
  
  console.log(_toString.apply(10, []));
  console.log(_toString.apply([1, 2, 3], []));
}

test();

/*

"use strict";

var Extension = function (parent) {
  this.parent  = parent || null;
  this.methods = new Map();
};

Extension.prototype.add = function (type, func) {
  this.methods.set(type.prototype, func);
}

Extension.prototype.apply = function (self, args) {
  var getPrototypeOf = Object.getPrototypeOf;

  for (var scope = this; scope != null; scope = scope.parent) {
    for (var proto = getPrototypeOf(self); proto != null; proto = getPrototypeOf(proto)) {
      var method = scope.methods.get(proto);
      
      if (method !== undefined) {
        return method.apply(self, args);
      }
    }
  }
}

var extend = function (parent) {
  var ext = new Extension(parent);
  
  var extension = function () {
    return ext.apply(arguments[0], Array.prototype.shift.apply(arguments));
  }

  extension.add = Extension.prototype.add.bind(ext);
  extension.apply = Extension.prototype.apply.bind(ext);
  
  return extension;
}

//var _toString = new Extension(_toString);
var _toString = extend(_toString);

_toString.add(Object, function () {
  var str = "";

  if (Object.getPrototypeOf(this) === Object.prototype) {
    for (var p in this) {
      str += p + ": " + this[p];
    }
  
    return "{ " + str + " }";
  } else {
    return this.toString();
  }
});

var _power = new Extension();

_power.add(Number, function (exp) {
  return Math.pow(this, exp);
});

function test() {
//  _toString = new Extension(_toString);
  var _toString = extend(_toString);
  
  _toString.add(Array, function () {
    return "[" + this.join(", ") + "]";
  });
  
  console.log(_toString.apply([1, 2, 3], []));
  console.log(_toString([1, 2, 3]));
}

test();

//(function (_toString, _power) {
//  _toString.add(Array, function () {
//    return "[" + this.join(", ") + "]";
//  });
//
//  console.log(_power.apply(5, [2]));
//  console.log(_toString.apply(1, []));
//  console.log(_toString.apply([1, 2, 3], []));
//  console.log(_toString.apply({ foo: 10 }, []));
//})
//(new Extension(_toString), new Extension(_power));

*/
