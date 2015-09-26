define(['bulk_create_units/qmath'], function(VMath) {
  // http://stackoverflow.com/a/31864777/30203
  var spiral = function(n) {
    var x = 0;
    var y = 0;
    var grid = new Array(n)
    for (var i = 0;i < n;i++) {
      grid[i] = [x, y]
      if(Math.abs(x) <= Math.abs(y) && (x != y || x >= 0)) {
        x += ((y >= 0) ? 1 : -1);
      } else {
        y += ((x >= 0) ? -1 : 1);
      }
    }
    return grid
  }

  var epsilon = 1e-300

  var wrapGrid = function(n, footprint, center) {
    var r = VMath.length_v3(center.pos)

    var gx = VMath.apply_q([1, 0, 0, 0], center.orient)
    var gy = VMath.apply_q([0, 1, 0, 0], center.orient)
    var gz = VMath.apply_q([0, 0, 1, 0], center.orient)

    //console.log(gx, gy, gz)
    //console.log(center.pos)

    return spiral(n).map(function(g) {
      //console.log([].concat(g), footprint)
      VMath._mul_v2(g, footprint)
      //console.log(g)
      return g
    }).map(function(v) {
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
        pos: [
          pos[0] + gx[0]*x3 + gy[0]*y3 + gz[0]*z3,
          pos[1] + gx[1]*x3 + gy[1]*y3 + gz[1]*z3,
          pos[2] + gx[2]*x3 + gy[2]*y3 + gz[2]*z3,
        ],
        orient: center.orient,
      }
      //console.log(loc.pos)
      return loc
    })
  }

  return wrapGrid
})
