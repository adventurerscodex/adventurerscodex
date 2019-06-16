import $ from 'jquery';
import ProgressBar from 'progressbar.js';
import ko from 'knockout';
/**
 * Knockout jQuery Circular Progress Bar Binding
 * author: Brian Schrader and David Mote
 *
 * A Knockout binding for the circular-progress Widget. The circleProgress
 * takes a computedObservable for configuration and data.
 * Usage:
 * <div class="hp-circle" data-bind="circleProgress: boundChart()"></div>
 *
 * Computed Properties
 * @param 'data' {object} The data object
 *    @property 'text' {object} The text display in the center of the circle
 *          @property 'value' { string } The text to display
 *    @property 'value' {int} The value used to determine the amount of the
 *                          circle to be filled in as a percentage of maxValue.
 *    @property 'maxValue' {int} The value used to determine the percentage that
 *                             value represents.
 * @param 'config' {object} The config object for the chart
 *    @property 'strokeWidth' {int} The thickness of the chart
 *    @property 'trailColor' {hex} The color of the 'empty' part of the chart
 *    @property 'from' {object} The configuration for how the chart looks at
 *                            the beginning of the chart
 *              @property 'color' {hex} The html color of the 'from' chart
 *    @property 'to' {object} The configuration for how the chart looks at
 *                            the beginning of the chart
 *              @property color {hex} The html color of the 'to' chart
 *    @property 'text' {object} The configration of the text in the center
 *          @property 'className' { string } The text to display
 *
 * See https://kimmobrunfeldt.github.io/progressbar.js/ for additional information.
 *
 * Example Configuration
 *
 * ko.pureComputed(()=>({
     data: {
         text: {
            value: '95'
          },
         value: 100,
         maxValue: 95
     },
     config: {
         strokeWidth: 12,
         trailColor: '#FFF',
         from: { color: #FF0000 },
         to: { color: #0000FF },
         text: {
             className: 'lead hpChart'
         }
     }
   });
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
        duration: 600
    }),

    init: (element, valueAccessor, allBindingsAccessor) => {
        const params = valueAccessor();
        let { config } = params;
        const opts = {
            ...ko.bindingHandlers.circleProgress.defaultOptions(),
            ...config
        };
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
            ...config
        };
        const percentage = maxValue && value ? parseInt(value)/parseInt(maxValue) : 1;

        $(element).data('progressBar').animate(percentage, opts);
        if (text) {
            $(element).data('progressBar').setText(text.value);
        }
    }
};
