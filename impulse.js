util = require("util");
fs = require("fs");
peg = require("pegjs");

var Parser = require("./parser");

function inspect() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) {
    args.push(util.inspect(arguments[i], { depth: null, breakLength: null}));
  }

  console.log.apply(null, args);
}

function indent(level) {
  var length = level || 0;

  return Array(length + 1).join("  ");
}

var test = `
f = (x, y) => { x + y; x + y; };

function foo(a, b) {
  return ((a + 2) * 1, b * 2);
}
`;

var test = `
(a, b) => a + b;
`;

//fs.readFile("parser.pegjs", "utf8", function (error, data) {

var Statement = {
  Program: function (node, level) {
    for (var i = 0; i < node.body.length; i++) {
      console.log(generate(node.body[i], level));
    }
  },

  FunctionDeclaration: function (node, level) {
    var params = node.params.map(param => generate(param, level));

    return "function " + generate(node.id, level) + "(" + params.join(", ") + ") " + generate(node.body, level);
  },


  BlockStatement: function (node, level) {
    var statements = [];

    for (var i = 0; i < node.body.length; i++) {
      statements.push(indent(level + 1) + generate(node.body[i], level));
    }

    return "{\n" + statements.join("\n") + "\n}";
  },

  ReturnStatement: function (node, level) {
    return "return " + generate(node.argument, level) + ";";
  },

  ExpressionStatement: function (node, level) {
    return generate(node.expression, level) + ";";
  },


  AssignmentExpression: function (node, level) {
    return generate(node.left, level) + " = " + generate(node.right, level);
  },

  FunctionExpression: function (node, level) {
    var params = node.params.map(param => generate(param, level));

    return "(" + params.join(", ") + ")" + " => " + generate(node.body, level);
  },

  BinaryExpression: function (node, level) {
    return "(" + generate(node.left, level) + " " + node.operator + " " + generate(node.right, level) + ")";
  },

  ArrayExpression: function (node, level) {
    return "[" + node.elements.map(element => generate(element, level)).join(", ") + "]";
  },

  TupleExpression: function (node, level) {
    return "T(" + node.elements.map(element => generate(element, level)).join(", ") + ")";
  },


  Literal: function (node, level) {
    return node.value.toString();
  },

  Identifier: function (node, level) {
    return node.name;
  }
};

function generate(node, level) {
  if (Statement[node.type]) {
    return Statement[node.type](node, level);
  }

  throw new Error("Unknown node type '" + node.type + "'");
}

function generateJS(ast) {
  console.log(util.inspect(ast, { depth: null, breakLength: null })); 

  generate(ast, 0);
}

generateJS(Parser.parse(test));

/*

	Move instanceOf to a method on Object
☑️	Remove ++, -- prefix and postfix operators
	Remove +=, *= etc. operators
	Move bitwise |, &, <<, ~, etc. to methods
☑️	Remove for, do, while iteration					We don't need these with each(), map(), reduce(), etc.
☑️	Remove all unicode rules						Taken out temporarily to simplify the syntax.
☑️	Remove automatic semicolon insertion			Causes bugs. Always use ; at the end of a statement.
	Disallow direct property setting				foo.x = 10; Open to monkey-patching abuse.
	Change == to mean _.isEqual, remove ===
	? Change object notation to use Map()
	Make switch statement more powerful
	Require boolean expressions in if ()
	Make if () an expression, remove ?:
	? Require braces around if ()
	Bind foo.bar to this
☑️	Add fat arrow functions (x => x * x)
☑️	Add named parameters
☑️	Default parameters
	Add operator overloading				operator_isEqual, operator_isGreater, operator_multiply, ...
	Destructured assignment
	? Pattern matching
☑️	Extension methods
☑️	Tuple, Range							"(1, 2, 3)", 1..10
	Require "use strict"
	Optional types							function foo(arg?)
☑️	Immutable types
	Allow strings to span multiple lines

() = apply(), [] index
☑️	Remove [1,,2] elision syntax
☑️	Remove RegExpr literal syntax
    Change object notation to use Map() instead of objects.
    Make switch statement more powerful.
    Add dynamic, non-null requirements in parameters.
    Add support for immutable types (const).

    
    
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

class Foo { }

class String
{
  function foo() {
    return "hello" + "world";
  }

  function bar(x, y) {
    return z => x + y * z;
  }
}

names.split(",").map(name => name.trim());

names.split(",").map(name => {
  return name.trim();
});

x = (1, 2);

foo(("foo", bar, { baz: [1, 2, 3] }));

[(1.0, 0.1), (5.0, 5.5)];

[1..5, (a + b)..(x), 1.5..2.5, 'a'..'z', foo()..bar()];

var data = {
  verticies: [(1, 2), (3, 4), (5, 6), (7, 8), (9, 10)],
  indecies: [0..2, 2..4]
};

data.indicies.each(indexRange => {
  return indexRange.map(index => data.verticies[index]);
});

function test(arg...) {
  return ["foo", arg.toString()...];
}

*/
