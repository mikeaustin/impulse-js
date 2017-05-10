"use strict";


String.prototype.toArray = function () {
  var array = [];

  for (var index = 0; index < this.length; ++index) {
    var charCode = this.charCodeAt(index);

    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      var nextCharCode = this.charCodeAt(index + 1);

      if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
        array.push(this.slice(index, index + 2));

        ++index;
      }
    } else {
      array.push(this.charAt(index));
    }
  }

  return array;
}

var UString = function UString(string) {
//  this.value = string;
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

UString.prototype.constructor = UString;
UString.prototype.valueOf = UString.prototype.inspect = function () { return this.value; }
UString.prototype._idx = function (index) { return this.chars[index]; }
UString.prototype.slice = function (begin, end) { return this.chars.slice(begin, end); }
UString.prototype.substr = function (begin, length) { return this.chars.slice(begin, begin + length); }
//UString.prototype.toLowerCase = function () { return this.value.toUpperCase(); }
//UString.prototype.toUpperCase = function () { return this.value.toUpperCase(); }
UString.prototype.concat = function (that) { return this.value.concat(that); }

UString.from = function(iterable) {
  // ...
}

//
// Exports
//

module.exports = UString;


// var str = new UString("🍅🌽🍇");

// console.log("str == 🍅🌽🍇", str == "🍅🌽🍇");
// console.log(str, str.length, str._idx(0));
// console.log(str.slice(1, 2), str.substr(1, 2));

var array = "🍅🌽🍇".toArray();

console.log(">>>", array, array.length);
