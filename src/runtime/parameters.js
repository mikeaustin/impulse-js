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

Parameters.prototype.apply = function(_arguments) {
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

var params = new Parameters([{foo: Int, $: 1}, {bar: Union.of(Int, Undefined)}]);
console.log(params.apply([10]));
console.log(params.apply([{foo: 10}]));
console.log(params.apply([]));
//console.log(params.apply(["foo"]));


function applyParameters(parameters, _arguments, func) {
  var args = [], i = 0;
  var _arguments = _arguments || [];

  // Positional arguments

  while (i < _arguments.length && getPrototypeOf(_arguments[i]) !== Object.prototype) {
    var parameterType = getParameterType(parameters[i]);
    var argument = _arguments[i];

    if (parameterType.from) {
      argument = parameterType.from(_arguments[i]);
    }

    args.push(argument);
    
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

  // Runtime typechecking

  for (var i = 0; i < parameters.length; i++) {
    var parameterName = getParameterName(parameters[i]);
    var parameterType = getParameterType(parameters[i]);

    if (!parameterType.isTypeOf(args[i])) {
      throw Error("Type mismatch for parameter '" + parameterName + "' in call to function '" + func.name + "'" +
                  "; Expected type " + parameterType.name + " but found '" + args[i] + "'.");
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

String.prototype.slice.parameters = [{beginIndex: Number}, {endIndex: Union.of(Number, Undefined), $: undefined}];

global.foo = "foo";

test(' foo.slice.apply(foo, [1]) == "oo" ');
test(' foo.slice.apply(foo, [{beginIndex: 1}]) == "oo" ');
test(' foo.slice.apply(foo, [0, {endIndex: 1}]) == "f" ');
test(' foo.slice.apply(foo, [{beginIndex: 0, endIndex: 1}]) ');


var numberOrString = define([{foo: Union.of(Number, String)}], function(foo) {
  return foo.match(
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
