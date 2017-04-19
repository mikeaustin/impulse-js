var Extension2 = require("../../runtime/extension").Extension2;

var _methods = Extension2.extend(_methods, String, {
  capitalize: function () {
    return this[0].toUpperCase() + this.slice(1);
  }
});

global._methods = _methods;

test(' _methods.capitalize.apply("foo") === "Foo" ');
