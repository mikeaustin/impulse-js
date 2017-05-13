"use strict";

// @flow

var util = require("util");
var fs = require("fs");
var peg = require("pegjs");

var Parser = require("./parser");

//

function joinWithTrailing(array, separator) {
  return array.join(separator) + (array.length > 0 ? separator : "");
}

function stringifyKeywords(keywordArguments) {
  var array = [];

  for (var keyword in keywordArguments) {
    array.push(keyword + ":" + " " + keywordArguments[keyword]);
  }

  return "{" + array.join(", ") + "}";
}

function isKeywordArgsEmpty(keywordArguments) {
  for (var p in keywordArguments) {
    return false;
  }

  return true;
}

function generate(node, level, options) {
  if (Statement[node.type]) {
    return Statement[node.type](node, level, options);
  }

  throw new Error("Unknown node type '" + node.type + "'");
}

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

var knownProperties = {
  console: { log: true }
};


fs.readFile(process.argv[2], "utf8", function (error, data) {
  var ast = Parser.parse(data);

  //inspect(ast);

  console.log("'use strict';");
  console.log("var __FILE__ = '" + process.argv[2] + "';");
  console.log("var __LINE__ = '" + 0 + "';");
  console.log("var Impulse = require('./src/runtime');");
  console.log("var T = require('./src/runtime/tuple').of;");
  console.log("var R = require('./src/runtime/range').of;");

  generate(ast, 0);
});


var operators = {
  "+"  : "_add",
  "-"  : "_sub",
  "*"  : "_mul",
  "/"  : "_div",

  "==" : "_eql",
  "!=" : "_neql",
  "<"  : "_lt",
  ">"  : "_gt",
  "<=" : "_lte",
  ">=" : "_gte",

  "<<" : "append",
  "++" : "concat",
}

