import ko from 'knockout';

/**
 * mini-health component
 * A useful  component for incrementing/decrementing health.
 * @param valueInput {observable} an observable in which to save the value
 * @param id {string: Optional} an id for blurring the field. Default: ''
 * @param min {int: Optional} the minimum value. Default: 100000
 * @param max {int: Optional} the maximum value. Default: 0
 * @param onChange {function: Optional} A callback 
 * Usage:
 * <mini-health-input params="value: myValue, min: 0, max: 10, onChange: ()=>{someAction}">
 * </mini-health-input>
 *
 */
export function MiniHealthInputComponentViewModel(params) {
    var self = this;
    self.id = params.id || ko.observable('');
    self.max = params.max || ko.observable(1000000);
    self.min = params.min || ko.observable(0);
    self.valueInput = params.valueInput;
    self.onChange = params.onChange ? params.onChange : () => {};

    self.value = ko.observable(null);
    
    self.handleHeal = async () => {
        let healValue = -1;
        if (this.value()) {
            healValue = 0 - parseInt(self.value());
        }
        let currentDamage = ko.unwrap(self.valueInput);
        if (self.valueInput() + healValue < self.min()) {
            self.valueInput(self.min());
        }
        else {
            self.valueInput(currentDamage + healValue);
        }
        await self.onChange();
        self.value(null);
        $(`#${self.id()}_health-heal-input`).blur();

    };

    self.handleDmg = async () => {
        let damageValue = 1;
        if (self.value()) {
            damageValue = 0 + parseInt(self.value());
        }
        let currentDamage = ko.unwrap(self.valueInput);
        if (currentDamage + damageValue > self.max()) {
            self.valueInput(self.max());
        }
        else {
            self.valueInput(currentDamage + damageValue);
        }
        await self.onChange();
        self.value(null);
        $(`#${self.id()}_health-heal-input`).blur();
    };


}

ko.components.register('mini-health-input', {
    viewModel: MiniHealthInputComponentViewModel,
    template: '\
    <div class="form-group">\
      <div class="input-group">\
        <span class="input-group-addon" style="padding: 0px;">\
          <button class="health-btn btn btn-xs btn-danger"\
          style="border-bottom-right-radius: 0px; border-top-right-radius: 0px; border-bottom-left-radius: 4px; border-top-left-radius: 4px; "\
          data-bind="click: handleDmg"\
          ><i class="fa fa-minus"></i></button>\
        </span>\
        <input type="number"\
            data-bind="attr: {id: `${id()}_health-dmg-input`}, value: value"\
            class="form-control ac-number-input"\
            style="padding: 5px; text-align: center; min-width: 35px;"\
            pattern="\\d*"\
            min="0">\
        <span class="input-group-addon" style="padding: 0px">\
          <button class="health-btn btn btn-xs btn-success"\
          data-bind="click: handleHeal"\
          ><i class="fa fa-plus"></i>\
          </button>\
        </span>\
      </div>\
    </div>\
'
});
