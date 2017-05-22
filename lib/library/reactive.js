/* trampoline vs stream */

function trampoline(func) {
  var result = func.apply(func, Array.prototype.slice(arguments, 1));
  
  while (result instanceof Function) {
console.log("here");
    result = result();
  };
  
  return result;
}

function factorial (n) {
  var _factorial = trampoline(function myself (acc, n) {
    if (n === 0) {
      return acc;
    }

    return function () { return myself(acc * n, n - 1); }
  });
  
  return _factorial(1, n);
}

//factorial(10);

class Property {
  constructor() {
    this.listeners = new Set();
    this.value = null;
  }

  addListener(listener) {
    this.listeners.add(listener);
  }

  set(value) {
    this.value = value;

    for (let listener of this.listeners) {
      listener(value);
    }
  }
}

class Hub {
  constructor() {
    this.properties = { };

    this.setProperty("busy", false);
  }

  bind(property, binding) {
    if (!this.properties[property]) {
      this.properties[property] = new Property();
    }

    this.properties[property].addListener(value => {
      binding.set(value);
    });
  }

  setProperty(property, value) {
    if (!this.properties[property]) {
      this.properties[property] = new Property();
    }

    this.properties[property].set(value);
  }

  get(url, select) {
    this.setProperty("busy", true);

    setTimeout(() => {
      var result = select({user: "mike"});

      this.setProperty(result[0], result[1]);

      this.setProperty("busy", false);
    }, 1000);

    return this;
  }
}

class App {
  constructor() {
    this.hub = new Hub();

    var nameLabel = { text: new Property() };
    var spinner = { visible: new Property() };

    nameLabel.text.addListener(value => {
      console.log("Set nameLabel.text to '" + value + "'");
    });

    spinner.visible.addListener(value => {
      console.log("Set spinner.visibility to '" + value + "'");
    });

    this.hub.bind("user", nameLabel.text);
    this.hub.bind("busy", spinner.visible);

    this.hub = this.hub.get("http://foo.com", (data) => ["user", data.user]);
  }
}

var app = new App();

