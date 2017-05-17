
class Foo { }

trait Iterable2 (iterator) {

  function reduce(func, init) {
    var iter = iterator.apply(this);

    function loop(accum) {
      var result = iter.next();

      if (result.done) {
        return accum;
      } else {
        return loop(func(accum));
      }
    }
    
    return loop(init);
  }

}


class IteratorResult {
  constructor() {
    this.value = undefined;
    this.done = false;
  }
}

class StringIterator {
  constructor(string) {
    this.string = string;
    this.index = 0;
    this.result = new IteratorResult();
  }

  function next() {
    this.result.value = this.string[this.index]; 
    this.index = this.index + 1;
    this.result.done = this.index > this.string.length;

    return this.result;
  }
}

extend String with Iterable2 {

  function iterator() {
    return new StringIterator(this);
  }

}


var result = "foo".reduce(length => length + 1, 0);

console.log(">>>", result);

