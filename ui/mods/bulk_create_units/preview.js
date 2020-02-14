define([
  'bulk_create_units/unit_size',
], function(
  unit_size
) {
  var previews = []
  var gamma = 2.2/1.0

  var previewUnitLocations = function(view, locations, playerColor) {
    var configure = function(fixups) {
      return fixups.map(function(loc, i) {
        //console.log(loc.ok, loc.desc, loc.pos, loc.orient, loc.spec_id)
        var size = unit_size.data()[loc.spec_id]
        if (!size || !size.model_filename) return {}
        var color
        if (!loc.ok) {
          color = [0.8, 0, 0, 0]
        } else if (loc.desc) {
          color = [0.8, 0.2, 0.2, 0]
        } else if (playerColor && playerColor.length == 3) {
          color = [
            Math.pow(playerColor[0]/256, gamma),
            Math.pow(playerColor[1]/256, gamma),
            Math.pow(playerColor[2]/256, gamma),
            0
          ]
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
          },
        }
      })
    }

    var puppetUnits3D = function(puppets) {
      //clearPreviews(view)
      puppets.forEach(function(puppet, i) {
        //console.log(puppet)
        if (!puppet || !puppet.model || !puppet.model.filename) return
        if (previews[i]) {
          puppet.id = previews[i].id
        }
        view.puppet(puppet, true).then(function(r) { previews[i] = r }, function() {console.log('preview pupppet fail')})
      })
      previews.splice(puppets.length).forEach(function(puppet) {
        removePuppet(view, puppet)
      })
    }

    puppetUnits3D(configure(locations))
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
    previewUnitLocations: previewUnitLocations,
    clearPreviews: clearPreviews,
  }
})
