'use strict';

/**
 * Knockout Bootstrap Modal Binding
 * author: Brian Schrader
 *
 * Open and close a bootstrap modal using an observable.
 * This binding also has an optional field for a callback
 * once the animation has completed.
 *
 * Note: The callback is called when the modal is both opened and closed.
 *
 * Usage:
 * <div data-bind="modal: { open: myObservable, callback: myFunction }"></div>
 */
ko.bindingHandlers.modal = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var openOrClosed = ko.utils.unwrapObservable(value.open);
        var callback = ko.utils.unwrapObservable(value.callback);

        $(element).modal();

        if (callback) {
            // Register callbacks.
            $(element).on('hidden.bs.modal', callback);
            $(element).on('shown.bs.modal', callback);
        }

        ko.bindingHandlers.modal.toggle(openOrClosed, element);
    },

    update: function(element, valueAccessor) {
        var value = valueAccessor();
        var openOrClosed = ko.utils.unwrapObservable(value.open);
        ko.bindingHandlers.modal.toggle(openOrClosed, element);
    },

    toggle: function(openOrClosed, element) {
        var action = openOrClosed ? 'show' : 'hide';
        $(element).modal(action);
    }
};
