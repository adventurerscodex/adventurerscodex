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
        value.onfocusout = (input) => {
            if (value.updateHandler) {
                value.updateHandler($(element), input);
            }
        };

        $(element).validate(ko.unwrap(value));
    },
};
