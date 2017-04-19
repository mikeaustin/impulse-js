var Extension = require("../../runtime/extension").Extension;

var _methods = Extension.extend(_methods, String, {
  capitalize: function () {
    return this[0].toUpperCase() + this.slice(1);
  }
});

global._methods = _methods;

test(' _methods.capitalize.apply("foo") === "Foo" ');
