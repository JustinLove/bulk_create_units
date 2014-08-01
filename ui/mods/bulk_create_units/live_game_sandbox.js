(function() {
  model.bulkPasteCount = ko.observable(10)
  model.bulkPasteOptions = ko.observable({min: 0.1, max: 3, step: 0.01})
  model.bulkPasteSlider = ko.observable(1)
  model.bulkPasteSlider.subscribe(function(n) {
    model.bulkPasteCount(Math.round(Math.pow(10, n)))
  })

  var controls = 'coui://ui/mods/bulk_create_units/bulk_paste_count.html'
  var addControls = function() {
    $.get(controls, function(html) {
      $html = $(html)
      $('.div_sandbox_simcontrol_cont').append($html)
      ko.applyBindings(model, $html.get(0))
    })
  }

  var sub = model.sandbox_expanded.subscribe(function(open) {
    if (!open) return
    addControls()
    sub.dispose()
  })

  model.bulkPasteCount.subscribe(function(count) {
    api.Panel.message(api.Panel.parentId, 'bulk_paste_count', count)
  })
})()
