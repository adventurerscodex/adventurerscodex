import ko from 'knockout';

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
export function MiniPlusMinusComponentViewModel(params) {
    var self = this;

    self.value = params.value;
    self.hideUp = params.hideUp || false;
    self.hideDown = params.hideDown || false;
    self.max = params.max || ko.observable(1000000);
    self.min = params.min || ko.observable(0);

    self.onChange = params.onChange ? params.onChange : () => {};

    self.increase = function(data, event) {
        event.stopPropagation();
        if (parseInt(self.value()) < parseInt(self.max())) {
            self.value(parseInt(self.value()) + 1);
            self.onChange();
        }
    };

    self.decrease = function(data, event) {
        event.stopPropagation();
        if (parseInt(self.value()) > parseInt(self.min())) {
            self.value(parseInt(self.value()) - 1);
            self.onChange();
        }
    };
}

ko.components.register('mini-plus-minus', {
    viewModel: MiniPlusMinusComponentViewModel,
    template: '\
    <div class="btn-group btn-group-vertical" role="group">\
        <!-- ko if: !hideUp -->\
        <button type="button" style="padding: 0px; border-width: 0px" class="btn btn-link"\
          data-bind="click: decrease">\
              <i style="padding: 5px" class="glyphicon glyphicon-menu-up"> </i>\
        </button>\
        <!-- /ko -->\
        <!-- ko if: !hideDown -->\
        <button type="button" style="padding: 0px;  border-width: 0px" class="btn btn-link"\
          data-bind="click: increase">\
              <i style="padding: 5px" class="glyphicon glyphicon-menu-down"> </i>\
        </button>\
        <!-- /ko -->\
    </div>'
});
