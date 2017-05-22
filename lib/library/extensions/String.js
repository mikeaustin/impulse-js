"use strict";

var Extension = require("../../runtime/extension");

var _ = Extension.extend(_, String, {
  capitalize: function () {
    return this[0].toUpperCase() + this.slice(1);
  }
});

// test(' _.capitalize.apply("foo") === "Foo" ', {_: _});
