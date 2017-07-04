'use strict';

/**
 * plus-minus component
 * A useful 2 button component for incrementing/decrementing a value.
 * @param value {observable} an observable in which to save the value
 * @param min {int: Optional} the minimum value. Default: 100000
 * @param max {int: Optional} the maximum value. Default: 0
 * Usage:
 * <plus-minus params="value: myValue, min: 0, max: 10"></plus-minus>
 *
 * Note: This template adapts the button size based on the device size.
 */
function PlusMinusComponentViewModel(params) {
    var self = this;

    self.value = params.value;
    self.max = params.max || ko.observable(1000000);
    self.min = params.min || ko.observable(0);

    self.increase = function() {
        if (parseInt(self.value()) < parseInt(self.max())) {
            self.value(parseInt(self.value()) + 1);
        }
    };

    self.decrease = function() {
        if (parseInt(self.value()) > parseInt(self.min())) {
            self.value(parseInt(self.value()) - 1);
        }
    };
}

ko.components.register('plus-minus', {
    viewModel: PlusMinusComponentViewModel,
    template: '\
    <div class="visible-lg-inline-block input-group ac-plus-minus">\
      <div>\
        <button type="button" class="btn btn-default" \
            data-bind="click: increase">\
                <i class="fa fa-plus fa-color"> </i>\
        </button>\
        <span data-bind="text: value" class="used-slot-span"></span>\
        <button type="button" class="btn btn-default" \
        data-bind="click: decrease">\
            <i class="fa fa-minus fa-color"> </i>\
        </button>\
      </div>\
    </div> \
    <div class="hidden-lg input-group ac-plus-minus">\
      <div>\
        <button type="button" class="btn btn-default btn-sm" \
            data-bind="click: increase">\
                <i class="fa fa-plus fa-color"> </i>\
        </button>\
        <span data-bind="text: value" class="used-slot-span"></span>\
        <button type="button" class="btn btn-default btn-sm" \
        data-bind="click: decrease">\
            <i class="fa fa-minus fa-color"> </i>\
        </button>\
      </div>\
    </div>'
});
