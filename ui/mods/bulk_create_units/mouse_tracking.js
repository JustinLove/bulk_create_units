define([], function() {
  // Pointer tracking
  var mouse = {
    x: 0,
    y: 0,
    hdeck: model.holodeck,
    track: function(e) {
      mouse.x = e.offsetX
      mouse.y = e.offsetY
      mouse.hdeck = $(this).data('holodeck')
    },
    setTracking: function(value) {
      if (value) {
        $('body').on('mousemove', 'holodeck', mouse.track)
      } else {
        $('body').off('mousemove', 'holodeck', mouse.track)
      }
    },
    scaled: function() {
      var scale = api.settings.getSynchronous('ui', 'ui_scale') || 1.0;

      return [
        Math.floor(mouse.x * scale),
        Math.floor(mouse.y * scale)
      ]
    },
    raycast: function() {
      var scale = api.settings.getSynchronous('ui', 'ui_scale') || 1.0;

      var x = Math.floor(mouse.x * scale)
      var y = Math.floor(mouse.y * scale)
      return mouse.hdeck.raycast(x, y)
    },
  }

  return mouse
})
