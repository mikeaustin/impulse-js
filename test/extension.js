'use strict';

var Class = require('../src/runtime/class');
var Trait = require('../src/runtime/module');
var Extension = require('../src/runtime/extension');
var Parameters = require('../src/runtime/parameters');

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


var Vector = Class.define(Object, {
  constructor: function Vector(x, y) {
    this.x = x, this.y = y;
  },
  
  _add: function (that) {
    return new Vector(this.x + that.x, this.y + that.y);
  }
});


var Vector3D = Class.define(Vector, {
  constructor: function Vector3D(x, y, z) {
    Vector.apply(this, [x, y]), this.z = z;
  },
  
  _add: function (that) {
    return new Vector3D(this.x + that.x, this.y + that.y, this.z + that.z);
  }
});


var $;
console.log(($ = new Vector3D(1, 2, 3), $._add || _methods._add).apply($, [new Vector3D(2, 3, 4)]));

var _methods = Extension.extend(_methods, Vector3D, {
  _sub: function (that) {
    return new Vector3D(this.x - that.x, this.y - that.y, this.z - that.z);
  }
});

console.log(($ = new Vector3D(1, 2, 3), $._sub || _methods._sub).apply($, [new Vector3D(2, 3, 4)]));

console.log(new Vector3D() instanceof Vector);


var Numeric = new Trait(Numeric, {
  isNumeric: function () {
    return function () { return true; }
  }
});

console.log(Numeric.methods);

var Numeric = new Trait.addtrait(Vector, Numeric);

var _methods = Extension.extend(_methods, Vector, Numeric.bind());

console.log(Numeric.isTypeOf(new Vector3D()));
console.log(">>>", _methods.isNumeric);
