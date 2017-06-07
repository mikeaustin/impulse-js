var a = [{ "bar": 2 }];
var b = a.map(e => { "foo": 1, e: e });
var c = a.map(e => { return { "foo": 1, e: e }; });

console.log(b);
console.log(c);

var a = ["aaaa", "a", "aa"];
var b = a.map(s => (s, s.length));

console.log(b);

