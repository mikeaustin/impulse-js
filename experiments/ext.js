
function Extension(parent) {
  this.methods = parent ? new Map(parent.methods) : new Map();
}

Extension.prototype.apply = function (_this, _arguments) {
  for (var proto = Object.getPrototypeOf(_this); proto !== null; proto = Object.getPrototypeOf(proto)) {
    var method = this.methods.get(proto);

    if (method !== undefined) {
      return method.apply(_this, _arguments);
    }
  }

  throw new Error("Can't find extension method");
};

var extend = function (extension, constructor, method) {
  var extension = new Extension(extension);

  extension.methods.set(constructor.prototype, method);

  return extension;
};

var _append = extend(_append, String, function (value) {
  return this.slice().concat(value);
});

var _append = extend(_append, Array, function (value) {
  return this.slice().concat([value]);
});

console.log(_append.apply("1, 2, 3", [", 4"]));
console.log(_append.apply([1, 2, 3], [4]));

