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

function parameters(parameters, _arguments) {
  var args = { };
  
  for (var i = 0; i < _arguments.length; i++) {
    var isKeywordArgument = Object.getPrototypeOf(_arguments[i]) === Object.prototype;
  
    if (!isKeywordArgument) {
      var parameterName = getParameterName(parameters[i]);
      
      args[parameterName] = _arguments[i];
    } else {
      var keywordArguments = _arguments[i];
      
      for (var parameterName in keywordArguments) {
        args[parameterName] = keywordArguments[parameterName];
      }
    }
  }

  for (var j = 0; j < parameters.length; j++) {
    var parameterName = getParameterName(parameters[j]);
    var parameterType = getParameterType(parameters[j]);

	if (args[parameterName] === undefined) {
      var defaultValue = parameters[j]["$"];
      
      if (defaultValue !== undefined) {
        args[parameterName] = defaultValue;
      } else {
        throw Error("Missing parameter: '" + parameterName + "'");
      }
    }
    
    var argumentType = Object.getPrototypeOf(args[parameterName]);

    if (parameterType != null && !args[parameterName].isType(parameterType)) {
      throw Error("Type mismatch for parameter '" + parameterName +
                  "' - Expected a " + parameterType.name +
                  " but found a " + argumentType.constructor.name + ".");
    }
  }
  
  return args;
}

function parameters(parameters, _arguments, func) {
  var args = [], i = 0;

  // Positional arguments

  while (i < _arguments.length && getPrototypeOf(_arguments[i]) !== Object.prototype) {
    args.push(_arguments[i]);
    
    i += 1;
  }

  // Keyword arguments

  var keywordArguments = _arguments[i];

  while (i < parameters.length) {
    var parameterName = getParameterName(parameters[i]);
    var argument = keywordArguments && keywordArguments[parameterName];

    if (argument === undefined) {
      var defaultValue = parameters[i]["$"];
      
      if (defaultValue !== undefined) {
        argument = defaultValue;
      } else {
        throw Error("Missing parameter: '" + parameterName + "' in call to function '" + func.name + "'");
      }
    }  
  
    args.push(argument);
    
    i += 1;
  }

  // Typechecking

  for (var i = 0; i < parameters.length; i++) {
    var parameterName = getParameterName(parameters[i]);
    var parameterType = getParameterType(parameters[i]);
    
    var argumentType = getPrototypeOf(args[i]);

    if (parameterType != null && !args[i].isType(parameterType)) {
      throw Error("Type mismatch for parameter '" + parameterName + "' in call to function '" + func.name + "'" +
                  "; Expected a " + parameterType.name + " but found a " + argumentType.constructor.name + ".");
    }
  }
    
  return args;
}

function define(params, func) {
  return function() {
    return func.apply(null, parameters(params, arguments, func));
  }
}

module.exports = {
  define: define
}


//
// Tests
//

var _addBook = define([{title: String}, {description: String, $: "Untitled"}], function _addBook(title, description) {
  console.log(title, description);
});

_addBook("Frankenstein", "A great humanity story");
_addBook("Frankenstein", {description: "A great humanity story"});
_addBook({title: "Frankenstein", description: "A great humanity story"});
_addBook("Frankenstein");
try {
  _addBook("Frankenstein", 5);
} catch(error) {
  console.log(error);
}
try {
  _addBook({description: "A great humanity story"});
} catch(error) {
  console.log(error);
}

String.parameters = [{beginIndex: Number}, {endIndex: Number, $: undefined}];

String.prototype.slice.apply("foo", parameters(String.parameters, [0], String.prototype.slice));

/*

String.typeEquals(String)
String.typeEquals(tuple)

T("foo").isType(T(String))

*/
