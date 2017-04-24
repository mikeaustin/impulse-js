var String = function(string) {
  if (!global._String) {
    global._String = global.String;
  }

  var s = new _String(string);

  return s;
}

var s = new String("foo");

console.log(s);

