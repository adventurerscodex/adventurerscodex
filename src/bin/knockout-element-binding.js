import ko from 'knockout';

/**
 * Adds a binding that allows a view model to save and access a reference to
 * an element in their context.
 *
 * <div data-bind="element: someObservable"></div>
 *
 * $(this.someObservable()).val('set-value');
 *
 */
ko.bindingHandlers.element = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        value(element);
    }
};
