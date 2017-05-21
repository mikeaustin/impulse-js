'use strict';

var Class = require('../../lib/runtime/class');
var Trait = require('../../lib/runtime/module');
var Extension = require('../../lib/runtime/extension');
var Parameters = require('../../lib/runtime/parameters');

console.log('\nextension.js\n');

var _ = Extension.extend(_, String, {
  capitalize: function () {
    return this[0].toUpperCase() + this.slice(1);
  }
});

var _ = Extension.extend(_, Number, {
  factorial: function _factorial() {
    if (this.valueOf() === 0) {
      return 1;
    }

    return this * _factorial.apply(this - 1);
  }
});

test(' (foo.capitalize || _.capitalize).apply(foo) === "Foo" ', { foo: "foo", _: _ });
test(' (foo.toUpperCase || _.toUppderCase).apply(foo) === "FOO" ', { foo: "foo", _: _ });
test(' (num.factorial || _.factorial).apply(num, []) === 120 ', { num: 5, _: _ });


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
console.log(($ = new Vector3D(1, 2, 3), $._add || _._add).apply($, [new Vector3D(2, 3, 4)]));

var _ = Extension.extend(_, Vector3D, {
  _sub: function (that) {
    return new Vector3D(this.x - that.x, this.y - that.y, this.z - that.z);
  }
});

console.log(($ = new Vector3D(1, 2, 3), $._sub || _._sub).apply($, [new Vector3D(2, 3, 4)]));

console.log(new Vector3D() instanceof Vector);


var Numeric = new Trait(Numeric, function () {
  return {
    isNumeric: function () {
      return true;
    }
  };
});


var Numeric = new Trait.addtrait(Vector, Numeric);

var _ = Extension.extend(_, Vector, Numeric.methods());

console.log(Numeric.isTypeOf(new Vector3D()));
