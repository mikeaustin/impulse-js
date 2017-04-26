util = require("util");
fs = require("fs");
peg = require("pegjs");

var Parser = require("./parser");

function inspect() {
  var args = [];

  for (var i = 0; i < arguments.length; i++) {
    args.push(util.inspect(arguments[i], { depth: null, breakLength: null}));
  }

  console.error.apply(null, args);
}

function indent(level) {
  var length = level || 0;

  return Array(length + 1).join("  ");
}

var temp = 0;

var test = `
// (1..5).map(n => n * n);

// function capitalize() {
//   return "Foo";
// }

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  function _add(that) {
    return new Vector(this.x + that.x, this.y + that.y);
  }
}

extend Vector {
  function _sub(that) {
    return new Vector(this.x - that.x, this.y - that.y);
  }
}

console.log(new Vector(1, 2) + new Vector(3, 4));
console.log(new Vector(1, 2) - new Vector(3, 4));

// extend String {
//   function capitalize() {
//     return this.slice(0, 1).toUpperCase() + this.slice(1);
//   }
// }

// extend String with Iterable, Printable {
//   function iterator() {
//     return 0;
//   }
// }

// console.log("foo".capitalize());
`;

//fs.readFile("parser.pegjs", "utf8", function (error, data) {

var operators = {
  "+": "_add",
  "-": "_sub",
  "*": "_mul",
  "/": "_div",
}

var Statement = {
  Program: function (node, level) {
    console.log("var $;");

    for (var i = 0; i < node.body.length; i++) {
      console.log(generate(node.body[i], level));
    }
  },

  VariableDeclaration: (node, level) => {
    return indent(level) + "var " + node.declarations.map(decl => {
      return generate(decl, level);
    }).join(", ") + ";";
  },

  VariableDeclarator: (node, level) => {
    if (!node.init) {
      return generate(node.id, level);
    } else if (node.init.value === null) {
      return generate(node.id, level) + " = " + "null";
    } else {
      return generate(node.id, level) + " = " + generate(node.init, level);
    }
  },

  ClassDeclaration: (node, level) => {
    var id = generate(node.id, level);
    var body = node.body.map(decl => generate(decl, level + 1, node));
    var superclass = node.superclass ? generate(node.superclass, level) : "Object";

    return "var " + id + " = Impulse.define(" + superclass + ", {\n" + body.join(",\n") + "\n});";
  },

  ExtendDeclaration: (node, level) => {
    var id = generate(node.id, level);
    var body = node.body.map(decl => generate(decl, level + 1, node));

    return "var _methods = Impulse.extend(_methods, " + id + ", {\n" + body.join(",\n") + "\n});";
  },

  ConstructorDeclaration: (node, level, parent) => {
    var params = node.params.map(param => generate(param, level));
    var name = generate(parent.id, level);
    var body = generate(node.body, level, {functionDeclaration: true});

    return indent(level) + "constructor: function " + name + "(" + params.join(", ") + ") " + body;
  },

  FunctionDeclaration: function (node, level, parent) {
    var params = node.params.map(param => generate(param, level));
    var name = generate(node.id, level);
    var body = generate(node.body, level, {functionDeclaration: true});

    if (parent && (parent.type === "ClassDeclaration" || parent.type === "ExtendDeclaration")) {
      return indent(level) + name + ": function " + name + "(" + params.join(", ") + ") " + body;
    } else {
      return indent(level) + "function " + name + "(" + params.join(", ") + ") " + generate(node.body, level, {functionDeclaration: true});
    }
  },

  //

  BlockStatement: function (node, level, options) {
    var functionDeclaration = options && options.functionDeclaration;
    var functionExpression = options && options.functionExpression;

    var statements = [indent(level + 1) + "var $;\n"].concat(node.body.map(statement => {
      return generate(statement, level + 1);
    }));

    if (functionDeclaration) {
      return "{\n" + indent(level + 1) + "var _this = this;\n" + statements.join("\n") + (statements.length > 0 ? "\n" : "") + indent(level) + "}";
    } else if (functionExpression) {
      return "{\n" + statements.join("\n") + "\n" + indent(level) + "}";
    } else {
      return indent(level) + "void function () {\n" + statements.join("\n") + (statements.length > 0 ? "\n" : "") + indent(level) + "}();";
    }
  },

  ReturnStatement: function (node, level) {
    return indent(level) + "return " + generate(node.argument, level) + ";";
  },

  ExpressionStatement: function (node, level) {
    return indent(level) + generate(node.expression, level) + ";";
  },

  //

  AssignmentExpression: function (node, level) {
    return generate(node.left, level) + " = " + generate(node.right, level);
  },

  FunctionExpression: function (node, level) {
    var params = node.params.map(param => generate(param, level));

    return "(" + params.join(", ") + ")" + " => " + generate(node.body, level, {functionExpression: true});
  },

  NewExpression: (node, level) => {
    var callee = generate(node.callee, level);
    var args = node.arguments.map(arg => generate(arg, level));

    return "new " + callee + "(" + args.join(", ") + ")";
  },

  BinaryExpression: function (node, level) {
    var left = generate(node.left, level);
    var right = generate(node.right, level);

    if (true) {
      return "($ = " + left + ", $." + operators[node.operator] + " || _methods." + operators[node.operator] + ")" + ".apply($, [" + right + "])";
    } else {
      return "(" + generate(node.left, level) + " " + node.operator + " " + generate(node.right, level) + ")";
    }
  },

  ArrayExpression: function (node, level) {
    return "[" + node.elements.map(element => generate(element, level)).join(", ") + "]";
  },

  TupleExpression: function (node, level) {
    return "T(" + node.elements.map(element => generate(element, level)).join(", ") + ")";
  },

  RangeExpression: function (node, level) {
    var left = generate(node.left, level);
    var right = generate(node.right, level);

    return "R(" + left + ", " + right + ")";
  },

  CallExpression: function (node, level) {
    var arguments = node.arguments.map(argument => generate(argument, level));
    var object = node.callee.type === "MemberExpression" ? generate(node.callee.object, level) : null;
    var property = node.callee.type === "MemberExpression" ? generate(node.callee.property, level) : null;

    if (object) {
      return "($ = " + object + ", $." + property + " || _methods." + property + ").apply(" + "$" + ", [" + arguments + "])";
    } else {
      return generate(node.callee,  level) + ".apply(" + "null" + ", [" + arguments + "])";
    }
  },

  MemberExpression: function (node, level) {
    var object = generate(node.object, level);
    var property = generate(node.property, level);

    //return object + "." + property + " || _methods." + property;
    return object + "." + property;
  },

  ThisExpression: (node, level) => {
    return "_this";
  },

  //

  Literal: function (node, level) {
    if (typeof node.value === "string") {
      return '"' + node.value + '"';
    } else {
      return node.value.toString();
    }
  },

  Identifier: function (node, level) {
    return node.name;
  }
};

function generate(node, level, options) {
  if (Statement[node.type]) {
    return Statement[node.type](node, level, options);
  }

  throw new Error("Unknown node type '" + node.type + "'");
}


var ast = Parser.parse(test);

inspect(ast);

console.log("'use strict'");
console.log("var Impulse = require('./src/runtime');");
console.log("String.prototype._add = function (that) { return this + that; };");
console.log("Number.prototype._add = function (that) { return this + that; };");
console.log("Number.prototype._sub = function (that) { return this - that; };");

generate(ast, 0);

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
