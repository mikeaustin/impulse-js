# impulse-js
Impulse-JS is a modern dialect of JavaScript with traits, extension methods, operator overloading, map, range and tuple literals and more. It moves legacy and low-level features such as binary operators and for loops to library code, and promotes functional programming and the use of immutable data types.

The language lives happily together with existing JavaScript code and libraries. Each feature of the language is implemented as a module, so it can also be used to enhance existing JavaScript.

More details can be found here:

* [Impulse-JS: A Better JavaScript](https://docs.google.com/presentation/d/1DAiQf5LDcpC30-V0dS8yE1UuQ-flXBZXLBgHUb7RLdw/edit?usp=sharing)  
  A presentation describing the language in a nut shell.
* [Impulse-JS Language Spec](https://docs.google.com/document/d/1LqEP5ERAjBa1b0iryn88pessVohDyVAPIGgZvMK8IC4/edit?usp=sharing)  
  Language specs, examples, and implementation status.

### Current Status

Many features are implemented, but there are plenty of holes, edge cases and bugs. See [Current Status](https://docs.google.com/document/d/1LqEP5ERAjBa1b0iryn88pessVohDyVAPIGgZvMK8IC4/edit#bookmark=id.dku14xd0594c) to find the status of each feature.

To try it out, all you need is Node:

```$ bin/impulse-js test/impulse/basics.im.js | node```

### Working Examples

```
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
```
