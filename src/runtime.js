"use strict";

var Extension = require("./runtime/extension.js");
var Tuple = require("./runtime/tuple.js");
var Extensions = require("./library/extensions.js");

var Impulse = {
  extend: Extension.extend,
  Tuple: Tuple
};

module.exports = {
  Impulse: Impulse
}

var _toString = Extensions._toString;


//
// Tests
//

console.log(_toString.apply({ foo: [1, 2, 3] }));
console.log(_toString.apply(_toString));

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
    
    if (parameterType != null && argumentType != parameterType.prototype) {
      throw Error("Type mismatch for parameter '" + parameterName +
                  "' - Expected a " + parameterType.name +
                  " but found a " + argumentType.constructor.name + ".");
    }
  }
  
  return args;
}

function foo() {
  var args = parameters([
    {title: String}, {description: String, $: "Untitled"}
  ], arguments);
  
  console.log(args);
}

foo("Frankenstein", {description: "A great humanity story"});
foo({title: "Frankenstein", description: "A great humanity story"});
//foo("Frankenstein", {description: 5});
foo("Frankenstein");
