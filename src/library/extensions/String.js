var Impulse = require("../../runtime/extension");

var _capitalize = Impulse.extend(String, _capitalize, function () {
  return this[0].toUpperCase() + this.slice(1);
});

global._capitalize = _capitalize;

test(' _capitalize.apply("foo") === "Foo" ');
