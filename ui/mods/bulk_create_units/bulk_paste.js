define([
], function(
) {
  var pasteUnitLocations = function(locations, army_id) {
    var configure = function(fixups) {
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        return {
          army: army_id,
          what: loc.spec_id,
          planet: loc.planet,
          location: loc.pos,
          orientation: loc.orient,
        }
      })
    }

    createUnits3D(configure(locations))
  }

  var createUnits3D = function(drops) {
    if (!model.cheatAllowCreateUnit()) return

    drops.forEach(function(drop) {
      model.send_message('create_unit', drop)
    })
  }

  return {
    pasteUnitLocations: pasteUnitLocations,
  }
})
