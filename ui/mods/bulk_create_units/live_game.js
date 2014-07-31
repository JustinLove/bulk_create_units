(function() {
  // keep puppetmaster's special effects if it's present
  model.pasteUnits = model.pasteUnits || function(n) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return

    for (var i = 0;i < n;i++) {
      engine.call("unit.debug.paste")
    }
  }

  model.bulkPasteCount = ko.observable(10)
  model.bulkPaste = function() {
    model.pasteUnits(model.bulkPasteCount())
  }

  api.Panel.message('', 'inputmap.reload');
})()
