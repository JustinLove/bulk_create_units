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
      if (!size.model_filename) {
        return[]
      }
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
      .fixupBuildLocations(spec_id, center.planet, locations)
      .then(validate)
      .then(tweak)
  }

  return {
    distributeUnitLocations: distributeUnitLocations,
  }
})
