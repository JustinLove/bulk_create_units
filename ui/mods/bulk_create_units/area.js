define([
  'bulk_create_units/fibonacci_sphere',
  'bulk_create_units/qmath'
], function(sphere, VMath) {
  return function(footprint, center) {
    var radius = VMath.length_v3(center.pos)
    var total = Math.floor((4 * radius * radius) / (footprint[0] * footprint[1]))
    var sphereGenerator = sphere(center, total)
    //console.log(footprint, center, radius, total)

    var iteration = 0

    return {
      next: function() {
        var v = sphereGenerator(iteration)
        //console.log(iteration, v.pos)
        iteration = iteration + 1
        return {value: v, done: iteration > total}
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
