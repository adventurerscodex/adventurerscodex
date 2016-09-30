ko.bindingHandlers.select2 = {
    init: function(element, valueAccessor) {
      var options = valueAccessor() || {};
      setTimeout(function() {
          $(element).select2(options);
      }, 0);
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor(),
            value = ko.utils.unwrapObservable(allBindings.value || allBindings.selectedOptions);
        if (value) {
            $(element).select2('val', value);
        }
    }
};
