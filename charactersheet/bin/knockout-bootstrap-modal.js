'use strict';

/**
 * Knockout Bootstrap Modal Binding
 * author: Brian Schrader
 *
 * Open and close a bootstrap modal using an observable.
 * This binding also has an optional field for a callback
 * once the animation has completed.
 *
 *
 * Usage:
 * <div data-bind="modal: { open: myObservable, onopen: myFunction,
 *      onclose: myOtherFunction }"></div>
 */
ko.bindingHandlers.modal = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var openOrClosed = ko.utils.unwrapObservable(value.open);
        var onopen = ko.utils.unwrapObservable(value.onopen);
        var onclose = ko.utils.unwrapObservable(value.onclose);

        ko.bindingHandlers.modal.toggle(openOrClosed, element);

        if (onopen) {
            $(element).on('shown.bs.modal', onopen);
        }

        if (onclose) {
            $(element).on('hidden.bs.modal', onclose);
        }
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
