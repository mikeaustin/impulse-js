var Trait = require("../../runtime/module");

var Iterable = new Trait(Iterable, {
  map: Array.prototype.map
});
