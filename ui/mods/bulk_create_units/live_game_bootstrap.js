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
  model.pasteUnits3D = bcu.pasteUnits3D
  model.bulkPasteCount = ko.observable(10)
  model.bulkPaste = function() {
    model.pasteUnits(model.bulkPasteCount())
    showPreview(false)
  }
  model.bulkPastePreviewToggle = function() {
    showPreview(!showPreview())
  }
  model.bulkPastNextFormation = function() {
    bcu.nextFormation()
    showPreview(true)
  }

  var showPreview = ko.observable(false)
  showPreview.subscribe(function(show) {
    if (!show) bcu.clearPreviews()
  })
  var ghost = function() {
    if (showPreview()) {
      bcu.previewUnits(model.bulkPasteCount(), bcu.selectedUnit()).then(function() {
        if (!showPreview()) {
          bcu.clearPreviews()
        }
        setTimeout(ghost, 100)
      }, function() {console.log('ghost fail', arguments)})
    } else {
      setTimeout(ghost, 100)
    }
  }
  ghost()

  model.bulkPasteCount.subscribe(function(count) {
    showPreview(true)
  })
  bcu.selectedUnit.subscribe(function(spec) {
    showPreview(spec != '')
  })

  handlers.bulk_paste_count = model.bulkPasteCount
  handlers.bulkCreateUnitSelected = bcu.selectedUnit
  handlers.bulkCreateUnitSandboxExpanded = bcu.sandboxExpanded

  var lastHover = ko.observable('')
  var liveGameHover = handlers.hover
  handlers.hover = function(payload) {
    liveGameHover(payload)

    if (payload) {
      lastHover(payload.spec_id || '')
    }
  }

  var engineCall = engine.call
  engine.call = function(method) {
    var promise = engineCall.apply(this, arguments);

    if (method == 'unit.debug.copy') {
      bcu.selectedUnit(lastHover())
    } else if (method == 'unit.debug.paste') {
      showPreview(false)
    } else if (method == 'unit.debug.setSpecId') {
      bcu.selectedUnit(arguments[1])
    }

    return promise
  }
})
