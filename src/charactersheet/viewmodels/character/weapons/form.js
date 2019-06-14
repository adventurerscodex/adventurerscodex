import {
    DataRepository,
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import {
    AbstractChildFormModel
} from 'charactersheet/viewmodels/abstract';
import {
    CardSubmitActionComponent
} from 'charactersheet/components/card-submit-actions';
import {
    Weapon
} from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';


export class WeaponFormViewModel extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    generateBlank() {
        return new Weapon();
    }

    proficiencyOptions = Fixtures.weapon.weaponProficiencyOptions;
    handednessOptions = Fixtures.weapon.weaponHandednessOptions;
    typeOptions = Fixtures.weapon.weaponTypeOptions;
    propertyOptions = Fixtures.weapon.weaponPropertyOptions;
    damageTypeOptions = Fixtures.weapon.weaponDamageTypeOptions;
    currencyDenominationOptions = Fixtures.general.currencyDenominationList;

    weaponsPrePopFilter = (request, response) => {
        var term = request.term.toLowerCase();
        var keys = DataRepository.weapons ? Object.keys(DataRepository.weapons) : [];
        var results = keys.filter(function(name, idx, _) {
            return name.toLowerCase().indexOf(term) > -1;
        });
        response(results);
    };

    populateWeapon = (label, value) => {
        const weapon = DataRepository.weapons[label];
        this.entity().importValues(weapon);
        this.showDisclaimer(true);
    };

    setWeaponType = (label, value) => {
        this.entity().type(value);
    };

    setWeaponHandedness = (label, value) => {
        this.entity().handedness(value);
    };

    setWeaponProficiency = (label, value) => {
        this.entity().proficiency(value);
    };

    setWeaponCurrencyDenomination = (label, value) => {
        this.entity().currencyDenomination(value);
    };

    setWeaponDamageType = (label, value) => {
        this.entity().damageType(value);
    };

    setWeaponProperty = (label, value) => {
        this.entity().property(value);
    };

    validation = {
        ...Weapon.validationConstraints.rules
    };

    notify = () => {Notifications.weapon.changed.dispatch();};
}

ko.components.register('weapon-form', {
    viewModel: WeaponFormViewModel,
    template: template
});
