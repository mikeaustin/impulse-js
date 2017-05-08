"use strict";

String.prototype.bind = function() {
  if (this instanceof Impulse.String) {
    return this;
  } else {
    return new Impulse.String(this);
  }
}

var Impulse = { };

Impulse.String = (function (_String) {
  function String(string) {
    this.value = string;
    this.chars = [];

    for (var index = 0; index < string.length; ++index) {
      var charCode = string.charCodeAt(index);

      if (charCode >= 0xD800 && charCode <= 0xDBFF) {
        var nextCharCode = string.charCodeAt(index + 1);

        if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
          this.chars.push(string.slice(index, index + 2));
          ++index;
        }
      } else {
        this.chars.push(string.charAt(index));
      }
    }

    this.length = this.chars.length;
  }

  //String.prototype = new _String(); // Can't override length
  String.prototype.constructor = String;
  String.prototype.valueOf = String.prototype.inspect = function () { return this.value; }
  String.prototype._idx = function (index) { return this.chars[index]; }
  String.prototype.slice = function(begin, end) { return this.chars.slice(begin, end); }
  String.prototype.substr = function(begin, length) { return this.chars.slice(begin, begin + length); }

  return String;
})(String);

(function () {
  var String = Impulse.String;

  var str = "🍅🌽🍇".bind();

  console.log("str == 🍅🌽🍇", str == "🍅🌽🍇");
  console.log(str.length, str._idx(0));
  console.log(str, str.length, str._idx(0));
  console.log(str.slice(1, 2), str.substr(1, 2));
})();

