(function (_Promise) {
  function Promise(executor) {
    var _this = this;

    this.promise = new _Promise(function(resolve, reject) {
      executor(function (value) {
        if (!_this.canceled) resolve(value);
      }, function (reason) {
        if (!_this.canceled) reject(value);
      });
    });
  }

  Promise.prototype.then = function(onFullfilled, onRejected, onCanceled) {
    this.promise.then(onFullfilled, onRejected);
    this.onCanceled = onCanceled;

    return this;
  };

  Promise.prototype.cancel = function() {
    this.canceled = true;
  };

  var promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(10), 1000);
  }).then(() => {
    console.log("here");
  });

  promise.cancel();
})(Promise);

