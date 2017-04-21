"use strict";

var _Array = Array;

global.Array = function () {
console.log(_Array);
  var array = new _Array();

  array.foo = function() {
    console.log("foo");
  }

  return array;
}

a = new Array();
a.push(1, 2, 3);

console.log(a);

