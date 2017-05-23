'use strict';

var Extension = require('../../lib/runtime/extension');
var Trait = require('../../lib/runtime/module');

var Iterable = new Trait(Iterable, function (iterator) {
  return {
    map: function map(func) {
      var array = [];
    
      var iter = iterator.apply(this);
    
      while (iter.moveNext()) {
        array.push(func(iter.value()));
      }
      
      return array;
    }
  };
});

//

var Iterator = function Iterator(array) {
  this.array = array;
  this.index = -1;
}

Iterator.prototype.moveNext = function () { return ++this.index < this.array.length; }
Iterator.prototype.value = function () { return this.array[this.index]; }

var _ = Extension.extend(_, String, {
  iterator: function () {
    return new Iterator(this);
  }
});

var _ = Extension.extend(_, String, Iterable.bind(_.iterator));

//

console.log("\nmodule.js\n");

test(' _.map.apply("abc", [c => c.charCodeAt(0)]).isEqual([97, 98, 99]) ', {_: _});

void function () {
  var Iterable = new Trait.addtrait([Number], Iterable);

  test(' Iterable.isTypeOf([1, 2, 3]) === true ', {Iterable: Iterable});
  test(' [Number].isTypeOf([1, 2, 3]) === true ');
  test(' Iterable.isTypeOf(["foobar"]) === false ', {Iterable: Iterable});
}();

test(' Iterable.isTypeOf([1, 2, 3]) === false ', {Iterable: Iterable});
