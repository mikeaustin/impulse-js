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

    //if (parameterType != null && argumentType != parameterType.prototype) {
    //if (parameterType != null && !parameterType.typeEquals(args[parameterName])) {
    if (parameterType != null && !args[parameterName].isType(parameterType)) {
      throw Error("Type mismatch for parameter '" + parameterName +
                  "' - Expected a " + parameterType.name +
                  " but found a " + argumentType.constructor.name + ".");
    }
  }
  
  return args;
}

function define(params, func) {
  return function() {
    return func(parameters(params, arguments));
  }
}

module.exports = {
  define: define
}


//
// Tests
//

var _addBook = define([{title: String}, {description: String, $: "Untitled"}], function(args) {
  console.log(args);
});

_addBook("Frankenstein", {description: "A great humanity story"});
_addBook({title: "Frankenstein", description: "A great humanity story"});
//foo("Frankenstein", {description: 5});
_addBook("Frankenstein");

/*

String.typeEquals(String)
String.typeEquals(tuple)

T("foo").isType(T(String))

*/
