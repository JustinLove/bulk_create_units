define([], function() {
  // Pointer tracking
  var mouseX = 0
  var mouseY = 0
  var hdeck = model.holodeck
  var mousetrack = function(e) {
    mouseX = e.offsetX
    mouseY = e.offsetY
    hdeck = $(this).data('holodeck')
  }

  if (model.cheatAllowCreateUnit()) {
    $('body').on('mousemove', 'holodeck', mousetrack)
  }

  model.cheatAllowCreateUnit.subscribe(function(value) {
    if (value) {
      $('body').on('mousemove', 'holodeck', mousetrack)
    } else {
      $('body').off('mousemove', 'holodeck', mousetrack)
    }
  })

  armyIndex = ko.computed(function() {
    return model.playerControlFlags().indexOf(true)
  })

  // keep puppetmaster's special effects if it's present
  model.pasteUnits = model.pasteUnits || function(n) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (armyIndex() == -1) return
    var army_id = model.players()[armyIndex()].id

    var scale = api.settings.getSynchronous('ui', 'ui_scale') || 1.0;

    var x = Math.floor(mouseX * scale);
    var y = Math.floor(mouseY * scale);

    hdeck.raycast(x, y).then(function(result) {
      //console.log(result)
      var drop = {
        army: army_id,
        what: selectedUnit(),
        planet: result.planet,
        location: result.pos,
        orientation: result.orient,
      }
      pasteUnits3D(n, drop)
    })
  }

  var pasteUnits3D = function(n, config) {
    if (!model.cheatAllowCreateUnit()) return
    if (n < 1) return
    if (!config.what || config.what == '') return

    var locations = [{
      pos: config.location,
      orient: config.orientation,
    }]

    //console.log(locations[0])
    hdeck.view.fixupBuildLocations(config.what, config.planet, locations).then(function(fixup) {
      //console.log(fixup[0])
      config.location = fixup[0].pos || config.location
      config.orientation = fixup[0].orient || config.orientation

      var sizeData = model.sizeData()[config.what]
      if (sizeData && sizeData.feature_requirements && !fixup[0].ok) {
        console.log(fixup[0].desc)
        return
      }

      for (var i = 0;i < n;i++) {
        model.send_message('create_unit', config)
      }
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
    loadSize()
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

  model.sizeData = ko.observable({})
  var sizeLoaded = false
  var loadSize = function() {
    if (sizeLoaded) return
    sizeLoaded = true
    unitInfoParser.loadUnitData(
    model.sizeData,
    function(spec) {
      return {
        display_name: spec.display_name,
        area_build_separation: spec.area_build_separation,
        area_build_type: spec.area_build_type,
        mesh_bounds: spec.mesh_bounds,
        placement_size: spec.placement_size,
        physics: spec.physics,
        feature_requirements: spec.feature_requirements,
      }
    }, function(a, b) {
      var result = {
        display_name: a.display_name || b.display_name,
        area_build_separation: a.area_build_separation || b.area_build_separation,
        area_build_type: a.area_build_type || b.area_build_type,
        mesh_bounds: a.mesh_bounds || b.mesh_bounds,
        placement_size: a.placement_size || b.placement_size,
        physics: _.extend({}, a.physics, b.physics),
        feature_requirements: a.feature_requirements || b.feature_requirements,
      }
      //console.log('combine', a.display_name, b.display_name, a, b, result)
      return result
    })
  }

  handlers.bulkCreateUnitSandboxExpanded = function(open) {
    if (open) {
      loadSize()
    }
  }
})
