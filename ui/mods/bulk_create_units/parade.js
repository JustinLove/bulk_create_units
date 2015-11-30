define([
  'bulk_create_units/parade_grid',
  'bulk_create_units/plane_wrap',
], function(
  parade_grid,
  projection
) {
  var paradeFormation = function(center) {
    var stretch = function(locations) {
      var wrap = projection(center)
      locations.forEach(function(item) {
        var loc = wrap([item.pos[0]*50, item.pos[1]*50])
        item.pos = loc.pos
        item.orient = loc.orient
        item.planet = loc.planet
      })
      return locations
    }

    return parade_grid().then(stretch)
  }

  return {
    formation: paradeFormation,
  }
})
