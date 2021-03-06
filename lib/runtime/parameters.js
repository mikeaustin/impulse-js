"use strict";


function getParameterName(parameter) {
  for (var parameterName in parameter) {
    if (parameter.hasOwnProperty(parameterName)) {
      if (parameterName !== "$") return parameterName;
    }
  }
}

function getParameterType(parameter) {
  for (var parameterName in parameter) {
    if (parameter.hasOwnProperty(parameterName)) {
      if (parameterName !== "$") return parameter[parameterName];
    }
  }
}


/**
 * @constructor Parameters
 * @memberof module:impulse
 *
 * @summary Transforms keyword parameters into normal arguments, and does runtime parameter typechecking.
**/

function Parameters(signature) {
  this.length = signature.length;

  for (var i = 0; i < signature.length; i++) {
    var parameterName = getParameterName(signature[i]);
    var parameterType = getParameterType(signature[i]);

    this[i] = {
      name:    parameterName,
      type:    parameterType,
      //default: signature[i].$
    };

    if (signature[i].hasOwnProperty("$")) {
      this[i]["default"] = signature[i].$;
    }
  }
}

Parameters.prototype.apply = function (_arguments, _object, _function) {
  var _arguments = _arguments || [];
  var args = [], i = 0;

  // Positional arguments

  while (i < _arguments.length && Object.getPrototypeOf(_arguments[i]) !== Object.prototype) {
    var argument = _arguments[i];

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
      argument = undefined;
    }
  
    args.push(argument);
    
    i += 1;
  }

  // Runtime typechecking

  for (var i = 0; i < this.length; i++) {
    var parameterName = this[i].name;
    var parameterType = this[i].type;

    if (!parameterType.isTypeOf(args[i])) {
      var parameterFunc = _object.constructor.name + "#" + _function.name;

      throw TypeError("[" + global.__FILE__ + " : " + global.__LINE__ + "] " +
                      // "Expected type '" + parameterType.name + "' but found '" + args[i] +
                      "Expected type '" + parameterType.name + "' for parameter '" + parameterName + "' in call to function '" + parameterFunc + "'.");
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


var _apply = Function.prototype.apply;

Function.prototype.apply = function apply(_this, args) {
  var args = this.parameters ? this.parameters.apply(args, _this, this) : args;

  return _apply.call(this, _this, args);
}

//
// Exports
//

module.exports = Parameters;
