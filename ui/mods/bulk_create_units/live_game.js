define([
  'bulk_create_units/mouse_tracking',
  'bulk_create_units/unit_size',

  'bulk_create_units/distribute_grid',
  'bulk_create_units/parade',

  'bulk_create_units/bulk_paste',
  'bulk_create_units/preview',
], function(
  mouse,
  unit_size,

  distribute_grid,
  parade,

  bulk_paste,
  preview
) {
  mouse.setTracking(model.cheatAllowCreateUnit())
  model.cheatAllowCreateUnit.subscribe(mouse.setTracking)

  var armyIndex = ko.computed(function() {
    return model.playerControlFlags().indexOf(true)
  })

  var previewUnits = function(n) {
    if (n < 1) return

    mouse.raycast().then(function(center) {
      //console.log(center)
      distribute_grid.distributeUnitLocations(mouse.hdeck.view, n, selectedUnit(), center)
        .then(function(locations) {
          preview.previewUnitLocations(mouse.hdeck.view, locations)
        })
    })
  }

  var paradeUnits = function() {
    if (!model.cheatAllowCreateUnit()) return
    if (armyIndex() == -1) return

    var army_id = model.players()[armyIndex()].id

    mouse.raycast().then(function(center) {
      //console.log('parade loc', center, army_id)
      parade.formation(mouse.hdeck.view, center)
        .then(function(locations) {
          bulk_paste.pasteUnitLocations(locations, army_id)
        })
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

    mouse.raycast().then(function(location) {
      //console.log(result)
      pasteUnits3D(n, drop, location)
    })
  }
  pasteUnits.raycast = true

  var pasteUnits3D = function(n, config, center) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!config.what || config.what == '') return

    distribute_grid.distributeUnitLocations(mouse.hdeck.view, n, config.what, center)
      .then(function(locations) {
        bulk_paste.pasteUnitLocations(locations, config.army)
      })
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
    paradeUnits: paradeUnits,
    previewUnits: previewUnits,
    pasteUnits: pasteUnits,
    pasteUnits3D: pasteUnits3D,
    selectedUnit: selectedUnit,
    sandboxExpanded: sandboxExpanded,
    lastHover: lastHover,
  }
})
