var Parameters = require("../runtime/parameters.js");


Map.isTypeOf = function(that) {
  return that instanceof this;
}

var ul = Parameters.define([{properties: Map}, {children: [Object], $: []}], function (properties, children) {
  return '<ul' + joinAttrs(properties) + '>' + children.join("") + '</ul>'
});

var li = Parameters.define([{properties: Map}, {children: [Object], $: []}], function (properties, children) {
  return '<li' + joinAttrs(properties) + '>' + children.join("") + '</li>'
});

function joinAttrs(attrs) {
  var str = "";

  for (var item of attrs) {
    str += item[0] + '="' + item[1] + '"';
  }

  return (str !== "" ? " " : "") + str;
}

console.log("\nhtml.js\n");

global.html = (
  ul (new Map([["class", "parts"]]), [
    li (new Map(), ["text"])
  ])
);

test(' html === "<ul class=\\"parts\\"><li>text</li></ul>" ');
