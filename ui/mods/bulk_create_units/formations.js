define([
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
  'bulk_create_units/area',
  'bulk_create_units/parade',
  'bulk_create_units/fixup',
], function(
  unit_size,
  wrap_grid,
  area,
  parade,
  fixup
) {
  var patternScan = function(pattern) {
    return function(view, n, spec_id, center) {
      if (n < 1) return $.Deferred().resolve([])
      if (!spec_id || spec_id == '') return $.Deferred().resolve([])
      var size = unit_size.updateFootprint(spec_id)
      var locations = pattern(size.footprint, center).take(n*2)
      return fixup.uniform(view, spec_id, center.planet, locations).then(constrict(n))
    }
  }

  var gridFormation = patternScan(wrap_grid)
  var areaFormation = patternScan(area)

  var paradeFormation = function(view, center) {
    var def = $.Deferred()
    parade.formation(center).then(function(locations) {
      return fixup.uniform(view,
          '/pa/units/commanders/imperial_invictus/imperial_invictus.json',
          center.planet, locations)
        .then(function(fixups) {def.resolve(fixups)})
    })
    return def
  }

  var constrict = function(n) {
    return function(fixups) {
      var valid = 0
      for (i = 0;i < fixups.length;i++) {
        if (fixups[i].ok) {
          valid = valid + 1
        }
        if (valid >= n) {
          return fixups.slice(0, i+1)
        }
      }
      return fixups.slice(0, n)
    }
  }

  return {
    grid: gridFormation,
    area: areaFormation,
    parade: paradeFormation,
  }
})
