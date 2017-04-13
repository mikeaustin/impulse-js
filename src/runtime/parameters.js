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

    if (parameterType != null && !args[i].isType(parameterType)) {
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

String.prototype.slice.parameters = [{beginIndex: Number}, {endIndex: Number, $: undefined}];

global.foo = "foo";

test(' foo.slice.apply(foo, [1]) == "oo" ');
test(' foo.slice.apply(foo, [{beginIndex: 1}]) == "oo" ');
test(' foo.slice.apply(foo, [0, {endIndex: 1}]) == "f" ');
test(' foo.slice.apply(foo, [{beginIndex: 0, endIndex: 1}]) ');


Union.prototype.match = function() {
  for (var i = 0; i < arguments.length; i++) {
    var parameterType = getParameterType(arguments[i].parameters[0]);

    if (this.values[0].isType(parameterType)) {
      return arguments[i](this.values[0]);
    }
  }
}

var numberOrString = define([{foo: Union.of(Number, String)}], function(foo) {
  return "Argument " + foo.match(
    define([{foo: Number}], function(foo) { return "is a Number"; }),
    define([{foo: String}], function(foo) { return "is a String"; })
  );
});

console.log(numberOrString(Union.of(10)));
console.log(numberOrString(Union.of("10")));


var array = define([{foo: [Number]}], function(foo) {
  return "Yup, it's an array of Numbers";
});

console.log(array([1, 2, 3]));
