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
 * Computed Properties
 * @param 'data' {object} The data object
 *    @property 'value' {int} The value used to determine the amount of the
 *                          bar to be filled in as a percentage of maxValue.
 *    @property 'maxValue' {int} The value used to determine the percentage that
 *                             value represents.
 * @param 'config' {object} The config object for the chart
 *    @property 'strokeWidth' {int} The thickness of the chart
 *    @property 'trailWidth' {int} The thickness of the charts path
 *    @property 'trailColor' {hex} The color of the 'empty' part of the chart
 *    @property 'from' {object} The configuration for how the chart looks at
 *                            the beginning of the chart
 *              @property 'color' {hex} The html color of the 'from' chart
 *    @property 'to' {object} The configuration for how the chart looks at
 *                            the beginning of the chart
 *              @property color {hex} The html color of the 'to' chart
 *
 * See https://kimmobrunfeldt.github.io/progressbar.js/ for additional information.
 *
 * Example Configuration

   data: {
       value: 6,
       maxValue: 12
   },
   config: {
       strokeWidth: 2,
       trailWidth: 1,
       from: {
           color: '#FF0000'
       },
       to: {
           color: '#0000FF'
       }
   }
 **/

ko.bindingHandlers.barProgress = {
    defaultOptions: () => ({
        step: function(state, bar, attachment) {
            bar.path.setAttribute('stroke', state.color);
        },
        strokeWidth: 8,
        trailWidth: 8,
        easing: 'easeInOut',
        duration: 600
    }),

    init: (element, valueAccessor, allBindingsAccessor) => {
        const params = valueAccessor();
        let { config } = params;
        const opts = {
            ...ko.bindingHandlers.barProgress.defaultOptions(),
            ...config
        };
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
            ...config
        };
        const percentage = maxValue && value ? parseInt(value)/parseInt(maxValue) : 0;

        $(element).data('progressBar').animate(percentage, opts);
        if (text) {
            $(element).data('progressBar').setText(text.value);
        }
    }
};
