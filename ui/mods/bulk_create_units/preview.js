define([
  'bulk_create_units/unit_size',
  'bulk_create_units/wrap_grid',
  'bulk_create_units/area',
], function(
  unit_size,
  wrap_grid,
  area
) {
  var previews = []

  var previewUnits3D = function(view, n, spec_id, center) {
    if (n < 1) return
    if (!spec_id || spec_id == '') return

    var configure = function(fixups) {
      var size = unit_size.updateFootprint(spec_id)
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

    distributeUnitLocations(view, n, spec_id, center)
      .then(configure)
      .then(puppetUnits3D)
  }

  var distributeUnitLocations = function(view, n, spec_id, center) {
    var size = unit_size.updateFootprint(spec_id)
    var locations = wrap_grid(size.footprint, center).take(n*2)

    var validate = function(fixups) {
      if (!size.model_filename) {
        return[]
      }
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

    var tweak = function(fixups) {
      fixups.forEach(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient)
        if (loc.pos[0] == 0 && loc.pos[1] == 0 && loc.pos[2] == 0) {
          loc.pos = locations[i].pos
        }
        loc.planet = center.planet
        loc.orient_rel = false // fixup appears to give absolute orients
        loc.orient = loc.orient || locations[i].orient
      })
      return fixups
    }

    return view
      .fixupBuildLocations(spec_id, center.planet, locations)
      .then(validate)
      .then(tweak)
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
