# impulse-js
Impulse-JS is a cleaner, more modern dialect of JavaScript. It moves legacy and low-level features such as binary operators and for loops to library code, and promotes functional programming and the use of immutable data types.

> **NOTE**: This projects was an experiment, and is no longer being maintained. It was an attempty to keep the general syntax of JavaScript, but remove all the legacy cruft and add things like extension methods and immutable data. I've been working on a new language, Kopi, which runs inside JavaScript but has it's only syntax. It's "Simple, Immutable, and 100% Asynchronous".
> 
> Check it out at https://github.com/mikeaustin/kopi.

Features include:

* Extension Methods
* Traits and Composition
* Operator Overloading
* Map, Range and Tuple Literals
* Async Functions (CPS)
* [Future] Named Parameters
* [Future] Functional Loops / TCO
* [Future] Enhanced Switch
* [Future] Splat and Splat-Packs

The language lives happily together with existing JavaScript code and libraries. Each feature of the language is implemented as a module, so it can also be used to enhance existing JavaScript.

More details can be found here:

* [Impulse-JS: A Better JavaScript](https://docs.google.com/presentation/d/1DAiQf5LDcpC30-V0dS8yE1UuQ-flXBZXLBgHUb7RLdw/edit?usp=sharing)  
  A presentation describing the language in a nut shell.
* [Impulse-JS Language Spec](https://docs.google.com/document/d/1LqEP5ERAjBa1b0iryn88pessVohDyVAPIGgZvMK8IC4/edit?usp=sharing)  
  Language specs, examples, and implementation status.

### Current Status

Many features are implemented, but there are plenty of holes, edge cases and bugs. See [Current Status](https://docs.google.com/document/d/1LqEP5ERAjBa1b0iryn88pessVohDyVAPIGgZvMK8IC4/edit#bookmark=id.dku14xd0594c) to find the status of each feature.

To try it out, all you need is Node:

```$ bin/impulse-js test/impulse/basics.xjs | node```

### Working Examples

```
trait Aggregate (reduce) {

  function max() {
    return Math.max.apply(null, this);
  }

}

extend Array with Aggregate {

  // Can define more functions here

}

console.log("[1, 2, 3].max() ==", [1, 3, 2].max());


//


function loadAvatar(id) {
  var profile <= loadProfile(id);
  
  var avatarImage <= loadImage(profile.avatarUrl),
      defaultImage <= loadImage(0);
  
  console.log(defaultImage, avatarImage);
}

loadAvatar(1000);


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
