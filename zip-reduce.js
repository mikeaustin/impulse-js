util = require("util");

Array.prototype.head = function() {
  return this[0];
}

Array.prototype.tail = function() {
  return this.slice(1);
}

var result = map((a, b) => [a, b], [1, 2, 3], [4, 5, 6]);

result = result.reduce((acc, [a, b]) => {
  return acc.concat(a + b);
}, []);

console.log(result);


function map(f, ...xs) {
  if (xs.some(x => x.length == 0)) return [];

  return [f(...xs.map(x => x.head()))].concat(map(f, ...xs.map(x => x.tail())));
}

console.log(map((a, b, c) => {
  return [a, b, c];
}, [1, 2, 3], [4, 5, 6], [7, 8, 9]));

var [a, b] = [1, 2]

function Tuple(values) {
  this.values = values;

  values.forEach((value, index) =>
    Object.defineProperty(this, "_" + index, { get: () => value })
  );
}

Tuple.prototype.map = function(func) {
  return map(func, ...this.values);
}

Tuple.prototype.add = function(tuple) {
  var result = map((a, b) => {
    return a + b;
  }, this.values, tuple.values);

  return new Tuple(result);
}

Tuple.prototype.concat = function(tuple) {
  return new Tuple(this.values.concat(tuple.values));
}

function _(...values) {
  return new Tuple(values);
}

console.log("\n=====\n");

console.log(_([1, 2, 3]).map((a) => a + 1));
console.log(_([1, 2, 3], [4, 5, 6]).map((a, b) => a + b));

console.log("\n=====\n");

console.log(_(1, 2).add(_(3, 4)));
console.log(_(1, 2).concat(_(3, 4)));

