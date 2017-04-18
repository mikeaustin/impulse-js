"use strict";

var Immutable = require("../../node_modules/immutable/dist/immutable.js");


function getParameterName(parameter) {
  for (var parameterName in parameter) {
    if (parameterName !== "$") return parameterName;
  }
}

function getParameterType(parameter) {
  for (var parameterName in parameter) {
    if (parameterName !== "$") return parameter[parameterName];
  }
}

function Parameters(signature) {
  this.length = signature.length;

  for (var i = 0; i < signature.length; i++) {
    this[i] = {
      name:    getParameterName(signature[i]),
      type:    getParameterType(signature[i]),
      default: signature[i].$
    };
  }
}

Parameters.prototype.apply = function (_arguments) {
  var _arguments = _arguments || [];
  var args = [], i = 0;

  // Positional arguments

  while (i < _arguments.length && Object.getPrototypeOf(_arguments[i]) !== Object.prototype) {
    var argument = _arguments[i];

    if (this[0].type.from) {
      argument = this[0].type.from(_arguments[i]);
    }

    args.push(argument);

    i += 1;
  }

  // Keyword arguments

  var keywordArguments = _arguments[i];

  while (i < this.length) {
    var argument;

    if (keywordArguments && keywordArguments.hasOwnProperty(this[i].name)) {
      argument = keywordArguments[this[i].name];
    } else if (this[i].hasOwnProperty("default")) {
        argument = this[i]["default"];
    } else {
      throw Error("Missing parameter: '" + this[i].name + "' in call to function '" + "XXX" + "'");
    }
  
    args.push(argument);
    
    i += 1;
  }

  // Runtime typechecking

  for (var i = 0; i < this.length; i++) {
    var parameterName = this[i].name;
    var parameterType = this[i].type;

    if (!parameterType.isTypeOf(args[i])) {
      throw Error("Type mismatch for parameter '" + parameterName + "' in call to function '" + "XXX" + "'" +
                  "; Expected type " + parameterType.name + " but found '" + args[i] + "'.");
    }
  }

  return args;
}

function define(params, func) {
  var parameters = new Parameters(params);

  var closure = function () {
    return func.apply(this, parameters.apply(arguments, func));
  }

  closure.parameters = parameters;

  return closure;
}

module.exports = {
  define: define
}


//
// Tests
//

console.log("\nparameters.js\n");

global.params = new Parameters([{foo: Int, $: 1}, {bar: Union.of(Int, Undefined)}]);

test(' params.apply([10])[0] === 10 ');
test(' params.apply([{foo: 10}])[0] === 10 ');
test(' params.apply([])[0] === 1 ');
//console.log(params.apply(["foo"]));


String.prototype.slice = define([{beginIndex: Number}, {endIndex: Union.of(Number, Undefined), $: undefined}], String.prototype.slice);

global.foo = "foo";

test(' foo.slice.apply(foo, [1]) === "oo" ');
test(' foo.slice.apply(foo, [{beginIndex: 1}]) === "oo" ');
test(' foo.slice.apply(foo, [0, {endIndex: 1}]) === "f" ');
test(' foo.slice.apply(foo, [{beginIndex: 0, endIndex: 1}]) === "f" ');


Number.case = String.case = Array.prototype.case = function (that) {
  return this.isTypeOf(that);
}

Number.prototype.case = String.prototype.case = function (that) {
  return this.isEqual(that);
}

Immutable.Range.prototype.case = function (that) {
  return Number.isTypeOf(that) && this.includes(that);
}

var numberOrString = define([{foo: Union.of(Number, String, [Int], Boolean)}], function (foo) {
  var $; switch (true) {                            // return switch (foo) {
    case R(1, 5).case(foo):                         //
    case (7).case(foo):     $ = "1..5, 7";  break;  //   case 1..5, 7: "1..5, 7"
    case R(100).case(foo):  $ = "100..Inf"; break;  //   case 10..Inf: "10..Inf"  
    case Number.case(foo):  $ = "Number";   break;  //   case Number:  "Number"
    case String.case(foo):  $ = "String";   break;  //   case String:  "String"
    case [Int].case(foo):   $ = "[Int]";    break;  //   case [Int]:   "[Int]"
    default:                $ = "default";  break;  //   else          "default";
  } return $;                                       // }
});

global.numberOrString = numberOrString;
global.R = Immutable.Range;

test(' numberOrString(10) === "Number" ');
test(' numberOrString("10") === "String" ');
test(' numberOrString([10]) === "[Int]" ');
test(' numberOrString(3) === "1..5, 7" ');
test(' numberOrString(7) === "1..5, 7" ');
test(' numberOrString(200) === "100..Inf" ');
test(' numberOrString(true) === "default" ');
