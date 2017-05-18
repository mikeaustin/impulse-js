
// trait Iterable2 (iterator) {

//   function reduce(func, init) {
//     iter = iterator.apply(this);

//     return reduce(accum => {
//       var result = iter.next();

//       if (result.done === false) {
//         return func(accum, result.value);
//       }
//     }, init);
//   }

// }


class IteratorResult {

  constructor() {
    this.value = undefined;
    this.done = false;
  }

}

class RangeIterator {

  constructor(range) {
    this.range = range;
    this.index = range.begin;

    this.result = new IteratorResult();
  }

  function next() {
    this.result.value = this.index;
    this.result.done = this.index > this.range.end;

    this.index = this.index + 1;

    return this.result;
  }

}

extend Range with Iterable {

  function iterator() {
    return new RangeIterator(this);
  }

}

console.log((1..5).reduce((a, n) => a * n, 1));
console.log((1..5).filter((n) => n % 2 == 1));


class StringIterator {

  constructor(string) {
    this.string = string;
    this.index = 0;
    this.result = new IteratorResult();
  }

  function next() {
    var string = this.string, index = this.index;

    var charCode = string.charCodeAt(index);
    var nextCharCode = string.charCodeAt(index + 1);

    if ((charCode >= 0xD800 && charCode <= 0xDBFF) && (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF)) {
      this.result.value = string.slice(index, index + 2);
      this.index = index + 2;
    } else {
      this.result.value = string.charAt(index);
      this.index = index + 1;
    }

    this.result.done = this.index > string.length;

    return this.result;
  }

}

extend String with Iterable {

  function iterator() {
    return new StringIterator(this);
  }

  function map(func) {
    return this.reduce((array, item) => array << func(item), new this.constructor());
  }

  function _length() {
    return this.reduce((length, char) => length + 1, 0);
  }

}

console.log("f💩o".map(c => c.toUpperCase()));
console.log("f💩o"._length());
console.log("f💩o,b💩r"._split(","));
console.log("f💩o,b💩r".filter(c => c != "💩"));

var result = "f💩o💩oo".reduce((map, c) => map.update(c, v => v + 1, init: 0), new Map());

console.log(result);
