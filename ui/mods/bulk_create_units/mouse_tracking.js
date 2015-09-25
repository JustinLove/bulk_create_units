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
  }

  return mouse
})
