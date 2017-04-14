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

function define(params, func) {
  var parameters = new Parameters(params);

  var closure = function() {
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

// Function.prototype._apply = Function.prototype.apply;
// Function.prototype.apply = function(thisArg, argsArray) {
//   if (this.parameters) {
//     return this._apply(thisArg, applyParameters(this.parameters, argsArray, this));
//   } else {
//     return this._apply(thisArg, argsArray);
//   }
// }

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


var numberOrString = define([{foo: Union.of(Number, String)}], function(foo) {
  return foo.match(
    define([{foo: Number}], function(foo) { return "Number"; }),
    define([{foo: String}], function(foo) { return "String"; })
  );
});

global.numberOrString = numberOrString;

test(' numberOrString(10) === "Number" ');
test(' numberOrString("10") === "String" ');


var testArray = define([{foo: [Number]}], function(foo) {
  return true;
});

global.testArray = testArray;

test(' testArray([1, 2, 3]) === true ');
