var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var extend = require("../runtime/extension.js").extend;


var Iterable = {
  map: function(iterate) {
    return function(func) {
    console.log("here", iterate.apply(this).moveNext());
      var array = [];
    
      var iter = iterate.apply(this);
    
      while (iter.moveNext()) {
        array.push(func(iter.value()));
      }
      
      return array;
    }
  }
}

//Array.Iterator = function Iterator(array) {
//  this.array = array;
//  this.index = -1;
//}
//
//Array.Iterator.prototype.moveNext = function() { return ++this.index < this.array.length; }
//Array.Iterator.prototype.value = function() { return this.array[this.index]; }
//
//Array._traits = new Map();
//Array._traits.set(Iterable, { });
//
//Array._traits.get(Iterable).iterator = function() {
//  return new Array.Iterator(this);
//}
//
//var array = [1, 2, 3];
//var iter = array.constructor._traits.get(Iterable).iterator.apply(array);
//
//while (iter.moveNext()) {
//  console.log("iter", iter.value());
//}


Iterator = function Iterator(array) {
  this.array = array;
  this.index = -1;
}

Iterator.prototype.moveNext = function() { return ++this.index < this.array.length; }
Iterator.prototype.value = function() { return this.array[this.index]; }

var array = [1, 2, 3];
//array._traits = new Map([[Iterable, { iterator: () => new Iterator(array) }]]);
//
//var classes = new Map([[Array,
//  new Map([[Iterable, { iterator: () => new Iterator(array) }]])
//]]);
//
//var iter = classes.get(Array).get(Iterable).iterator();


var _Iterator = extend(Array, _Iterator, Iterator);

var iter = _Iterator.construct(Array.prototype, [array]);
while (iter.moveNext()) {
  console.log("iter:", iter.value());
}

var _iterate = extend(Array, _iterate, function() {
  //return _Iterator.construct(Array.prototype, this);
  return new Iterator(this);
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
    var iter = this._traits.get(Iterable).iterator(); // How to get traits?
    
    while (iter.moveNext()) {
      array.push(iter.value());
    }
    
    return array;
  }
}

extend Array implements Iterable { // Where to store Iterable information?
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

Array.Iterator

_Iterator = extend(Array, _Iterator, new function(array) {
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
