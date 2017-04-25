
function Class() {
}

Class.define = function(superclass, funcs) {
  var constructor = funcs.constructor;
  
  constructor.prototype = new superclass();
  constructor.prototype.constructor = constructor;

  for (var name in funcs) {
    constructor.prototype[name] = funcs[name];
  }

  return constructor;
}

module.exports = Class;

/*

var Vector3D = Class.subclass(Vector, {
  constructor: function Vector3D() {
    
  }
})

var _methods = Trait.extend(_methods, Vector, {
    _sub: function (that) {
    
    }
})

*/
