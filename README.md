# impulse-js
TODO: A cleaner, more strict dialect of JavaScript with extension methods, named parameters, traits, operator overloading, range and tuple literals and more. More details can be found here:

https://docs.google.com/document/d/1LqEP5ERAjBa1b0iryn88pessVohDyVAPIGgZvMK8IC4/edit?usp=sharing

## Status

Currently there is a parser, using PEG.js, and a handful of runtime code, but there is no bridge between the two just yet. I've only been exploring syntax and semantics, and when that's done, I'll start looking at emitting JavaScript.

Right now, you can run "node src/runtime.js" and see all the runtime tests run. Some files need immutable.js.
