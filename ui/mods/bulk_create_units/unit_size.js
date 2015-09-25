define([], function() {
  return {
    baseSize: 10,
    unitAdj: 1,
    sepAdj: 2,
    data: ko.observable({}),
    loaded: false,
    load: function() {
      if (this.loaded) return
      this.loaded = true
      unitInfoParser.loadUnitData(
      this.data,
      function(spec) {
        return {
          display_name: spec.display_name,
          area_build_separation: spec.area_build_separation,
          area_build_type: spec.area_build_type,
          mesh_bounds: spec.mesh_bounds,
          placement_size: spec.placement_size,
          physics: spec.physics,
          feature_requirements: spec.feature_requirements,
        }
      }, function(a, b) {
        var result = {
          display_name: a.display_name || b.display_name,
          area_build_separation: a.area_build_separation || b.area_build_separation,
          area_build_type: a.area_build_type || b.area_build_type,
          mesh_bounds: a.mesh_bounds || b.mesh_bounds,
          placement_size: a.placement_size || b.placement_size,
          physics: _.extend({}, a.physics, b.physics),
          feature_requirements: a.feature_requirements || b.feature_requirements,
        }
        //console.log('combine', a.display_name, b.display_name, a, b, result)
        return result
      })
    },
    updateFootprint: function(spec_id) {
      var size = this.data()[spec_id]
      //console.log(size)

      var dx = this.baseSize
      var dy = this.baseSize

      if (!size) return {footprint: [dx, dy]}

      //console.log(dx, dy)

      if (size.placement_size) {
        dx += size.placement_size[0] * this.unitAdj
        dy += size.placement_size[1] * this.unitAdj
      } else if (size.mesh_bounds) {
        dx += size.mesh_bounds[0] * this.unitAdj
        dy += size.mesh_bounds[1] * this.unitAdj
      }

      //console.log(dx, dy)

      if (size.area_build_separation) {
        dx += size.area_build_separation * this.sepAdj
        dy += size.area_build_separation * this.sepAdj
      }

      //console.log(dx, dy)

      size.footprint = [dx, dy]

      return size
    }
  }
})
