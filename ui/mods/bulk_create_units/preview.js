define([
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
], function(
  unit_size,
  wrap_grid
) {
  var previews = []

  var previewUnits3D = function(view, n, spec_id, center) {
    if (n < 1) return
    if (!spec_id || spec_id == '') return

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

    distributeUnitLocations(view, n, spec_id, center).then(puppetUnits3D)
  }

  var distributeUnitLocations = function(view, n, spec_id, center) {
    var size = unit_size.updateFootprint(spec_id)
    var locations = wrap_grid(n, size.footprint, center)

    var validate = function(fixups) {
      if (!size.model_filename) {
        return[]
      }
      return fixups
    }

    var configure = function(fixups) {
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        if (loc.pos[0] == 0 && loc.pos[1] == 0 && loc.pos[2] == 0) {
          loc.pos = locations[i].pos
          loc.orient = locations[i].orient
        }
        loc.planet = center.planet
        loc.orient_rel = false // fixup appears to give absolute orients
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
          location: loc || locations[i],
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

    return view
      .fixupBuildLocations(spec_id, center.planet, locations)
      .then(validate)
      .then(configure)
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
    distributeUnitLocations: distributeUnitLocations,
    clearPreviews: clearPreviews,
  }
})
