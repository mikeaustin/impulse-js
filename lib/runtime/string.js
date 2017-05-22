"use strict";


function Iterator(array) {
  this.array = array;
  this.index = 0;
  this.result = { };
}

Iterator.prototype.next = function () {
  this.result.value = this.array[index];
  this.result.done  = this.index > string.length;

  return this.result;
}

var StringArray = function StringArray(string) {
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

StringArray.prototype.constructor = StringArray;
StringArray.prototype._idx = function (index) { return this.chars[index]; }
StringArray.prototype.slice = function (begin, end) { return this.chars.slice(begin, end); }
StringArray.prototype.substr = function (begin, length) { return this.chars.slice(begin, begin + length); }
StringArray.prototype.concat = function (that) { return this.value.concat(that); }
StringArray.prototype.iterator = function() { return new Iterator(this.chars); }


//
// Exports
//

module.exports = StringArray;


var str = new StringArray("🍅🌽🍇");

console.log(str);
console.log(str.length);
console.log(str._idx(0), str.slice(1, 2), str.substr(1, 2));
