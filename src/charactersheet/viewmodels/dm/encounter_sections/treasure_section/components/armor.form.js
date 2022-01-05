import autoBind from 'auto-bind';
import { Fixtures } from 'charactersheet/utilities';
import { AbstractTreasureFormViewModel } from 'charactersheet/viewmodels/abstract';
import { EncounterArmor, Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './armor.form.html';
import { SELECTDATA } from 'charactersheet/constants';


class EncounterArmorFormViewModel extends AbstractTreasureFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    prePopSource = 'armors';
    prePopLimit = SELECTDATA.LONG;

    modelClass() {
        return Treasure;
    }

    treasureClass() {
        return EncounterArmor;
    }

    treasureType() {
        return Treasure.TYPE.ARMOR;
    }

    // Field-Level Pre-population

    typeOptions = Fixtures.armor.armorTypeOptions;
    setType = (label, value) => {
        this.entity().value().type(value);
    }

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;
    setCurrencyDenomination = (label, value) => {
        this.entity().value().currencyDenomination(value);
    }

    stealthOptions = Fixtures.armor.armorStealthOptions;
    setStealth = (label, value) => {
        this.entity().value().stealth(value);
    }
}


ko.components.register('treasure-armor-form', {
    viewModel: EncounterArmorFormViewModel,
    template: template
});
