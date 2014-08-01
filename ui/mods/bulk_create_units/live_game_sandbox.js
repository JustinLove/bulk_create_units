(function() {
  model.bulkPasteCount = ko.observable(10)
  model.bulkPasteOptions = ko.observable({min: 0.1, max: 3, step: 0.01})
  model.bulkPasteSlider = ko.computed({
    read: function() {
      return Math.log(model.bulkPasteCount())/Math.LN10
    },
    write: function(v) {
      model.bulkPasteCount(Math.round(Math.pow(10, v)))
    },
    owner: model
  })

  model.inputFocus = function() {
    engine.call('panel.noKeyboard', api.Panel.pageId, false);
    engine.call('panel.yieldFocus', api.Panel.pageId, false);
  }
  model.inputBlur = function() {
    engine.call('panel.noKeyboard', api.Panel.pageId, true);
    engine.call('panel.yieldFocus', api.Panel.pageId, true);
  }

  var controls = 'coui://ui/mods/bulk_create_units/bulk_paste_count.html'
  var addControls = function() {
    $.get(controls, function(html) {
      $html = $(html)
      $('.div_sandbox_simcontrol_cont').append($html)
      ko.applyBindings(model, $html.get(0))
    })
  }

  model.sandbox_expanded.subscribe(function(open) {
    if (!open) return
    addControls()
  })

  model.bulkPasteCount.subscribe(function(count) {
    api.Panel.message(api.Panel.parentId, 'bulk_paste_count', count)
  })
})()
