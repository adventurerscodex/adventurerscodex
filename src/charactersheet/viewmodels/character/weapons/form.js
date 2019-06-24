import {
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Weapon } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class WeaponFormViewModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Weapon;
    }

    prePopSource = 'weapons';

    proficiencyOptions = Fixtures.weapon.weaponProficiencyOptions;
    setWeaponProficiency = (label, value) => {
        this.entity().proficiency(value);
    };

    handednessOptions = Fixtures.weapon.weaponHandednessOptions;
    setWeaponHandedness = (label, value) => {
        this.entity().handedness(value);
    };

    typeOptions = Fixtures.weapon.weaponTypeOptions;
    setWeaponType = (label, value) => {
        this.entity().type(value);
    };

    propertyOptions = Fixtures.weapon.weaponPropertyOptions;
    setWeaponProperty = (label, value) => {
        this.entity().property(value);
    };

    damageTypeOptions = Fixtures.weapon.weaponDamageTypeOptions;
    setWeaponDamageType = (label, value) => {
        this.entity().damageType(value);
    };

    currencyDenominationOptions = Fixtures.general.currencyDenominationList;
    setWeaponCurrencyDenomination = (label, value) => {
        this.entity().currencyDenomination(value);
    };
}

ko.components.register('weapon-form', {
    viewModel: WeaponFormViewModel,
    template: template
});
