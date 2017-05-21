
extend Array {
  function map(func) {
    return this.map(func);
  }
}

extend String {
  function slice(begin, end) {
    return this.slice(begin, end);
  }
}

var firstTwoLetters = (words) => {
  return words.map(word => word.slice(0, 2));
};

console.log(firstTwoLetters(["jim", "kate"]));


var firstTwoLetters2 = _.map(_.slice(0, 2));

console.log(firstTwoLetters2(["jim", "kate"]));

console.log(_.map(_.slice(0, 2))(["jim", "kate"]));

