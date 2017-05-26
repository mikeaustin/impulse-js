
trait Aggregate (reduce) {

  function max() {
    return Math.max.apply(null, this);
  }

}

extend Array with Aggregate {

  function filter(func) {
    return this.filter(func);
  }

}

console.log("[1, 2, 3].max() ==", [1, 3, 2].max());


//


extend Number {

  function isEven() { return this % 2 == 0; }
  function isOdd() { return !(this.isEven()); }

}

var odds = _.filter(_.isOdd());

console.log("odds([1, 2, 3]) ==", odds([1, 2, 3]));


//


class Point extends Object {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  function _add(that) {
    return new Point(this.x + that.x, this.y + that.y);
  }

}

console.log("new Point(2, 3) + new Point(2, 3) ==", new Point(2, 3) + new Point(2, 3));

