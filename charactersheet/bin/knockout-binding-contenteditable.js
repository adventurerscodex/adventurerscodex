'use strict';

/**
 * Knockout ContentEditable Binding
 * author: Brian Schrader
 *
 * Bind a div's content editable text to an observable with an optional
 * placeholder value. Updates contents on blur event.
 * Placeholder text may contain HTML.
 *
 * Usage:
 * <div data-bind="contenteditable: { text: myObservable,
 *      placeholder: 'test'}"></div>
 */
ko.bindingHandlers.contenteditable = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        $(element).attr('contenteditable', 'true');
        $(element).on('blur', function() {
            try {
                value.text($(element).text());
            } catch(err) {
                throw "Text variable provided is not observable."
            }
        });
    },

    update: function(element, valueAccessor) {
        var value = valueAccessor();
        if (value.text()) {
            $(element).text(value.text());
        } else {
            $(element).html(ko.utils.unwrapObservable(value.placeholder));
        }
    }
};
