define([
  'bulk_create_units/mouse_tracking',
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
  'bulk_create_units/preview',
], function(
  mouse,
  unit_size,
  wrap_grid,
  preview
) {
  mouse.setTracking(model.cheatAllowCreateUnit())
  model.cheatAllowCreateUnit.subscribe(mouse.setTracking)

  var armyIndex = ko.computed(function() {
    return model.playerControlFlags().indexOf(true)
  })

  var previewUnits = function(n) {
    if (n < 1) return

    mouse.raycast().then(function(result) {
      preview.previewUnits3D(mouse.hdeck.view, n, selectedUnit(), result)
    })
  }

  var pasteUnits = function(n) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (armyIndex() == -1) return

    var drop = {
      army: model.players()[armyIndex()].id,
      what: selectedUnit(),
    }

    mouse.raycast().then(function(result) {
      //console.log(result)
      pasteUnits3D(n, drop, result)
    })
  }
  pasteUnits.raycast = true

  var pasteUnits3D = function(n, config, center) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!config.what || config.what == '') return

    distributeUnitLocations(n, config, center).then(createUnits3D)
  }

  var createUnits3D = function(drops) {
    if (!model.cheatAllowCreateUnit()) return

    drops.forEach(function(drop) {
      model.send_message('create_unit', drop)
    })
  }

  var distributeUnitLocations = function(n, config, center) {
    var size = unit_size.updateFootprint(config.what)
    var locations = wrap_grid(size.footprint, center).take(n)

    var validate = function(fixups) {
      //console.log(fixups)

      return validLocations(size, fixups)
    }

    var configure = function(fixups) {
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        if (loc.pos[0] == 0 && loc.pos[1] == 0 && loc.pos[2] == 0) {
          loc.pos = locations[i].pos
        }
        return {
          army: config.army,
          what: config.what,
          planet: center.planet,
          location: loc.pos || locations[i].pos,
          orientation: loc.orient || locations[i].orient,
        }
      })
    }

    return mouse.hdeck.view
      .fixupBuildLocations(config.what, center.planet, locations)
      .then(validate)
      .then(configure)
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

  var lastHover = ko.observable('')
  var selectedUnit = ko.observable(lastHover())

  selectedUnit.subscribe(function(spec) {
    if (spec == '') {
      preview.clearPreviews(mouse.hdeck.view)
    }
    api.Panel.message('sandbox', 'bulkCreateUnitSpec', spec)
    unit_size.load()
  })

  var engineCall = engine.call
  engine.call = function(method) {
    var promise = engineCall.apply(this, arguments);

    if (method == 'unit.debug.copy') {
      selectedUnit(lastHover())
    } else if (method == 'unit.debug.setSpecId') {
      selectedUnit(arguments[1])
    }

    return promise
  }

  var sandboxExpanded = function(open) {
    if (open) {
      unit_size.load()
    }
  }

  return {
    previewUnits: previewUnits,
    pasteUnits: pasteUnits,
    pasteUnits3D: pasteUnits3D,
    distributeUnitLocations: distributeUnitLocations,
    selectedUnit: selectedUnit,
    sandboxExpanded: sandboxExpanded,
    lastHover: lastHover,
  }
})
