'use strict';

var Extension = require('../src/runtime/extension');

console.log('\nextension.js\n');

// var _methods = String.extend(_methods, null, {
//  capitalize: function () {
//    return this[0].toUpperCase() + this.slice(1);
//  }
// });

var _methods = Extension.extend(_methods, String, {
  capitalize: function () {
    return this[0].toUpperCase() + this.slice(1);
  }
});

var _methods = Extension.extend(_methods, Number, {
  factorial: function _factorial() {
    if (this.valueOf() === 0) {
      return 1;
    }

    return this * _factorial.apply(this - 1);
  }
});

global._methods = _methods;

test(' var foo = "foo"; (foo.capitalize || _methods.capitalize).apply(foo) === "Foo" ');
test(' var foo = "foo"; (foo.toUpperCase || _methods.toUppderCase).apply(foo) === "FOO" ');
test(' var num = 5; (num.factorial || _methods.factorial).apply(num, []) === 120 ');
