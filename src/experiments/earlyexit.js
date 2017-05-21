
String.prototype.map = function (func) {
  var accum = [];

  for (item of this) {
    var result = func(item);

    if (result !== undefined) {
      accum.push(result);
    }
  }

  return accum;
}

function reduce(func, init) {
  var accum = init;

  for (var result = func(accum); result !== undefined; result = func(accum)) {
    accum = result;
  }

  return accum;
}

var result = "foobarbaz".map(c => {
  if (c !== "b") {
    return c.toUpperCase();
  }
});

console.log(result);


var result = reduce(([a, b]) => {
  if (a < 5) {
    return [a + 1, b + 2];
  }
}, [0, 0]);

// var result = reduce((max) => max < 5 ? max + 1, 0);

console.log(result);

/*

(1..5).collect(n => n.even() ? n)

loop(max => {
  if (max < 5) {
    return max + 1
  }
});

*/

var x = function k(a) {
  if (a < 5) { return k(a+1); }
  else { return a; }
}(0);

console.log(x);

