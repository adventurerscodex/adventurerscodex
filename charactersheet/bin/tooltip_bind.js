+function(){

  'use strict';

  ko.bindingHandlers.tooltip = {
    isTouch: function isTouchDevice(){
        return true == ("ontouchstart" in window ||
            window.DocumentTouch && document instanceof DocumentTouch);
    },
    init: function(element, valueAccessor) {
      if (ko.bindingHandlers.tooltip.isTouch()) return;
      var local = ko.utils.unwrapObservable(valueAccessor()),
          options = {};

      ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
      ko.utils.extend(options, local);

      $(element).tooltip(options);

      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          $(element).tooltip("destroy");
      });
    },
    options: {
      placement: "top",
      trigger: "hover"
    }
  };

}();
