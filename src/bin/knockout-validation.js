import 'jquery-validation';
import $ from 'jquery';
import ko from 'knockout';

/**
* Binds a form element to use jQuery validation tools
* The argument should be a an object of settings from jQuery Validate.
*
* jQuery Validation Docs:
* https://jqueryvalidation.org/validate/
*
* Usage Example
* -------------
*  <form class="form-horizontal" data-bind="validate: validationSettings">
*    <!-- Inputs in a validated form must have a name. -->
*    <input name="name" value="" type="text" />
*    <!-- Either buttons or input[type=submit] works fine.. -->
*    <input type="submit" value="Add" />
*  </form>
*
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
            // TODO: Leaving for now. It seems that this is not needed.
            // if (value.ogonfocusout) {
            //     value.ogonfocusout(input, event);
            // }
        };

        $(element).validate(ko.unwrap(value));
    }
};
