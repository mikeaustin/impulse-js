
//
// Object Equality
//

console.log(1 == 1);
console.log([1, 2, 3] == [1, 2, 3]);
console.log((10, "foo") == (10, "foo"));

var x;

console.log(x === undefined);


//
// Type Validation
//

console.log(Number.isTypeOf(1));
console.log([Number].isTypeOf([1, 2, 3]));
console.log((Number, String).isTypeOf((10, "foo")));

console.log("__LINE__ ==", __LINE__);


//
// Range and Tuple
//

var result = (1..5).map(n => n * n);

console.log(result);

var result = [(1, 2), (3, 4)];

console.log(result[0], result[1]);


//
// Map
//

var id = new Date();

var data = {
  id: 10, 1: "one"
};

data << (2, "two");
data ++ { "name": "Joe", "age": 20 };

console.log(data[id] === 10);
console.log(data[2] === "two");
console.log(data["name"] === "Joe");


//
// Bound 'this'
//

var callback = "foo".slice;

var result = callback(0, 1);

console.log(result);


//
// Traits
//

trait Test (required) {
  function test(that) {
    return required.apply(this, [that]);
  }
}

extend Number with Test {
  function required(that) { return this + that; }
}

var result = (1).test(2);
console.log(result == 3);


//
// Extension Methods
//

extend String {

  function capitalize() {
    // return this.slice(begin: 0, end: 1).toUpperCase() ++ this.slice(begin: 1).toLowerCase();
    // return this.slice(0..1).toUpperCase() ++ this.slice(1..undefined).toLowerCase();
    // return this._idx(0..1).toUpperCase() ++ this._idx(1..undefined).toLowerCase();
    return this[0..1].toUpperCase() ++ this[1..Infinity].toLowerCase();
  }

}

var result = "fOO".capitalize();

console.log("'fOO'.capitlize() ==", result);


//
// Class Inheritance
//

class Vector {

  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

}

class Vector3D extends Vector {

  constructor(x, y, z) {
    Vector.apply(this, [x, y]);
    this._z = z;
  }

}

extend Vector3D {
  
  function _add(that) {
    return new Vector3D(this._x + that._x, this._y + that._y, this._z + that._z);
  }

}

var result = new Vector3D(1, 2, 3) + new Vector3D(1, 2, 3);

console.log(result);


//
// CPS Transformation
//

function cps() {
  var value <= new Promise((resolve, reject) => {
    setTimeout(() => resolve(10), 20);
  });

  console.log(">>> 0", value);
}

cps();

{
  var value <= new Promise((resolve, reject) => {
    setTimeout(() => resolve(10), 10);
  });

  console.log(">>> 1", value);

  var value <= new Promise((resolve, reject) => {
    setTimeout(() => resolve(10), 0);
  });

  console.log(">>> 2", value);
}

console.log("here");
