define([
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
], function(
  unit_size,
  wrap_grid
) {
  var distributeUnitLocations = function(view, n, spec_id, center) {
    var size = unit_size.updateFootprint(spec_id)
    var locations = wrap_grid(size.footprint, center).take(n*2)

    var validate = function(fixups) {
      var valid = 0
      for (i = 0;i < fixups.length;i++) {
        if (fixups[i].ok) {
          valid = valid + 1
        }
        if (valid >= n) {
          return fixups.slice(0, i+1)
        }
      }
      return fixups.slice(0, n)
    }

    return fixupUniform(view, spec_id, center.planet, locations)
      .then(validate)
  }

  var fixupUniform = function(view, spec_id, planet, locations) {
    var tweak = function(fixups) {
      locations.forEach(function(loc, i) {
        var fix = fixups[i]
        loc.ok = fix.ok
        loc.desc = fix.desc
        if (!loc.spec_id) loc.spec_id = spec_id
        loc.planet = planet
        if (fix.pos[0] != 0 || fix.pos[1] != 0 || fix.pos[2] != 0) {
          loc.pos = fix.pos
        }
        if (fix.orient) loc.orient = fix.orient
        loc.orient_rel = false // fixup appears to give absolute orients
      })
      return locations
    }

    return view.fixupBuildLocations(spec_id, planet, locations).then(tweak)
  }

  return {
    distributeUnitLocations: distributeUnitLocations,
    fixupUniform: fixupUniform,
  }
})
