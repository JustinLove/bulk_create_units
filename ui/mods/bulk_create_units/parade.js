define([
  'bulk_create_units/plane_wrap',
], function(
  projection
) {
  var paradeUnits3D = function(view, armyId, center) {
    if (!model.cheatAllowCreateUnit()) return

    var configure = function(fixups) {
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        return {
          army: armyId,
          what: loc.spec,
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
    var wrap = projection(center)
    var locations

    var getLayout = function() {
      return api.panels.sandbox.query('bulkCreateUnitLayout')
    }

    var distribute = function(layout) {
      locations = layout.cells
      var c = 0
      var x = - layout.columns / 2
      var y = (locations.length / layout.columns) / 2
      locations.forEach(function(item) {
        var loc = wrap([x*50, y*50])
        item.pos = loc.pos
        //console.log([x, y], loc.pos)
        item.orient = loc.orient
        item.planet = loc.planet
        x += 1
        c += 1
        if (c >= layout.columns) {
          c = 0
          x = - layout.columns / 2
          y -= 1
        }
      })
      locations = locations.filter(function(item) {return item.spec != ''})
      return locations
    }

    var fixup = function(locations) {
      return view.fixupBuildLocations(
        '/pa/units/commanders/imperial_invictus/imperial_invictus.json',
        center.planet, locations)
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
        loc.spec = locations[i].spec
      })
      return fixups
    }

    var def = $.Deferred()

    getLayout()
      .then(distribute)
      .then(fixup)
      .then(function(prom) {
        prom
          .then(tweak)
          .then(function(fixups) {def.resolve(fixups)})
      })

    return def.promise()
  }

  return {
    paradeUnits3D: paradeUnits3D,
    distributeUnitLocations: distributeUnitLocations,
  }
})
