import $ from 'jquery';
import ProgressBar from 'progressbar.js';
import ko from 'knockout';
/**
 * Knockout jQuery Circular Progress Bar Binding
 * author: Brian Schrader
 *
 * A Knockout binding for the circular-progress Widget.
 *
 * Usage:
 * <div data-bind="circleProgress: { }"></div>
 *
 */

ko.bindingHandlers.circleProgress = {
    defaultOptions: () => ({
      step: function(state, circle, attachment) {
          circle.path.setAttribute('stroke', state.color);
      },
      strokeWidth: 8,
      trailWidth: 8,
      easing: 'easeInOut',
      duration: 600,
    }),

    init: (element, valueAccessor, allBindingsAccessor) => {
        const params = valueAccessor();
        let { config } = params;
        const opts = {
          ...ko.bindingHandlers.circleProgress.defaultOptions(),
          ...config,
        }
        const progressBar = new ProgressBar.Circle(element, opts);
        $(element).data({progressBar:progressBar});
    },

    update: (element, valueAccessor, allBindingsAccessor) => {
        const params = valueAccessor();
        let { data: { value, maxValue, text }, config } = params;

        value = parseInt(ko.utils.unwrapObservable(value));
        maxValue = parseInt(ko.utils.unwrapObservable(maxValue));
        text = ko.utils.unwrapObservable(text);

        const opts = {
          ...ko.bindingHandlers.circleProgress.defaultOptions(),
          ...config,
        }
        const percentage = maxValue && value ? parseInt(value)/parseInt(maxValue) : 1;

        $(element).data('progressBar').animate(percentage, opts);
        if (text) {
          $(element).data('progressBar').setText(text.value);
        }
    }
};
