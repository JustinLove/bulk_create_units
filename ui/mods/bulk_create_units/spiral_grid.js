define([
], function() {
  // http://stackoverflow.com/a/31864777/30203
  return function() {
    var x = 0;
    var y = 0;
    return {
      next: function() {
        var v = {value: [x, y], done: false}
        if(Math.abs(x) <= Math.abs(y) && (x != y || x >= 0)) {
          x += ((y >= 0) ? 1 : -1);
        } else {
          y += ((x >= 0) ? -1 : 1);
        }
        return v
      },
      take: function(n) {
        var locs = new Array(n)
        for (var i = 0;i < n;i++) {
          locs[i] = this.next().value
        }
        return locs
      }
    }
  }
})
