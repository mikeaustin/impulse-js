# impulse-js
Impulse-JS is a modern dialect of JavaScript with traits, extension methods, operator overloading, range and tuple literals and more. It moves legacy and low-level features such as binary operators and for loops to library code, and promotes functional programming and the use of immutable data types.

The language lives happily together with existing JavaScript code and libraries. Each feature of the language is implemented as a module, so it can also be used to enhance existing JavaScript.

More details can be found here:

* [Impulse: A Better JavaScript](https://docs.google.com/presentation/d/1DAiQf5LDcpC30-V0dS8yE1UuQ-flXBZXLBgHUb7RLdw/edit?usp=sharing)  
  A presentation describing the language in a nut shell.
* [Impulse-JS Language Spec](https://docs.google.com/document/d/1LqEP5ERAjBa1b0iryn88pessVohDyVAPIGgZvMK8IC4/edit?usp=sharing)  
  Language specs, examples, and implementation status.

### Status

Many features are implemented, but there are plenty of holes, edge cases and bugs. See (Current Status)[] to find the status of each feature.

To try it out, all you need is Node:

```$ bin/impulse-js test/impulse/basics.im.js | node```

