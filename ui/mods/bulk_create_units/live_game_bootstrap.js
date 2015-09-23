;(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.bulk_create_units = 'coui://ui/mods/bulk_create_units'
})()

// make the object keys exist for Panel.ready
var bulk_paste_stub = function() {}
_.defaults(handlers, {
  bulk_paste_count: bulk_paste_stub,
  bulkCreateUnitSelected: bulk_paste_stub,
  bulkCreateUnitSandboxExpanded: bulk_paste_stub,
})

api.Panel.message('', 'inputmap.reload');

require(['bulk_create_units/live_game'])
