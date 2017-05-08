"use strict";

var Extension = require("../../runtime/extension");

var _methods = Extension.extend(_methods, String, {
  capitalize: function () {
    return this[0].toUpperCase() + this.slice(1);
  }
});

// test(' _methods.capitalize.apply("foo") === "Foo" ', {_methods: methods});
