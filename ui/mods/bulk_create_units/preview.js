define([
  'bulk_create_units/unit_size',
  'bulk_create_units/distribute_grid',
], function(
  unit_size,
  distribute_grid
) {
  var previews = []

  var previewUnits3D = function(view, n, spec_id, center) {
    if (n < 1) return
    if (!spec_id || spec_id == '') return
    var size = unit_size.updateFootprint(spec_id)
    if (!size.model_filename) return

    var configure = function(fixups) {
      var size = unit_size.updateFootprint(spec_id)
      if (!size.model_filename) return []
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        var color
        if (!loc.ok) {
          color = [0.8, 0, 0, 0]
        } else if (loc.desc) {
          color = [0.8, 0.2, 0.2, 0]
        } else {
          color = [0.6, 0.6, 0.6, 0]
        }
        return {
          model: {filename: size.model_filename},
          location: loc,
          material: {
            shader: "pa_unit_ghost",
            constants: {
              GhostColor: color,
              BuildInfo: [0,size.TEMP_texelinfo,0,0],
            },
            textures: {
              Diffuse: "/pa/effects/diffuse_texture.papa"
            }
          },
        }
      })
    }

    var puppetUnits3D = function(puppets) {
      //clearPreviews(view)
      puppets.forEach(function(puppet, i) {
        //console.log(puppet)
        if (previews[i]) {
          puppet.id = previews[i].id
        }
        view.puppet(puppet, true).then(function(r) { previews[i] = r })
      })
      previews.splice(puppets.length).forEach(function(puppet) {
        removePuppet(view, puppet)
      })
    }

    distribute_grid.distributeUnitLocations(view, n, spec_id, center)
      .then(configure)
      .then(puppetUnits3D)
  }

  var clearPreviews = function(view) {
    view.getAllPuppets(true).then(function(puppets) {
      puppets.forEach(function(puppet) {
        if (true) {
          removePuppet(view, puppet)
        }
      })
    })
  }

  //api.getWorldView(0).clearPuppets()
  clearPreviews(api.getWorldView(0))

  var removePuppet = function(view, puppet) {
    puppet.fx_offsets = []
    view.puppet(puppet).then(function() {
      view.unPuppet(puppet.id)
    })
  }

  return {
    previewUnits3D: previewUnits3D,
    clearPreviews: clearPreviews,
  }
})
