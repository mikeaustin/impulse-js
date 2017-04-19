var _Array = function Array() {
  this.array = [];
}

_Array.prototype.inspect = function () {
  return this.array;
};

var names = Object.getOwnPropertyNames(Array.prototype);

for (prop of names) {
  console.log(prop);
  _Array.prototype[prop] = function () { return Array.prototype[prop].apply(this.array, arguments); }
}

a = new _Array();
a.push(1, 2, 3);

console.log(a);

