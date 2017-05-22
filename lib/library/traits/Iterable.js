var Trait = require("../../runtime/module");

var Iterable = new Trait(Iterable, function(iterator) {
  return {
    reduce: function reduce(func, init) {
      var accum = init, iter = iterator.apply(this);

      for (var result = iter.next(); !result.done; result = iter.next()) {
        accum = func(accum, result.value);
      }
      
      return accum;
    },

    filter: function _filter(predicate) {
      var accum = [], iter = iterator.apply(this);

      for (var result = iter.next(); !result.done; result = iter.next()) {
        if (predicate(result.value)) {
          accum.push(result.value);
        }
      }

      if ([Object].isTypeOf(this) || Range.isTypeOf(this)) {
        return accum;
      } else {
        return new this.constructor.from(accum);
      }
    },

    _split: function _split(separator) {
      var iter = iterator.apply(this);
      var array = [];
      var part = new this.constructor().valueOf();

      for (var result = iter.next(); !result.done; result = iter.next()) {
        if (result.value === separator) {
          array.push(part);

          part = new this.constructor().valueOf();
        } else {
          part = part.append(result.value);
        }
      }

      array.push(part);

      return array;
    }
  }
}, ["iterator"]);

module.exports = Iterable;
