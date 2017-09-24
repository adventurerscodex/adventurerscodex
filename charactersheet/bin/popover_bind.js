import ko from 'knockout'

/**
 * Obtained this binding from:
 * http://stackoverflow.com/questions/14822018/knockout-twitter-bootstrap-popover-binding
 *
 * This binding adds support for the boostrap popover functionality. This binding
 * supports popover options and by default the placement is on the top. There are
 * two parts to fully implement a popover:
 *
 * 1. Adding a popover message in a model or viewModel.
 *   a. ```self.proficiencyPopover = 'My popover message';```
 * 2. Adding a binding to display the popover.
 * ```<span class="fa fa-info-circle" style="cursor:pointer;"
 *        data-bind="popover: { content: proficiencyPopover }">
 *    </span>```
 *
 * @param element: The DOM element involved in this binding
 * @param valueAccessor: A JavaScript function that you can call to get the
 * current model property that is involved in this binding.
 */
ko.bindingHandlers.popover = {
    init: function (element, valueAccessor) {
        var local = ko.utils.unwrapObservable(valueAccessor()),
            options = {};

        ko.utils.extend(options, ko.bindingHandlers.popover.options);
        ko.utils.extend(options, local);

        $(element).popover(options);

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).popover("destroy");
        });
    },
    options: {
        placement: "top",
        html: true
    }
};