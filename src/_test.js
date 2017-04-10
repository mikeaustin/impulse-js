
function foo() {
  eval("var x = 10;");

  console.log(x);
}

"use strict";

foo();

