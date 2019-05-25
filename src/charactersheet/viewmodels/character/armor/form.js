import {
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

import { Armor } from 'charactersheet/models';
import { CardActionButton } from 'charactersheet/components/card-action-buttons';
import { FormController } from 'charactersheet/components/form-controller-component';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';


export class ArmorFormViewModel  extends FormController {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank() {
        return new Armor();
    }

    typeOptions = Fixtures.armor.armorTypeOptions;
    stealthOptions = Fixtures.armor.armorStealthOptions;
    currencyDenominationOptions = Fixtures.general.currencyDenominationList;

    // Pre-populate methods
    setArmorType = (label, value) => {
        this.entity().type(value);
    };

    setArmorCurrencyDenomination = (label, value) => {
        this.entity().currencyDenomination(value);
    };

    setArmorStealth = (label, value) => {
        this.entity().stealth(value);
    };

    /* Modal Methods */
    armorsPrePopFilter = (request, response) => {
        const term = request.term.toLowerCase();
        const keys = DataRepository.armors ? Object.keys(DataRepository.armors) : [];
        const results = keys.filter((name, idx, _) => {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    populateArmor = (label, value) => {
        const armor = DataRepository.armors[label];
        this.entity().importValues(armor);
        this.showDisclaimer(true);
    };

    notify = () => {
        Notifications.armor.changed.dispatch();
    }

    validation = {
        ...Armor.validationConstraints
    };
}

ko.components.register('armor-form', {
    viewModel: ArmorFormViewModel,
    template: template
});
