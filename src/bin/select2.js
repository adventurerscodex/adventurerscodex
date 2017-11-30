import ko from 'knockout'
import $ from 'jquery'

import 'select2'
import 'select2/select2.css';


ko.bindingHandlers.select2 = {
    init: function(element, valueAccessor) {
        var options = valueAccessor() || {};
        $(element).select2(options);
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
        var allBindings = allBindingsAccessor(),
            value = ko.utils.unwrapObservable(allBindings.value || allBindings.selectedOptions);
        if (value) {
            $(element).select2('val', value);
        }
    }
};
