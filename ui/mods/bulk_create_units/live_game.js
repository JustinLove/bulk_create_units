define([
  'bulk_create_units/mouse_tracking',
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
  'bulk_create_units/bulk_paste',
  'bulk_create_units/preview',
  'bulk_create_units/parade',
], function(
  mouse,
  unit_size,
  wrap_grid,
  bulk_paste,
  preview,
  parade
) {
  mouse.setTracking(model.cheatAllowCreateUnit())
  model.cheatAllowCreateUnit.subscribe(mouse.setTracking)

  var armyIndex = ko.computed(function() {
    return model.playerControlFlags().indexOf(true)
  })

  var previewUnits = function(n) {
    if (n < 1) return

    mouse.raycast().then(function(location) {
      preview.previewUnits3D(mouse.hdeck.view, n, selectedUnit(), location)
    })
  }

  var paradeUnits = function() {
    if (!model.cheatAllowCreateUnit()) return
    if (armyIndex() == -1) return

    var army = model.players()[armyIndex()].id

    mouse.raycast().then(function(location) {
      //console.log('parade loc', location)
      parade.paradeUnits3D(mouse.hdeck.view, army, location)
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
    return bulk_paste.pasteUnits3D(mouse.hdeck.view, n, config.what, config.army, center)
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
