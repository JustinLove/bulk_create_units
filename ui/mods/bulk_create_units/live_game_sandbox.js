(function() {
  model.bulkPasteCount = ko.observable(10)
  model.bulkPasteOptions = ko.observable({min: 0.1, max: 3, step: 0.01})
  model.bulkPasteSlider = ko.computed({
    read: function() {
      return Math.log(parseInt(model.bulkPasteCount(), 10))/Math.LN10
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
      $('#sandbox-controls').append($html)
      ko.applyBindings(model, $html.get(0))
    })
  }

  model.sandbox_expanded.subscribe(function(open) {
    if (!open){ $('#bulk-paste-container').remove(); return}
    addControls()
    api.Panel.message(api.Panel.parentId, 'bulkCreateUnitSandboxExpanded', open)
  })

  model.bulkPasteCount.subscribe(function(count) {
    api.Panel.message(api.Panel.parentId, 'bulk_paste_count', parseInt(count, 10))
  })

  var live_game_sandbox_sandbox_copy_unit = model.sandbox_copy_unit
  model.sandbox_copy_unit = function() {
    live_game_sandbox_sandbox_copy_unit()
    api.Panel.message(api.Panel.parentId, 'bulkCreateUnitSelected', model.sandbox_unit_hover()); 
  }

  handlers.bulkCreateUnitSpec = function(spec) {
    $('.div_sandbox_unit_item').removeClass('selected')
    $('.div_sandbox_unit_item[data-spec="' + spec + '"]').addClass('selected')
  }

  handlers.bulkCreateUnitLayout = function() {
    if (model.sandboxGrid) {
      return model.sandboxGrid()
    } else {
      var scale = api.settings.getSynchronous('ui', 'ui_scale') || 1.0;
      var columns = (scale < 1.0) ? 8 : 9
      // note: units is not built unless the box is open
      return {columns: columns, cells: model.sandbox_units()}
    }
  }

  var $item = $('.div_sandbox_unit_item')
  $item.attr('data-bind', $item.attr('data-bind') + ', attr: {\'data-spec\': spec}')
})()
