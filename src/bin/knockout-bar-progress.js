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
 * <div data-bind="barProgress: { }"></div>
 *
 */

ko.bindingHandlers.barProgress = {
    defaultOptions: () => ({
      step: function(state, bar, attachment) {
          bar.path.setAttribute('stroke', state.color);
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
          ...ko.bindingHandlers.barProgress.defaultOptions(),
          ...config,
        }
        const progressBar = new ProgressBar.Line(element, opts);
        $(element).data({progressBar:progressBar});
    },

    update: (element, valueAccessor, allBindingsAccessor) => {
        const params = valueAccessor();
        let { data: { value, maxValue, text }, config } = params;

        value = parseInt(ko.utils.unwrapObservable(value));
        maxValue = parseInt(ko.utils.unwrapObservable(maxValue));
        text = ko.utils.unwrapObservable(text);

        const opts = {
          ...ko.bindingHandlers.barProgress.defaultOptions(),
          ...config,
        }
        const percentage = maxValue && value ? parseInt(value)/parseInt(maxValue) : 0;

        $(element).data('progressBar').animate(percentage, opts);
        if (text) {
          $(element).data('progressBar').setText(text.value);
        }
    }
};
