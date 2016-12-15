'use strict';

/**
 * This extender validates the input observeable that it is assigned to. Currently,
 * this extender only checks for an empty value. There are two parts to fully
 * implementing this extender:
 *
 * 1. Adding the extender to an observeable.
 *   a. ```self.str = ko.observable().extend({ required: "&#9679; Required" });```
 * 2. Adding a display element to the UI that indicates the validation status.
 *   b. ```<span data-bind='visible: str.hasError, html: str.validationMessage,
 *           css: { errormessagetext: str.hasError }'> </span>```
 *
 * @param target: the observable to be validated
 * @param overrideMessage: an _optional_ parameter to display a unique validation message
 */

ko.extenders.required = function(target, overrideMessage) {
    //add some sub-observables to our observable
    target.hasError = ko.observable();
    target.validationMessage = ko.observable();

    //define a function to do validation
    function validate(newValue) {
       target.hasError(newValue ? false : true);
       target.validationMessage(newValue ? "" : overrideMessage || "This field is required");
    }

    //initial validation
    validate(target());

    //validate whenever the value changes
    target.subscribe(validate);

    //return the original observable
    return target;
};
