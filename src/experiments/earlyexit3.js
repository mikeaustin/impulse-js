"use strict";

function Args(_arguments) {
  this._arguments = _arguments;
}

Object.prototype.args = false;

function loop(callee) {
  var accum, result, func = callee(function() { accum = arguments; });

  do {
    result = func.apply(null, accum);
  }
  while (result === undefined);

  return result;
}

function ycomb(f) { return (x => f(y => x(x, y)))(x => f(y => x(x, y))); }

function xY(le) {
    return (function(f) {
        return f(f);
    })(function(f) {
        return le(function(x, y) {
            return f(f)(x, y);
        });
    });
}
function Y(le) {
    return ((f) => f(f))((f) => le((x, y) => f(f)(x, y)));
}




var result, x = 2;

switch (x) {
  case 1:
    result = loop(fact => (n = 10000000, acc = 1) => {
      if (n == 1) return acc;
      else return fact(n - 1, acc * n); // Requires tail call
    });
  break;
  case 2:
    result = Y(fact => (n = 10000000, acc = 1) => {
      if (n == 1) return acc;
      else return fact(n - 1, acc * n); // Requires tail call
    })();
  break;
  case 3:
    result = ((n = 10000000, acc = 1) => {
      fact: while (true) {
        if (n == 1) return acc;
        else {
          var _n = n, _acc = acc; n = _n - 1, acc = _acc * _n; continue fact;
        }
      }
    })();
  break;
  case 4:
    for (var n = 10000000, result = 1; n > 1; n -= 1) {
      result *= n;
    }
  break;
}

console.log(result);

