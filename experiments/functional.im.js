
extend Array {
  function map(func) {
    return this.map(func);
  }
}

extend String {
  function first(n) {
    return this.slice(0, 2);
  }
}

var firstTwoLetters = (words) => {
  return words.map(word => word.first(2));
};

console.log(firstTwoLetters(["jim", "kate"]));

var firstTwo = _methods.first(2);

console.log(">>>", firstTwo("jim"));


//console.log(_methods.map.apply(["jim", "kate"], [word => _methods.first.apply(word, [2])]));

// var firstTwoLetters2 = _methods.map(_methods.first(2));
// var firstTwoLetters2 = _methods.map.bindArgs(_methods.first.bindArgs(2));
var firstTwoLetters2 = _methods.map(_methods.first(2));

// var firstTwoLetters2 = _.map(_.first(2));

console.log(firstTwoLetters2(["jim", "kate"]));

