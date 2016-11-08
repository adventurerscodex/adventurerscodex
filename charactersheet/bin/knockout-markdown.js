'use strict';

/**
 * A binding to apply the simpleMDE editor to a text area. This binding has 2
 * parameters: a required variable to save the text in, and an optional
 * placeholder string.
 *
 * Usage: data-bind="simpleMDE: { placeholder: 'string' }"
 */
ko.bindingHandlers.simpleMDE = {
    mde: {},
    init: function(element, valueAccessor, allBindings) {
        var value = ko.unwrap(valueAccessor());
        var text = ko.unwrap(allBindings.get('text'));
        var mde = new SimpleMDE({
            spellChecker: false,
            placeholder: value.placeholder || '',
            element: element,
            forceSync: true,
            initialValue: text
        });
        ko.bindingHandlers.simpleMDE.mde[element.id] = mde
    },
    update: function(element, valueAccessor, allBindings) {
        var value = valueAccessor();
        var mde = ko.bindingHandlers.simpleMDE.mde[element.id]
        mde.value(ko.unwrap(allBindings.get('text')));
    }
};
