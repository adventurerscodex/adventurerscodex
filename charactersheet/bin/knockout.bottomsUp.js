/*global ko*/
(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('knockout'));
    } else if (typeof define === 'function' && define.amd) {
        define(['knockout'], factory);
    } else {
        factory(ko);
    }
}(this, function (ko) {
    ko.bindingHandlers.bottomsUp = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            element.scrollTop = element.scrollHeight - element.clientHeight;
            var value = valueAccessor(),
                config = value && typeof value === 'object' ? value : {},
                allBindings = allBindingsAccessor(),
                observableArray = (allBindings.foreach && allBindings.foreach.data) ||
                    allBindings.foreach ||
                    (allBindings.template && allBindings.template.foreach),
                isAtBottom,
                beforeChangeSubscription = observableArray.subscribe(function () {
                    isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight;
                }, this, 'beforeChange'),
                afterChangeSubscription = observableArray.subscribe(function () {
                    if (isAtBottom) {
                        isAtBottom = null;
                        element.scrollTop = element.scrollHeight - element.clientHeight;
                        if (typeof config.trim !== 'undefined') {
                            var numberOfItemsOutsideViewportToKeep = typeof config.trim === 'number' ? config.trim : 0,
                                length = observableArray().length;
                            if (element.scrollHeight > element.clientHeight) {
                                var numItemsToKeep = Math.ceil(element.clientHeight / (element.scrollHeight / length)) + config.trim;
                                if (numItemsToKeep < length) {
                                    observableArray.splice(0, length - numItemsToKeep);
                                }
                            }
                        }
                    }
                });
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                beforeChangeSubscription.dispose();
                afterChangeSubscription.dispose();
            });
        }
    };
}));
