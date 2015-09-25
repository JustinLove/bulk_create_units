define([], function() {
  var data = ko.observable({})
  var sizeLoaded = false
  var load = function() {
    if (sizeLoaded) return
    sizeLoaded = true
    unitInfoParser.loadUnitData(
    data,
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
  }

  return {
    data: data,
    load: load,
  }
})