var Statement = {
  //
  // Top Level
  //

  Program: (node, level) => {
    console.log("var $;");

    for (var i = 0; i < node.body.length; i++) {
      console.log(generate(node.body[i], level, node));
    }
  },

  //
  // Declarations
  //

  VariableDeclaration: (node, level) => {
    return indent(level) + "var " + node.declarations.map(decl => {
      return generate(decl, level, node);
    }).join(", ") + ";";
  },

  VariableDeclarator: (node, level) => {
    if (!node.init) {
      return generate(node.id, level, node);
    } else if (node.init.value === null) {
      return generate(node.id, level, node) + " = " + "null";
    } else {
      return generate(node.id, level, node) + " = " + generate(node.init, level, node);
    }
  },

  ClassDeclaration: (node, level, parent) => {
    var id = generate(node.id, level, node);
    var body = node.body.map(decl => generate(decl, level + 1, node));
    var superclass = node.superclass ? generate(node.superclass, level, node) : "Object";

    if (parent.type === "ClassDeclaration") {
      return indent(level) + id + ": Impulse.define(" + superclass + ", {\n" + body.join(",\n") + "\n})";
    } else {
      return "var " + id + " = Impulse.define(" + superclass + ", {\n" + body.join(",\n") + "\n});";
    }
  },

  ExtendDeclaration: (node, level) => {
    var id = generate(node.id, level, node);
    var body = node.body.map(decl => generate(decl, level + 1, node));
    var traits = node.traits.map(trait => {
      var methods = "Iterable.bindMethods(" + id + ".prototype." + "iterator" + " || _methods." + "iterator" + ")";

      return "var _methods = Impulse.extend(_methods, " + id + ", " + methods + ");";
      //return "var _methods = Impulse.extend(_methods, " + id + ", { reduce: Iterable.methods.reduce(_methods.iterator) });\n";
    });

    return "var _methods = Impulse.extend(_methods, " + id + ", {\n" + joinWithTrailing(body, ",\n") + "});" + traits.join("");
  },

  ConstructorDeclaration: (node, level, parent) => {
    var params = node.params.map(param => generate(param, level, node));
    var name = generate(parent.id, level, node);
    var body = generate(node.body, level, node);

    return indent(level) + "constructor: function " + name + "(" + params.join(", ") + ") " + body;
  },

  FunctionDeclaration: (node, level, parent) => {
    var params = node.params.map(param => generate(param, level, node));
    var name = generate(node.id, level, node);
    var body = generate(node.body, level, node);

    if (parent && (parent.type === "ClassDeclaration" || parent.type === "ExtendDeclaration")) {
      return indent(level) + name + ": function " + name + "(" + params.join(", ") + ") " + body;
    } else {
      return indent(level) + "function " + name + "(" + params.join(", ") + ") " + body;
    }
  },

  //
  // Statements
  //

  BlockStatement: (node, level, parent) => {
    function buildStatements(body, level) {
      var statements = [];
    
      while (body.length > 0) {
        var statement = body.shift();

        if (statement.type === "ContinuationDeclaration") {
          var init = generate(statement.init, level + 1, node);
          var id = generate(statement.id, level, node);
          var cont = buildStatements(body, level + 1);

          statements.push(indent(level + 1) + init + ".then(" + id + " => {\n" + cont + "\n" + indent(level + 1) + "});");
        } else {
          statements.push(generate(statement, level + 1, node));
        }
      }

      return statements.join("\n");
    }

    var functionDeclaration = parent.type === "FunctionDeclaration" || parent.type === "ConstructorDeclaration";
    var functionExpression = parent.type === "FunctionExpression" || parent.type === "IfStatement";

    // var statements = [indent(level + 1) + "var $;\n"].concat(node.body.map(statement => {
    //   return generate(statement, level + 1, node);
    // }));

    var statements = [indent(level + 1) + "var $;"].concat(buildStatements(node.body.slice(), level));

    if (functionDeclaration) {
      return "{\n" + indent(level + 1) + "var _this = this;\n" + joinWithTrailing(statements, "\n") + indent(level) + "}";
    } else if (functionExpression) {
      return "{\n" + statements.join("\n") + "\n" + indent(level) + "}";
    } else {
      return indent(level) + "void function () {\n" + joinWithTrailing(statements, "\n") + indent(level) + "}();";
    }
  },

  IfStatement: (node, level, parent) => {
    var test = generate(node.test, level, node);
    var consequent = generate(node.consequent, level, node);
    var alternate = generate(node.alternate, level, node);

    return indent(level) + "if (assertBoolean(" + test + ")) " + consequent + " else " + alternate;
  },

  ReturnStatement: (node, level) => {
    var argument = node.argument ? " " + generate(node.argument, level, node) : "";

    return indent(level) + "return" + argument + ";";
  },

  ExpressionStatement: (node, level) => {
    return indent(level) + generate(node.expression, level, node) + ";";
  },

  //
  // Expressions
  //

  AssignmentExpression: (node, level) => {
    return generate(node.left, level, node) + " = " + generate(node.right, level, node);
  },

  FunctionExpression: (node, level) => {
    var params = node.params.map(param => generate(param, level, node));

    //if (node.body.type === "Expression")
    return "(" + params.join(", ") + ")" + " => " + generate(node.body, level, node);
  },

  NewExpression: (node, level) => {
    var callee = generate(node.callee, level, node);
    var args = node.arguments.map(arg => generate(arg, level, node));

    return "new (" + callee + ")(" + args.join(", ") + ")";
  },

  BinaryExpression: (node, level) => {
    var left = generate(node.left, level, node);
    var right = generate(node.right, level, node);

    // if (true) {
      if (node.operator === "===")
        return left + " === " + right;
      else
        return "($ = " + left + ", $." + operators[node.operator] + " || _methods." + operators[node.operator] + ")" + ".apply($, [" + right + "])";
    // } else {
    //   return "(" + generate(node.left, level, node) + " " + node.operator + " " + generate(node.right, level, node) + ")";
    // }
  },

  ObjectExpression: (node, level) => {

  },

  LogicalExpression: (node, level, parent) => {
    var left = generate(node.left, level, node);
    var right = generate(node.right, level, node);

    return left + " " + node.operator + " " + right;
  },

  ArrayExpression: (node, level) => {
    return "[" + node.elements.map(element => generate(element, level, node)).join(", ") + "]";
  },

  TupleExpression: (node, level) => {
    return "T(" + node.elements.map(element => generate(element, level, node)).join(", ") + ")";
  },

  RangeExpression: (node, level) => {
    var left = generate(node.left, level, node);
    var right = generate(node.right, level, node);

    return "R(" + left + ", " + right + ")";
  },

  CallExpression: (node, level) => {
    var args = [];
    var keywordArgs = {};

    node.arguments.forEach(arg => {
      if (arg.type === "KeywordArgument") {
        keywordArgs[arg.keyword.name] = generate(arg.expression, level, node);
      } else {
        args.push(generate(arg, level, node));
      }
    });

    if (node.callee.type === "MemberExpression") {
      var object = generate(node.callee.object, level, node);
      var property = generate(node.callee.property, level, node);

      if (!isKeywordArgsEmpty(keywordArgs)) {
        args.push(stringifyKeywords(keywordArgs));
      }

      return "(__LINE__ = " + node.line + ", $ = " + object + ", $." + property + " || _methods." + property + ").apply(" + "$" + ", [" + args.join(", ") + "])";
    } else {
      return "(__LINE__ = " + node.line + ", " + generate(node.callee, level, node) + ").apply(" + "null" + ", [" + args.join(", ") + "])";
    }
  },

  MemberExpression: (node, level, parent) => {
    var object = generate(node.object, level, node);
    var property = generate(node.property, level, node);

    if (node.computed) {
      return "(__LINE__ = " + node.line + ", $ = " + object + ", $._idx || _methods._idx).apply(" + "$" + ", [" + property + "])";
      //return object + "[" + property + "]";
    } else if (parent.type === "AssignmentExpression") {
      return object + "." + property;
    } else {
      return object + "." + property + ".valueOf(" + object + ")";
    }
  },

  ThisExpression: (node, level) => {
    return "_this";
  },

  //
  // Primaries
  //

  FormalParameter: (node, level) => {
    return generate(node.id, level);
  },

  Literal: (node, level) => {
    if (typeof node.value === "string") {
      return '"' + node.value + '"';
    } else {
      return node.value.toString();
    }
  },

  Identifier: (node, level) => {
    return node.name;
  }
};

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
