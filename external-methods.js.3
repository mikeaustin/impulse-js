"use strict";

var Stack = {
  array: [],

  push: function() {
    var methods = { };

    this.array.push(methods);
  },

  pop: function() {
    this.array.pop();
  },

  peek: function() {
    return this.array[this.array.length - 1];
  },

  method: function(name) {
    return this.peek()[name];
  }
};

var define = function(name, type, func) {
  var methods = Stack.peek();

  if (!methods.hasOwnProperty(name)) {
    methods[name] = new Map();
  }

  methods[name].set(type.prototype, func);
  
  return methods[name];
};

Object.prototype.invoke = function(name, args) {
  var getPrototypeOf = Object.getPrototypeOf;

  for (var i = Stack.array.length - 1; i >= 0; --i) {
    var methods = Stack.array[i];

    if (typeof name !== "string") {
      var types = name;
      
      for (var proto = getPrototypeOf(this); proto != null; proto = getPrototypeOf(proto)) {
        var func = types.get(proto);
        
        if (func !== undefined) {
          return func.apply(this, args);
        }
      }
    }

    if (methods.hasOwnProperty(name)) {
      var types = methods[name];

      for (var proto = getPrototypeOf(this); proto != null; proto = getPrototypeOf(proto)) {
        var func = types.get(proto);
        
        if (func !== undefined) {
          return func.apply(this, args);
        }
      }
    }
  }

  var func = this[name];
  
  if (func !== undefined) {
    return func.apply(this, args);
  }

  throw new Error("Method '" + name + "' is not defined");
}

Stack.push();

var _toString = define("toString", Object, function() {
  return this.toString();
});

define("map", Array, function(func) {
  return this.map((item) => item.invoke(func, []));
});

{
  Stack.push();

  var _power = define("power", Number, function(exp) {
    return Math.pow(this, exp);
  });

  console.log((5).invoke(_power, [2]));
  console.log((5).invoke("toString", []));

  console.log([1, 2, 3].invoke("map", [_toString]));
  console.log([1, 2, 3].invoke("map", [define("", Number, function() { return this * this; })]));

  console.log(Stack.array);

  Stack.pop();
}
