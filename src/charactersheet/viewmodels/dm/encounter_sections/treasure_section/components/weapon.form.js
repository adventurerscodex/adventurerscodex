import autoBind from 'auto-bind';
import { Fixtures } from 'charactersheet/utilities';
import { AbstractTreasureFormViewModel } from 'charactersheet/viewmodels/abstract';
import { EncounterWeapon, Treasure } from 'charactersheet/models/dm';
import ko from 'knockout';
import template from './weapon.form.html';
import { SELECTDATA } from 'charactersheet/constants';


class EncounterWeaponFormViewModel extends AbstractTreasureFormViewModel {

    constructor(params) {
        super(params);
        autoBind(this);
    }

    prePopSource = 'weapons';
    prePopLimit = SELECTDATA.LONG;

    modelClass() {
        return Treasure;
    }

    treasureClass() {
        return EncounterWeapon;
    }

    treasureType() {
        return Treasure.TYPE.WEAPON;
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

    handednessOptions = Fixtures.weapon.weaponHandednessOptions;
    setHandedness = (label, value) => {
        this.entity().value().handedness(value);
    }

    proficiencyOptions = Fixtures.weapon.weaponProficiencyOptions;
    setProficiency = (label, value) => {
        this.entity().value().proficiency(value);
    }

    damageTypeOptions = Fixtures.weapon.weaponDamageTypeOptions;
    setDamageType = (label, value) => {
        this.entity().value().damageType(value);
    }

    propertyOptions = Fixtures.weapon.weaponPropertyOptions;
    setProperty = (label, value) => {
        this.entity().value().property(value);
    }
}


ko.components.register('treasure-weapon-form', {
    viewModel: EncounterWeaponFormViewModel,
    template: template
});
