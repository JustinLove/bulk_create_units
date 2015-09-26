define([
  'bulk_create_units/mouse_tracking',
  'bulk_create_units/unit_size',
  'bulk_create_units/qmath',
], function(
  mouse,
  unit_size,
  VMath
) {
  mouse.setTracking(model.cheatAllowCreateUnit())
  model.cheatAllowCreateUnit.subscribe(mouse.setTracking)

  armyIndex = ko.computed(function() {
    return model.playerControlFlags().indexOf(true)
  })

  // keep puppetmaster's special effects if it's present
  model.pasteUnits = model.pasteUnits || function(n) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (armyIndex() == -1) return

    var drop = {
      army: model.players()[armyIndex()].id,
      what: selectedUnit(),
    }

    mouse.raycast().then(function(result) {
      //console.log(result)
      pasteUnits3D(n, drop, result)
    })
  }

  // http://stackoverflow.com/a/31864777/30203
  var spiral = function(n) {
    var x = 0;
    var y = 0;
    var grid = new Array(n)
    for (var i = 0;i < n;i++) {
      grid[i] = [x, y]
      if(Math.abs(x) <= Math.abs(y) && (x != y || x >= 0)) {
        x += ((y >= 0) ? 1 : -1);
      } else {
        y += ((x >= 0) ? -1 : 1);
      }
    }
    return grid
  }

  var epsilon = 1e-300

  var pasteUnits3D = function(n, config, center) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!config.what || config.what == '') return

    var size = unit_size.updateFootprint(config.what)

    var r = VMath.length_v3(center.pos)

    var gx = VMath.apply_q([1, 0, 0, 0], center.orient)
    var gy = VMath.apply_q([0, 1, 0, 0], center.orient)
    var gz = VMath.apply_q([0, 0, 1, 0], center.orient)

    //console.log(gx, gy, gz)
    //console.log(center.pos)

    var locations = spiral(n).map(function(g) {
      //console.log([].concat(g), size.footprint)
      VMath._mul_v2(g, size.footprint)
      //console.log(g)
      return g
    }).map(function(v) {
      //console.log(v)
      var l = VMath.length_v2(v)
      //console.log(l)
      var unit = [1, 0]
      VMath.mul_v2_s(v, 1 / (l + epsilon), unit)
      //console.log(v, l, unit)
      var a = l/r - Math.PI/2
      var c = Math.cos(a)
      var s = -(1+Math.sin(a))
      //console.log(l, r, a, c, s)
      var x3 = r*c*unit[0]
      var y3 = r*c*unit[1]
      var z3 = r*s

      //console.log(center)
      var pos = center.pos
      //console.log(v, [x3, y3, z3], pos)
      var loc = {
        pos: [
          pos[0] + gx[0]*x3 + gy[0]*y3 + gz[0]*z3,
          pos[1] + gx[1]*x3 + gy[1]*y3 + gz[1]*z3,
          pos[2] + gx[2]*x3 + gy[2]*y3 + gz[2]*z3,
        ],
        orient: center.orient,
      }
      //console.log(loc.pos)
      return loc
    })
    //console.log(locations)

    mouse.hdeck.view.fixupBuildLocations(config.what, center.planet, locations).then(function(fixup) {
      //console.log(fixup)

      config.planet = center.planet

      fixup.forEach(function(loc) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)

        if (size && size.feature_requirements && !loc.ok) {
          console.log(loc.desc)
          return
        }
        config.location = loc.pos || center.pos
        config.orientation = loc.orient || center.orient
        model.send_message('create_unit', config)
      })
    })
  }

  model.bulkPasteCount = ko.observable(10)
  model.bulkPaste = function() {
    model.pasteUnits(model.bulkPasteCount())
  }

  handlers.bulk_paste_count = model.bulkPasteCount

  var lastHover = ''
  var selectedUnit = ko.observable(lastHover)

  selectedUnit.subscribe(function(spec) {
    api.Panel.message('sandbox', 'bulkCreateUnitSpec', spec)
    unit_size.load()
  })

  handlers.bulkCreateUnitSelected = function(spec) {
    selectedUnit(spec)
  }

  var liveGameHover = handlers.hover
  handlers.hover = function(payload) {
    liveGameHover(payload)

    if (payload) {
      lastHover = payload.spec_id || ''
    }
  }

  var engineCall = engine.call
  engine.call = function(method) {
    var promise = engineCall.apply(this, arguments);

    if (method == 'unit.debug.copy') {
      selectedUnit(lastHover)
    } else if (method == 'unit.debug.setSpecId') {
      var spec = arguments[1]
      var unit = model.unitSpecs[spec]
      selectedUnit(spec)
    }

    return promise
  }

  handlers.bulkCreateUnitSandboxExpanded = function(open) {
    if (open) {
      unit_size.load()
    }
  }
})
