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
        placement: "top"
    }
};