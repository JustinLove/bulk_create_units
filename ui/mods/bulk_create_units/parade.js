define([
  'bulk_create_units/parade_grid',
  'bulk_create_units/plane_wrap',
  'bulk_create_units/distribute_grid',
  'bulk_create_units/bulk_paste',
], function(
  parade_grid,
  projection,
  distribute_grid,
  bulk_paste
) {
  var paradeUnits3D = function(view, army_id, center) {
    if (!model.cheatAllowCreateUnit()) return

    distributeUnitLocations(view, center)
      .then(function(locations) {
        bulk_paste.pasteUnitLocations(locations, army_id)
      })
  }

  var distributeUnitLocations = function(view, center) {
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

    var def = $.Deferred()
    var fixup = function(locations) {
      return distribute_grid.fixupUniform(view,
          '/pa/units/commanders/imperial_invictus/imperial_invictus.json',
          center.planet, locations)
        .then(function(fixups) {def.resolve(fixups)})
    }

    parade_grid()
      .then(stretch)
      .then(fixup)

    return def
  }

  return {
    paradeUnits3D: paradeUnits3D,
  }
})
