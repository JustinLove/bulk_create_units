define([
], function(
) {
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
    uniform: fixupUniform,
  }
})
