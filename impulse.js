util = require("util");
fs = require("fs");
peg = require("pegjs");

// _(foo, bar).map
var test = `-1;`;

fs.readFile("parser.pegjs", "utf8", function(error, data) {
  var parser = peg.generate(data);

  var result = parser.parse(test);

  console.log(util.inspect(result, { depth: null, breakLength: null })); 
});

/*

Move instanceOf to a method on Object
Remove ++, -- prefix and postfix operators
Remove +=, *= etc. operators
Move bitwise |, &, <<, ~, etc. to methods
Remove for, do, while iteration					We don't need these with each(), map(), reduce(), etc.
Remove all unicode rules						Taken out temporarily to simplify the syntax.
Remove automatic semicolon insertion			Causes bugs. Always use ; at the end of a statement.
Disallow direct property setting				foo.x = 10; Open to monkey-patching abuse.
Change == to mean _.isEqual, remove ===
? Change object notation to use Map()
Make switch statement more powerful
Require boolean expressions in if ()
Make if () an expression, remove ?:
? Require braces around if ()
Bind foo.bar to this
Add fat arrow functions (x => x * x)
Add named parameters
Add operator overloading				operator_isEqual, operator_isGreater, operator_multiply, ...
Destructured assignment
? Pattern matching
Extension methods
Tuple, Range							"(1, 2, 3)", 1..10
Require "use string"
Optional types							function foo(arg?)
Immutable types
Allow strings to span multiple lines

() = apply(), [] index
Remove [1,,2] elision syntax
Remove RegExpr literal syntax


Keywords

class
var
if
switch


Tests

var f = (x, y) => { x * x; };
var f = x => { x * x; };
var f = x => x * x;
console.log((x, y) => x * y);
console.log(x => x * x);
foo(a, b => a);

class String
{
  function foo() {
    return "hello" + "world";
  }

  function bar(x, y) {
    return z => x + y * z;
  }
}

class Foo { }

names.split(",").map(name => name.trim());

names.split(",").map(name => {
  return name.trim();
});

x = (1, 2);

foo(("foo", bar, { baz: [1, 2, 3] }));

[(1.0, 0.1), (5.0, 5.5)];

[1..5, (a + b)..(x), 1.5..2.5, 'a'..'z', foo()..bar()];

*/
