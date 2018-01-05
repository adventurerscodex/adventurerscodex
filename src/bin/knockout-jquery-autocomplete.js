import 'jquery-ui/ui/core'
import 'jquery-ui/ui/widgets/autocomplete'
import 'jquery-ui/themes/base/all.css'

import ko from 'knockout'
import $ from 'jquery'

/**
 * Knockout jQuery Autocomplete Binding
 * author: Brian Schrader
 *
 * A Knockout binding for the jQuery Autocomplete UI Widget.
 * Provided a list of values, allow the user to type and get a list of
 * autocompleted suggestions.
 *
 * When an option is selected, the onselect callback is called with the selected
 * label, and value as parameters.
 *
 * Usage:
 * <div data-bind="autocomplete: { source: myObservable, onselect: myFunction }"></div>
 *
 * Additional Options:
 * This binding accepts multiple arguments in it's configuration object, and
 * while only the source value is required these additional ones are available.
 *
 * @param delay {int} Default is 300ms.
 *   The delay in milliseconds between when a keystroke occurs and when a search
 *   is performed. A zero-delay makes sense for local data (more responsive),
 *   but can produce a lot of load for remote data, while being less responsive.
 *
 */
ko.bindingHandlers.autocomplete = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var source = ko.utils.unwrapObservable(value.source);
        var onselect = ko.utils.unwrapObservable(value.onselect);
        var delay = ko.utils.unwrapObservable(value.delay || 150);
        $(element).autocomplete({
            delay: delay,
            source: (request, response) => {
                // Clear the bindings on every search.
                // https://stackoverflow.com/a/43393889/2085172

                $(element).data('ui-autocomplete').menu.bindings = $();
                // Call the source as normal.
                return source(request, response)
            },
            minLength: 0,
            select: function(event, ui) {
                if (onselect) {
                    onselect(ui.item.label, ui.item.value);
                }
            }
        })
        $(element).focus(function() {
            $(element).autocomplete('search', '');
        })
    }
};
