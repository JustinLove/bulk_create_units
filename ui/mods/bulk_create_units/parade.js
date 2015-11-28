define([
  'bulk_create_units/parade_grid',
  'bulk_create_units/plane_wrap',
  'bulk_create_units/distribute_grid',
], function(
  parade_grid,
  projection,
  distribute_grid
) {
  var paradeUnits3D = function(view, armyId, center) {
    if (!model.cheatAllowCreateUnit()) return

    var configure = function(fixups) {
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        return {
          army: armyId,
          what: loc.spec_id,
          planet: loc.planet,
          location: loc.pos,
          orientation: loc.orient,
        }
      })
    }

    distributeUnitLocations(view, center)
      .then(configure)
      .then(createUnits3D)
  }

  var createUnits3D = function(drops) {
    if (!model.cheatAllowCreateUnit()) return

    drops.forEach(function(drop) {
      model.send_message('create_unit', drop)
    })
  }

  var distributeUnitLocations = function(view, center) {
    var locations

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

    return def.promise()
  }

  return {
    paradeUnits3D: paradeUnits3D,
  }
})
