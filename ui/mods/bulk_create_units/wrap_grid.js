define([
  'bulk_create_units/plane_wrap',
  'bulk_create_units/qmath'
], function(projection, VMath) {
  // http://stackoverflow.com/a/31864777/30203
  var spiralGenerator = function() {
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
      }
    }
  }

  var epsilon = 1e-300

  var wrapGridGenerator = function(footprint, center) {

    var spiral = spiralGenerator()

    var stretch = function(g) {
      //console.log([].concat(g), footprint)
      VMath._mul_v2(g, footprint)
      //console.log(g)
      return g
    }

    var wrap = projection(center)

    return {
      next: function() {
        return {value: wrap(stretch(spiral.next().value)), done: false}
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

  return wrapGridGenerator
})
