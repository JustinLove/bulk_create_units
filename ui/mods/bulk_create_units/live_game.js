define([
  'bulk_create_units/mouse_tracking',
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
], function(
  mouse,
  unit_size,
  wrap_grid
) {
  mouse.setTracking(model.cheatAllowCreateUnit())
  model.cheatAllowCreateUnit.subscribe(mouse.setTracking)

  armyIndex = ko.computed(function() {
    return model.playerControlFlags().indexOf(true)
  })

  // keep puppetmaster's special effects if it's present
  model.pasteUnits = model.pasteUnits || function(n) {
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
    var locations = wrap_grid(n, size.footprint, center)

    var validate = function(fixups) {
      //console.log(fixups)

      return validLocations(size, fixups)
    }

    var configure = function(fixups) {
      return fixups.map(function(loc) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        return {
          army: config.army,
          what: config.what,
          planet: center.planet,
          location: loc.pos || center.pos,
          orientation: loc.orient || center.orient,
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

  model.bulkPasteCount = ko.observable(10)
  model.bulkPaste = function() {
    model.pasteUnits(model.bulkPasteCount())
  }

  handlers.bulk_paste_count = model.bulkPasteCount

  var lastHover = ''
  var selectedUnit = ko.observable(lastHover)

  selectedUnit.subscribe(function(spec) {
    api.Panel.message('sandbox', 'bulkCreateUnitSpec', spec)
    unit_size.load()
  })

  handlers.bulkCreateUnitSelected = function(spec) {
    selectedUnit(spec)
  }

  var liveGameHover = handlers.hover
  handlers.hover = function(payload) {
    liveGameHover(payload)

    if (payload) {
      lastHover = payload.spec_id || ''
    }
  }

  var engineCall = engine.call
  engine.call = function(method) {
    var promise = engineCall.apply(this, arguments);

    if (method == 'unit.debug.copy') {
      selectedUnit(lastHover)
    } else if (method == 'unit.debug.setSpecId') {
      var spec = arguments[1]
      var unit = model.unitSpecs[spec]
      selectedUnit(spec)
    }

    return promise
  }

  handlers.bulkCreateUnitSandboxExpanded = function(open) {
    if (open) {
      unit_size.load()
    }
  }
})
