// class Range {
//   constructor(begin, end) {
//     this.begin = begin - 1;
//     this.end   = end;
//   }

//   function iterator() {
//     return new this.Iterator(this);
//   }

//   class Iterator {
//     constructor(range) {
//       this.range = range;
//       this.value = this.range.begin;
//     }
    
//     function next() {
//       this.value = this.value + 1;
//       this.done  = this.value > this.range.end;

//       return this;
//     }
//   }
// }

// var iter = new Range(1, 3).iterator();

// var iter = iter.next(); console.log(iter);
// var iter = iter.next(); console.log(iter);
// var iter = iter.next(); console.log(iter);

// console.log("=====");

// var iter1 = new Range(1, 3).iterator();
// var iter2 = new Range(11, 3).iterator();

// console.log([iter1, iter2].reduce((iters, iter) => iters.concat([iter.next()]), []));
// console.log([iter1, iter2].reduce((iters, iter) => iters.concat([iter.next()]), []));
// //console.log([iter1, iter2].reduce((iters, iter) => iters.concat([iter.next()]), []));

// console.log([iter1, iter2].map(iter => iter.next()));

// console.log([iter1, iter2].map(iter => iter.value()));

// function map(selector, iterables) {
//   var iterators = iterables.map(iterable => iterable.iterator());

//   function _map(selector, iterators, values) {
//     var iterators = iterators.map(iter => iter.next());

//     if (iterators.some(iter => iter.done)) {
//       return values;
//     } else {
//       return _map(selector, iterators, iterators.map((iterator, i) => values[i] ++ selector(iterator.value)));
//     }
//   }

//   return _map(selector, iterators, new Array(iterators.length).fill([]));
// }

// console.log("=====");

// console.log(map(n => n * n, [new Range(1, 3), new Range(2, 5)])); // [[1, 4, 9], [1, 4, 9]]


class StringIterator {

  constructor(string) {
    this.string = string;
    this.index = 0;
    this.result = { };
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
    return this.reduce((array, item) => array << func(item), []);
  }

  function _length() {
    return this.reduce((length, char) => length + 1, 0);
  }

}

console.log("f💩o".map(c => c.toUpperCase()));
console.log("f💩o"._length());
console.log("f💩o,b💩r"._split(","));


// var result = "f💩o💩oo".reduce((map, c) => map.update(c, v => v + 1, init: 0), new Map());

// console.log(result);
