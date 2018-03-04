import $ from 'jquery';
import ko from 'knockout';
import 'jquery-validation';

/**
* Binds a form element to use jQuery validation tools
* The argument should be a an object of settings.
*/
ko.bindingHandlers.validate = {
    init: (element, valueAccessor) => {
        const value = valueAccessor();

        // Add a new handler callback that adds the form as a param for
        // checking overall validity.
        // Preserve the old onfocusout in case it was being used.
        value.ogonfocusout = value.onfocusout;
        value.onfocusout = (input, event) => {
            if (value.updateHandler) {
                value.updateHandler($(element), input);
            }
            if (value.ogonfocusout) {
                value.ogonfocusout(input, event);
            }
        };

        $(element).validate(ko.unwrap(value));
    },
};
