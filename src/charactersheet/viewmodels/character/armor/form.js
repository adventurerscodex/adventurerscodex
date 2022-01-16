import { Fixtures, Notifications } from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { PartyService } from 'charactersheet/services';
import { Armor } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';


export class ArmorFormViewModel  extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Armor;
    }

    prePopSource = 'armors';

    typeOptions = Fixtures.armor.armorTypeOptions;
    setArmorType = (label, value) => {
        this.entity().type(value);
    };

    stealthOptions = Fixtures.armor.armorStealthOptions;
    setArmorStealth = (label, value) => {
        this.entity().stealth(value);
    };

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;
    setArmorCurrencyDenomination = (label, value) => {
        this.entity().currencyDenomination(value);
    };

    didSave(success, error) {
        super.didSave(success, error);
        PartyService.updatePresence();
    }

    didDelete(success, error) {
        super.didDelete(success, error);
        PartyService.updatePresence();
    }
}

ko.components.register('armor-form', {
    viewModel: ArmorFormViewModel,
    template: template
});
