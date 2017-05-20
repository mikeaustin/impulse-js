"use strict";

function Args(_arguments) {
  this._arguments = _arguments;
}

Object.prototype.args = false;

function loop(func) {
  function k() {
    accum = arguments;
    return undefined;
  }

  func = func(function () { return new Args(arguments); });

  var accum, result = { _arguments: undefined };

  do {
    accum = result._arguments;
    result = func.apply(null, accum);
  }
  while (result instanceof Args);

  return result;
}

var result, x = 1;

switch (x) {
  case 1:
    result = loop(fact => (n = 10000000, acc = 1) => {
      if (n == 1) return acc;
      else return fact(n - 1, acc * n); // Requires tail call
    });
  break;
  case 2:
    result = ((n = 10000000, acc = 1) => {
      fact: while (true) {
        if (n == 1) return acc;
        else {
          var _n = n, _acc = acc; n = _n - 1, acc = _acc * _n; continue fact;
        }
      }
    })();
  break;
  case 3:
    for (var n = 10000000, result = 1; n > 1; n -= 1) {
      result *= n;
    }
  break;
}

console.log(result);

