define([
], function(
) {
  return function(view, center) {
    var locations

    var getLayout = function() {
      return api.panels.sandbox.query('bulkCreateUnitLayout')
    }

    var distribute = function(layout) {
      locations = layout.cells
      var c = 0
      var x = - layout.columns / 2
      var y = (locations.length / layout.columns) / 2
      locations.forEach(function(item) {
        item.pos = [x, y]
        //console.log(loc.pos)
        x += 1
        c += 1
        if (c >= layout.columns) {
          c = 0
          x = - layout.columns / 2
          y -= 1
        }
      })
      locations = locations.filter(function(item) {return item.spec != ''})
      return locations
    }

    return getLayout().then(distribute)
  }
})
