'use strict';

var Extension = require('../../src/runtime/extension');
var Trait = require('../../src/runtime/module');

var Iterable = new Trait(Iterable, {
  map: function (iterator) {
    return function (func) {
      var array = [];
    
      var iter = iterator.apply(this);
    
      while (iter.moveNext()) {
        array.push(func(iter.value()));
      }
      
      return array;
    }
  }
});

//

var Iterator = function Iterator(array) {
  this.array = array;
  this.index = -1;
}

Iterator.prototype.moveNext = function () { return ++this.index < this.array.length; }
Iterator.prototype.value = function () { return this.array[this.index]; }

var _methods = Extension.extend(_methods, String, {
  iterator: function () {
    return new Iterator(this);
  }
});

var _methods = Extension.extend(_methods, String, Iterable.bindMethods(_methods.iterator));

global._methods = _methods;
global.Iterable = Iterable;

//

console.log("\nmodule.js\n");

test(' _methods.map.apply("abc", [c => c.charCodeAt(0)]).isEqual([97, 98, 99]) ');

void function () {
  var Iterable = new Trait.addtrait([Number], Iterable);

  var temp = global.Iterable;
  global.Iterable = Iterable;

  test(' Iterable.isTypeOf([1, 2, 3]) === true ');
  test(' [Number].isTypeOf([1, 2, 3]) === true ');
  test(' Iterable.isTypeOf(["foobar"]) === false ');

  global.Iterable = temp;
}();

test(' Iterable.isTypeOf([1, 2, 3]) === false ');
