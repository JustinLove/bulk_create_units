(function() {
  model.bulkPasteCount = ko.observable(10)
  model.bulkPasteOptions = ko.observable({min: 1, max: 100, step: 1})

  var controls = 'coui://ui/mods/bulk_create_units/bulk_paste_count.html'
  var addControls = function() {
    $.get(controls, function(html) {
      console.log(arguments)
      $html = $(html)
      console.log($html)
      console.log($('.div_sandbox_simcontrol_cont'))
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
