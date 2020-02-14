define([
  'bulk_create_units/mouse_tracking',
  'bulk_create_units/unit_size',
  'bulk_create_units/formations',
  'bulk_create_units/bulk_paste',
  'bulk_create_units/preview',
], function(
  mouse,
  unit_size,
  formations,
  bulk_paste,
  preview
) {
  mouse.setTracking(model.cheatAllowCreateUnit())
  model.cheatAllowCreateUnit.subscribe(mouse.setTracking)

  var armyIndex = ko.computed(function() {
    return model.playerControlFlags().indexOf(true)
  })

  var previewUnits = function(n, spec_id) {
    var def = $.Deferred()
    if (n < 1) return def.resolve(false)
    if (!spec_id || spec_id == '') return def.resolve(false)

    var player = model.players()[armyIndex()]
    if (!player) return def.resolve(false)

    mouse.raycast().then(function(center) {
      //console.log(center)
      if (!center.pos) return def.resolve(false)
      try {
      inFormation(mouse.hdeck.view, center, n, spec_id)
        .then(function(locations) {
          try {
          preview.previewUnitLocations(mouse.hdeck.view, locations, player && player.primary_color)
          } catch(e) {
            console.log('preview inFormation catch', e)
            def.resolve(false)
            return
          }
          def.resolve(true)
        }, function() {console.log('inFormation', arguments)})
      } catch(e) {
        console.log('preview raycast catch', e)
        def.resolve(false)
      }
    }, function() {console.log('preview raycast fail')})

    return def
  }

  var clearPreviews = function() {
    preview.clearPreviews(mouse.hdeck.view)
  }

  var pasteUnits = function(n) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!selectedUnit() || selectedUnit() == '') return
    if (armyIndex() == -1) return

    var drop = {
      army: model.players()[armyIndex()].id,
      what: selectedUnit(),
    }

    mouse.raycast().then(function(center) {
      //console.log(result, )
      if (!center.pos) return
      pasteUnits3D(n, drop, center)
    }, function() {console.log('paste raycast fail')})
  }
  pasteUnits.raycast = true

  var pasteUnits3D = function(n, config, center) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!config.what || config.what == '') return

    inFormation(mouse.hdeck.view, center, n, config.what)
      .then(function(locations) {
        bulk_paste.pasteUnitLocations(locations, config.army)
      }, function() {console.log('past inFormation fail')})
  }

  var selectedUnit = ko.observable('')

  selectedUnit.subscribe(function(spec) {
    api.Panel.message('sandbox', 'bulkCreateUnitSpec', spec)
    unit_size.load()
  })

  var sandboxExpanded = function(open) {
    if (open) {
      unit_size.load()
    }
  }

  var currentFormation = 0

  var nextFormation = function() {
    currentFormation++
    if (currentFormation >= 3) currentFormation = 0
  }

  var inFormation = function(view, center, n, spec_id) {
    switch (currentFormation) {
      case 0: return formations.grid(view, center, n, spec_id);
      case 1: return formations.area(view, center, n, spec_id);
      case 2: return formations.parade(view, center);
      default: throw "unknown formation " + currentFormation.toString()
    }
  }

  return {
    previewUnits: previewUnits,
    clearPreviews: clearPreviews,
    pasteUnits: pasteUnits,
    pasteUnits3D: pasteUnits3D,
    nextFormation: nextFormation,
    selectedUnit: selectedUnit,
    sandboxExpanded: sandboxExpanded,
  }
})
