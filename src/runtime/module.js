var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var extend = require("../runtime/extension.js").extend;


var Iterable = {
  map: function(iterate) {
    return function(func) {
      var array = [];
    
      var iter = iterate.apply(this);
    
      while (iter.moveNext()) {
        array.push(func(iter.value()));
      }
      
      return array;
    }
  }
}


Iterator = function Iterator(array) {
  this.array = array;
  this.index = -1;
}

Iterator.prototype.moveNext = function() { return ++this.index < this.array.length; }
Iterator.prototype.value = function() { return this.array[this.index]; }


var array = [1, 2, 3];

var _Iterator = extend(Array, _Iterator, Iterator);

var _iterate = extend(Array, _iterate, function() {
  return _Iterator.construct(Array.prototype, [this]);
});

var _map = extend(Array, _map, Iterable.map(_iterate));

console.log(">>>", _map.apply(array, [n => n * n]));

/*

How do you implement nested classes?
Copy methods or walk traits tree?
Add traits to constructor or instanced objects?


trait Iterable {
  function iterator();
  
  function map(func) {
    var array = [];
    
    var iter = this._traits.get(Iterable).iterator();
    while (iter.moveNext()) {
      array.push(iter.value());
    }
    
    return array;
  }
}

extend Array implements Iterable {
  class Iterator() {
    function moveNext() {
      this.index = this.index + 1;
    }
    
    function value() {
      return this.array[this.index];
    }
  }
  
  function Iterable.iterator() {
    return new Array.Iterator(this);
  }
}


Value : Type

0 : 1	Bottom								== Void
1 : 1	Unit					()			== ()
1 : 1	Scalar					1			== Number
1 : N	Union or Intersection	1			== (Number | String), (Number & String)
N : 1	Array					[1, 2, 3]	== [Number]
N : N	Record					(1, "foo")	== (Number, String)

1 : 0	Untyped Scalar
N : 1	Top						1, "foo"	== Object

*/
