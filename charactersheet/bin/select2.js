ko.bindingHandlers.select2 = {
    init: function(element, valueAccessor) {
        var options = ko.toJS(valueAccessor()) || {};
        setTimeout(function() {
          $(element).select2(options);
      }, 0);
    }
};