"use strict";


//
// class Parameters
//

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
    var parameterName = getParameterName(signature[i]);
    var parameterType = getParameterType(signature[i]);

    this[i] = {
      name:    parameterName,
      type:    parameterType,
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
  var restArguments = _arguments[i + 1];

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

Parameters.define = function (params, func) {
  var parameters = new Parameters(params);

  var closure = function () {
    return func.apply(this, parameters.apply(arguments, func));
  }

  closure.parameters = parameters;

  return closure;
}

//
// Exports
//

module.exports = Parameters;
