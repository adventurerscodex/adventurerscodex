import {
  CoreManager,
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

import { FormController } from 'charactersheet/components/form-controller-component';

import { Weapon } from 'charactersheet/models';

import { debounce } from 'lodash';
import ko from 'knockout';
import template from './form.html';


export class WeaponFormViewModel  extends FormController {
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
        this.shouldShowDisclaimer(true);
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
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.addFeature();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...Weapon.validationConstraints
    };
}

ko.components.register('weapon-form', {
    viewModel: WeaponFormViewModel,
    template: template
});
