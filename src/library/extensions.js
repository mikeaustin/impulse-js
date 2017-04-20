"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");

var Extension = require("../runtime/extension.js");
var StringExtensions = require("./extensions/String.js");
var Stringify = require("./traits/Stringify");

var _methods = Extension.extend(_methods, Object, {
  toString: function (hideProperties) {
    if (this === Object.prototype) {
      return "Object";
    }

    var constructorName = this.constructor.name + " ";
    var properties = [];

    if (typeof(this) === "object" || typeof(this) === "function") {
      if (!hideProperties) {
        for (var p in this) {
          if (this.hasOwnProperty(p)) {
            properties.push(p + ": " + _toString.apply(this[p], []));
          }
        }
      }

      if (properties.length !== 0)
        return constructorName + "{ " + properties.join(", ") + " }";
      else
        return constructorName + "{ }";
    } else {
      //return this.toString();
    }
  }
});

var _methods = Extension.extend(_methods, Number, {
  toString: function () {
    if (this === Number.prototype) {
      return "Number";
    }
    
    return this.toString();
  }
});

var _methods = Extension.extend(_methods, Array, {
  toString: function () {
    if (this === Array.prototype) {
      return "Array";
    }

    return "[" + this.join(", ") + "]";
  }
});

var _methods = Extension.extend(_methods, Immutable.Map().constructor, {
  toString: function () {
    if (this === Immutable.Map().constructor.prototype) {
      return "Map";
    }

    var items = this.map(function (value, key) {
      var keyString = _toString.apply(key, [true]);
      var valueString = _toString.apply(value, []);

      return keyString + ": " + valueString;
    }).join(", ");

    return "Map { " + items + " }";
  }
});


module.exports = {
  _methods: _methods
}
