"use strict";

// @flow

var util = require("util");
var fs = require("fs");
var peg = require("pegjs");

var Parser = require("./parser");

//

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
  console.log("var Range = require('./src/runtime/range');");
  console.log("var R = require('./src/runtime/range').of;");

  var statements = generate(ast, 1);

  console.log("try {");
  statements.forEach(statement => console.log(statement));
  console.log("} catch (e) {");
  console.log("  var stack = '\\n' + e.stack.toString().split('\\n').slice(1).join('\\n');");
  console.log("  console.log(e.name + ': [' + __FILE__ + ' : ' + __LINE__ + ']', e.message, stack);");
  console.log("};");
});


var operators = {
  "+"  : "_add",
  "-"  : "_sub",
  "*"  : "_mul",
  "/"  : "_div",
  "%"  : "_mod",

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
    var statements = [];

    statements.push(indent(level) + "var $;");

    for (var i = 0; i < node.body.length; i++) {
      statements.push(generate(node.body[i], level, node));
    }

    return statements;
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
      return indent(level) + id + ": Impulse.define(" + superclass + ", {\n" + body.join(",\n") + "\n" + indent(level) + "});";
    } else {
      return indent(level) + "var " + id + " = Impulse.define(" + superclass + ", {\n" + body.join(",\n") + "\n" + indent(level) + "});";
    }
  },

  TraitDeclaration: (node, level, parent) => {
    var id = generate(node.id, level, node);
    var required = node.required.map(req => req.id.name);
    var body = node.body.map(decl => generate(decl, level + 2, node));

    return indent(level) + "var " + id + " = new Impulse.Trait(" + id + ", function (" + required.join(", ") + ") {\n" + indent(level + 1) +
           "return {\n" + body.join(",\n") + "\n" + indent(level + 1) + "};" + "\n" + indent(level) + "}" +
           ", [" + required.map(r => '"' + r + '"').join(", ") + "]);";
  },

  ExtendDeclaration: (node, level) => {
    var id = generate(node.id, level, node);
    var body = node.body.map(decl => generate(decl, level + 1, node));
    var traits = node.traits.map(trait => {
      var required = trait.id.name + ".required.map(req => " + id + "[req] || _methods[req])";

      return indent(level) + "var _methods = Impulse.extend(_methods, " + id + ", " + trait.id.name + ".methods.apply(null, " + required + ")" + ");";
    });

    return indent(level) + "var _methods = Impulse.extend(_methods, " + id + ", {\n" + body.join(",\n") + "\n" + indent(level) + "});\n" +
           traits.join("");
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

    if (parent && (parent.type === "ClassDeclaration" || parent.type === "TraitDeclaration" || parent.type === "ExtendDeclaration")) {
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

          statements.push(indent(level + 1) + "return " + init + ".then(" + id +
                                              " => {\n" + cont + "\n" + indent(level + 1) + "});");
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
      return "{\n" + indent(level + 1) + "var _this = this;\n" + statements.join("\n") + "\n" + indent(level) + "}";
    } else if (functionExpression) {
      return "{\n" + statements.join("\n") + "\n" + indent(level) + "}";
    } else {
      return indent(level) + "(function () {\n" + statements.join("\n") + "\n" + indent(level) + "})();";
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
    var operator = operators[node.operator];

    if (node.operator === "===")
      return left + " === " + right;
    else
      return "($ = " + left + ", $." + operator + " || _methods." + operator + ")" +
             ".apply($, [" + right + "])";
  },

  ObjectExpression: (node, level) => {
    var properties = node.properties.map(property => {
      return generate(property, level);
    });

    return "new Map([" + properties.join(", ") + "])";
  },

  Property: (node, level) => {
    return "[" + generate(node.key, level) + ", " + generate(node.value, level) + "]";
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

      return "(__LINE__ = " + node.line + ", $ = " + object + ", $." + property + " || _methods." + property + ")" +
             ".apply(" + "$" + ", [" + args.join(", ") + "])";
    } else {
      return "(__LINE__ = " + node.line + ", " + generate(node.callee, level, node) + ")" +
             ".apply(" + "null" + ", [" + args.join(", ") + "])";
    }
  },

  MemberExpression: (node, level, parent) => {
    var object = generate(node.object, level, node);
    var property = generate(node.property, level, node);

    if (node.computed) {
      return "(__LINE__ = " + node.line + ", $ = " + object + ", $._idx || _methods._idx)" +
             ".apply(" + "$" + ", [" + property + "])";
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
