function Extension(parent, type, func) {
  this.parent = parent || null;
  this.type = type;
  this.func = func;
};

Number.isTypeOf = function (that) {
  return typeof that === "number" || that instanceof this;
}

String.isTypeOf = function (that) {
  return typeof that === "string" || that instanceof this;
}

Extension.prototype.apply = function (_this, args) {
  for (var scope = this; scope !== null; scope = scope.parent) {
    if (scope.type.isTypeOf(_this)) {
      return scope.func.apply(_this, args);
    }
  }
}

function extend(type, parent, funcs) {
  function Scope() { }

  if (parent) {
    Scope.prototype = parent;
  }

  var scope = new Scope();

  for (var name in funcs) {
    scope[name] = new Extension(parent ? parent[name] : null, type, funcs[name]);
  }

  return scope;
}


var _methods = extend(Number, _methods, {
  add: function (that) {
    return this + that;
  },

  sub: function (that) {
    return this - that;
  }
});

console.log(_methods.add.apply(2, [3]), _methods.sub.apply(2, [3]));

console.log("=====");

void function (_methods) {
  var _methods = extend(String, _methods, {
    capitalize: function (that) {
      return that + Infinity;
    }
  });

  console.log(_methods.add.apply(2, [3]), _methods.sub.apply(2, [3]));
}(_methods);

//console.log(((2).add || _methods.add).apply(2, [3]));

