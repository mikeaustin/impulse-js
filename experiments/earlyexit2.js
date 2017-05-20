
function fact0(n, acc = 1) {
  for (;;) {
    if (n == 1) return acc;
    else [n, acc] = [n - 1, acc * n];
  }
}

console.log(fact0(5));


function fact2(n, acc) {
  if (n == 1) return acc;
  else return fact2(n - 1, acc * n);
}

console.log(fact2(5, 1));


function loop(func, init) {
  function cont() {
    return arguments;
  }

  var accum = init;
  var result = func(cont, []);

  while (typeof result === "object") {
    accum  = result;
    result = func(cont, accum);
  }

  return result;
}

var result = loop((fact, [n = 5, acc = 1]) => {
  if (n == 1) return acc;
  else return fact(n - 1, acc * n);
});

console.log(result);


(function () {
  function loop(func) {
    var accum;
    var result = func(accum);

    while (typeof result === "object") {
      accum = result;
      result = func.apply(null, accum);
    }

    return result;
  }

  function next() { return arguments; }

  var result = loop((n = 5, acc = 1) => {
    if (n == 1) return acc;
    else return next(n - 1, acc * n);
  });

  console.log(result);

  function fact(n, acc = 1) {
    var _n = n, _acc = acc;

    return loop((n = _n, acc = _acc) => {
      if (n == 1) return acc;
      else return next(n - 1, acc * n);
    });
  }

  console.log(fact(5));
})();

function fact0(n, acc = 1) {
  loop: while(true) {
    if (n == 1) return acc;
    else { [n, acc] = [n - 1, acc * n]; continue loop; }
  }
}

var result = ((n = 5, acc = 1) => {
  loop: while(true) {
    if (n == 1) return acc;
    else { [n, acc] = [n - 1, acc * n]; continue loop; }
  }
})();

console.log(result);

/*
function fact(n) {
  loop next (n = n, acc = 1) {
    if (n == 1) return acc;
    else next(n - 1, acc * n);
  }
}
*/

