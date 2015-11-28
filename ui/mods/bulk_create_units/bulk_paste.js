define([
  'bulk_create_units/unit_size',
  'bulk_create_units/distribute_grid',
], function(
  unit_size,
  distribute_grid
) {
  var pasteUnits3D = function(view, n, spec_id, army_id, center) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!spec_id || spec_id == '') return

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

    distribute_grid.distributeUnitLocations(view, n, spec_id, center)
      .then(configure)
      .then(createUnits3D)
  }

  var createUnits3D = function(drops) {
    if (!model.cheatAllowCreateUnit()) return

    drops.forEach(function(drop) {
      model.send_message('create_unit', drop)
    })
  }

  return {
    pasteUnits3D: pasteUnits3D,
  }
})
