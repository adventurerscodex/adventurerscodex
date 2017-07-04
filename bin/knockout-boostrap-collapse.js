'use strict';

/**
 * Knockout Bootstrap Well Binding
 * author: Brian Schrader
 *
 * Open and close a bootstrap well using an observable.
 * This binding also has an optional field for a callback
 * once the animation has completed.
 *
 * Note: The callback is called when the well is both opened and closed.
 *
 * Usage:
 * <div data-bind="well: { open: myObservable, callback: myFunction }"></div>
 */
ko.bindingHandlers.well = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var openOrClosed = ko.utils.unwrapObservable(value.open);
        var callback = ko.utils.unwrapObservable(value.callback);

        $(element).collapse({
            toggle: false
        });

        if (callback) {
            // Register callbacks.
            $(element).on('hidden.bs.collapse', callback);
            $(element).on('shown.bs.collapse', callback);
        }

        ko.bindingHandlers.well.toggle(openOrClosed, element);
    },

    update: function(element, valueAccessor) {
        var value = valueAccessor();
        var openOrClosed = ko.utils.unwrapObservable(value.open);
        ko.bindingHandlers.well.toggle(openOrClosed, element);
    },

    toggle: function(openOrClosed, element) {
        var action = openOrClosed ? 'show' : 'hide';
        $(element).collapse(action);
    }
};
