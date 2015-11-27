;(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.bulk_create_units = 'coui://ui/mods/bulk_create_units'
  config.paths.vecmath = 'coui://ui/main/game/galactic_war/shared/js/vecmath'
})()

// make the object keys exist for Panel.ready
var bulk_paste_stub = function() {}
_.defaults(handlers, {
  bulk_paste_count: bulk_paste_stub,
  bulkCreateUnitSelected: bulk_paste_stub,
  bulkCreateUnitSandboxExpanded: bulk_paste_stub,
})

api.Panel.message('', 'inputmap.reload');

require(['bulk_create_units/live_game'], function(bcu) {

  // This is extremely delecate.
  // We want to overwrite Sandbox Unit Menu basic version,
  //   but not Puppetmaster's drop pod effect
  if (!model.pasteUnits || !model.pasteUnits.raycast) {
    model.pasteUnits = bcu.pasteUnits
  }
  model.paradeUnits = bcu.paradeUnits
  model.pasteUnits3D = bcu.pasteUnits3D
  model.bulkPasteCount = ko.observable(10)
  model.bulkPaste = function() {
    model.pasteUnits(model.bulkPasteCount())
  }
  model.clearPasteUnit = function() {
    bcu.selectedUnit('')
  }
  var ghost = function() {
    bcu.previewUnits(model.bulkPasteCount())
    setTimeout(ghost, 100)
  }
  ghost()

  handlers.bulk_paste_count = model.bulkPasteCount
  handlers.bulkCreateUnitSelected = bcu.selectedUnit
  handlers.bulkCreateUnitSandboxExpanded = bcu.sandboxExpanded

  var liveGameHover = handlers.hover
  handlers.hover = function(payload) {
    liveGameHover(payload)

    if (payload) {
      bcu.lastHover(payload.spec_id || '')
    }
  }
})
