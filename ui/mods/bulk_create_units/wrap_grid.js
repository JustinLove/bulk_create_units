define([
  'bulk_create_units/spiral_grid',
  'bulk_create_units/plane_wrap',
  'bulk_create_units/qmath'
], function(spiralGenerator, projection, VMath) {
  return function(footprint, center) {

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
})
