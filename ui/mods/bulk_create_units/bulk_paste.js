define([
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
], function(
  unit_size,
  wrap_grid
) {
  var pasteUnits3D = function(view, n, config, center) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!config.what || config.what == '') return

    var configure = function(fixups) {
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        return {
          army: config.army,
          what: config.what,
          planet: loc.planet,
          location: loc.pos,
          orientation: loc.orient,
        }
      })
    }

    distributeUnitLocations(view, n, config, center)
      .then(configure)
      .then(createUnits3D)
  }

  var createUnits3D = function(drops) {
    if (!model.cheatAllowCreateUnit()) return

    drops.forEach(function(drop) {
      model.send_message('create_unit', drop)
    })
  }

  var distributeUnitLocations = function(view, n, config, center) {
    var size = unit_size.updateFootprint(config.what)
    var locations = wrap_grid(size.footprint, center).take(n)

    var validate = function(fixups) {
      //console.log(fixups)

      return validLocations(size, fixups)
    }

    var tweak = function(fixups) {
      fixups.forEach(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        if (loc.pos[0] == 0 && loc.pos[1] == 0 && loc.pos[2] == 0) {
          loc.pos = locations[i].pos
        }
        loc.planet = center.planet
        loc.orient_rel = false // fixup appears to give absolute orients
        loc.orient = loc.orient || locations[i].orient
      })
      return fixups
    }

    return view
      .fixupBuildLocations(config.what, center.planet, locations)
      .then(validate)
      .then(tweak)
  }

  var validLocations = function(size, locations) {
    if (size && size.feature_requirements) {
      return locations.filter(isOk)
    } else {
      return locations
    }
  }

  var isOk = function(loc) {
    if (!loc.ok) {
      console.log(loc.desc)
      return false
    } else {
      return true
    }
  }

  return {
    pasteUnits3D: pasteUnits3D,
    distributeUnitLocations: distributeUnitLocations,
  }
})
