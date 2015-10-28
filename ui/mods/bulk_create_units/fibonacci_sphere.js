define(['bulk_create_units/qmath'], function(VMath) {
  // based on http://stackoverflow.com/a/26127012/30203

  var increment = Math.PI * (3 - Math.sqrt(5))

  return function(center, n) {
    var radius = VMath.length_v3(center.pos)
    var offset = 2/n

    var gx = VMath.apply_q([radius, 0, 0, 0], center.orient)
    var gy = VMath.apply_q([0, radius, 0, 0], center.orient)
    var gz = VMath.apply_q([0, 0, radius, 0], center.orient)

    return function(i) {
      i = i % n
      var z = -((i * offset) - 1)
      var r = Math.sqrt(1 - Math.pow(z, 2))
      var phi = i * increment
      var x = Math.cos(phi) * r
      var y = Math.sin(phi) * r
      //console.log(z, r, phi, x, y)
      z = z - 1

      //console.log(center)
      var pos = center.pos
      //console.log(v, [x, y, z], pos)
      var loc = {
        planet: center.planet,
        pos: [
          pos[0] + gx[0]*x + gy[0]*y + gz[0]*z,
          pos[1] + gx[1]*x + gy[1]*y + gz[1]*z,
          pos[2] + gx[2]*x + gy[2]*y + gz[2]*z,
        ],
        orient: center.orient,
      }
      //console.log(loc.pos)
      return loc
    }
  }
})
