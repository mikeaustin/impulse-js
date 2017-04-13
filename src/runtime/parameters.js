"use strict";

var getPrototypeOf = Object.getPrototypeOf;

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

function applyParameters(parameters, _arguments, func) {
  var args = [], i = 0;
  var _arguments = _arguments || [];

  // Positional arguments

  while (i < _arguments.length && getPrototypeOf(_arguments[i]) !== Object.prototype) {
    args.push(_arguments[i]);
    
    i += 1;
  }

  // Keyword arguments

  var keywordArguments = _arguments[i];

  while (i < parameters.length) {
    var parameterName = getParameterName(parameters[i]);
    var argument;

    if (keywordArguments && keywordArguments.hasOwnProperty(parameterName)) {
      argument = keywordArguments[parameterName];
    } else if (parameters[i].hasOwnProperty("$")) {
        argument = parameters[i]["$"];
    } else {
      throw Error("Missing parameter: '" + parameterName + "' in call to function '" + func.name + "'");
    }
  
    args.push(argument);
    
    i += 1;
  }

  // Typechecking

  for (var i = 0; i < parameters.length; i++) {
    var parameterName = getParameterName(parameters[i]);
    var parameterType = getParameterType(parameters[i]);

    if (parameters[i].hasOwnProperty("$") && parameters[i]["$"] === undefined)
      continue;
    
    var argumentType = getPrototypeOf(args[i]);

    //if (parameterType != null && !args[i].isType(parameterType)) {
    if (parameterType != null && !parameterType.isTypeOf(args[i])) {
      throw Error("Type mismatch for parameter '" + parameterName + "' in call to function '" + func.name + "'" +
                  "; Expected a " + parameterType.name + " but found a " + argumentType.constructor.name + ".");
    }
  }
    
  return args;
}

function define(params, func) {
  var closure = function() {
    return func.apply(null, applyParameters(params, arguments, func));
  }

  closure.parameters = params;

  return closure;
}

module.exports = {
  define: define
}


//
// Tests
//

//var _addBook = define([{title: String}, {description: String, $: "Untitled"}], function _addBook(title, description) {
//  console.log(title, description);
//});
//
//_addBook("Frankenstein", "A great humanity story");
//_addBook("Frankenstein", {description: "A great humanity story"});
//_addBook({title: "Frankenstein", description: "A great humanity story"});
//_addBook("Frankenstein");
//try {
//  _addBook("Frankenstein", 5);
//} catch(error) {
//  console.log(error);
//}
//try {
//  _addBook({description: "A great humanity story"});
//} catch(error) {
//  console.log(error);
//}

Function.prototype._apply = Function.prototype.apply;
Function.prototype.apply = function(thisArg, argsArray) {
  if (this.parameters) {
    return this._apply(thisArg, applyParameters(this.parameters, argsArray, this));
  } else {
    return this._apply(thisArg, argsArray);
  }
}

//
// Tests
//

console.log("\nparameters.js\n");

String.prototype.slice.parameters = [{beginIndex: Number}, {endIndex: Number, $: undefined}];

global.foo = "foo";

test(' foo.slice.apply(foo, [1]) == "oo" ');
test(' foo.slice.apply(foo, [{beginIndex: 1}]) == "oo" ');
test(' foo.slice.apply(foo, [0, {endIndex: 1}]) == "f" ');
test(' foo.slice.apply(foo, [{beginIndex: 0, endIndex: 1}]) ');


Boolean.prototype.matchType = Number.prototype.matchType = String.prototype.matchType = function() {
  for (var i = 0; i < arguments.length; i++) {
    var parameterType = getParameterType(arguments[i].parameters[0]);

    if (parameterType.isTypeOf(this)) {
      return arguments[i](this);
    }
  }

  throw Error("No match");
}

var numberOrString = define([{foo: Union.of(Number, String)}], function(foo) {
  return foo.matchType(
    define([{foo: Number}], function(foo) { return "Number"; }),
    define([{foo: String}], function(foo) { return "String"; })
  );
});

global.numberOrString = numberOrString;

test(' numberOrString(10) == "Number" ');
test(' numberOrString("10") == "String" ');


var testArray = define([{foo: [Number]}], function(foo) {
  return true;
});

global.testArray = testArray;

test(' testArray([1, 2, 3]) == true ');
