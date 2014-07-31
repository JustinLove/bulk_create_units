(function() {
  //load html dynamically
  loadTemplate = function (element, url, model) {
    element.load(url, function () {
      console.log("Loading html " + url);
      ko.applyBindings(model, element.get(0));
    });
  };

  //var container = $('<div id="insertion_point"></div>')
  //container.appendTo('body')
  //loadTemplate(container, 'coui://ui/mods/bulk_create_units/bulk_create_units.html', model);
})()
