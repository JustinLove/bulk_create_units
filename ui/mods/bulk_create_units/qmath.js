define(['vecmath'], function(VMath) {
  VMath.cross_v3 = function(a, b) {
    var a1 = a[0]
    var a2 = a[1]
    var a3 = a[2]
    var b1 = b[0]
    var b2 = b[1]
    var b3 = b[2]
    return [
      a2*b3 - a3*b2,
      a3*b1 - a1*b3,
      a1*b2 - a2*b1,
    ]
  }

  VMath.mul_q = function(a, b) {
    var as = a[3]
    var bs = b[3]
    var so = as*bs - VMath.dot_v3(a, b)
    var sab = []
    VMath.mul_s_v3(as, b, sab)
    var sba = []
    VMath.mul_s_v3(bs, a, sba)

    var vc = VMath.cross_v3(a, b)

    var vo1 = []
    VMath.add_v3(sab, sba, vo1)
    var vo2 = []
    VMath.add_v3(vo1, vc, vo2)
    vo2[3] = so
    return vo2
  }

  VMath.apply_q = function(p, q) {
    var inter = VMath.mul_q(q, p)
    var vo = VMath.mul_q(inter, VMath.inv_q(q))
    //console.log(p, inter, vo)
    return vo
  }

  VMath.inv_q = function(q) {
    return [
      -q[0],
      -q[1],
      -q[2],
      q[3],
    ]
  }

  return VMath
})
