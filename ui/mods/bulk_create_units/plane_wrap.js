define(['bulk_create_units/qmath'], function(VMath) {
  var epsilon = 1e-300

  return function(center) {
    var r = VMath.length_v3(center.pos)

    var gx = VMath.apply_q([1, 0, 0, 0], center.orient)
    var gy = VMath.apply_q([0, 1, 0, 0], center.orient)
    var gz = VMath.apply_q([0, 0, 1, 0], center.orient)

    return function(v) {
      //console.log(v)
      var l = VMath.length_v2(v)
      //console.log(l)
      var unit = [1, 0]
      VMath.mul_v2_s(v, 1 / (l + epsilon), unit)
      //console.log(v, l, unit)
      var a = l/r - Math.PI/2
      var c = Math.cos(a)
      var s = -(1+Math.sin(a))
      //console.log(l, r, a, c, s)
      var x3 = r*c*unit[0]
      var y3 = r*c*unit[1]
      var z3 = r*s

      //console.log(center)
      var pos = center.pos
      //console.log(v, [x3, y3, z3], pos)
      var loc = {
        planet: center.planet,
        pos: [
          pos[0] + gx[0]*x3 + gy[0]*y3 + gz[0]*z3,
          pos[1] + gx[1]*x3 + gy[1]*y3 + gz[1]*z3,
          pos[2] + gx[2]*x3 + gy[2]*y3 + gz[2]*z3,
        ],
        orient: center.orient,
      }
      //console.log(loc.pos)
      return loc
    }
  }
})
