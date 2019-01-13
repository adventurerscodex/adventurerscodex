import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';


export class EncounterWeapon extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    SHORT_DESCRIPTION_MAX_LENGTH = 100;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    static weaponFields = ['name', 'weaponType', 'damage', 'damageType', 'handedness', 'proficiency', 'price', 'currencyDenomination', 'magicalModifier', 'toHitModifier', 'weight', 'range', 'property', 'description', 'quantity', 'hitBonusLabel'];

    static allFields = ['name', 'weaponType', 'damage', 'damageType', 'handedness', 'proficiency', 'price', 'currencyDenomination', 'magicalModifier', 'toHitModifier', 'weight', 'range', 'property', 'description', 'quantity', 'hitBonusLabel', 'uuid', 'coreUuid', 'encounterUuid', 'type'];

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();

    // Weapon Fields
    name = ko.observable('');
    weaponType = ko.observable('');
    damage = ko.observable('');
    damageType = ko.observable('');
    handedness = ko.observable('');
    proficiency = ko.observable('');
    price = ko.observable(0);
    currencyDenomination = ko.observable('');
    magicalModifier = ko.observable(0);
    toHitModifier = ko.observable(0);
    weight = ko.observable(1);
    range = ko.observable('');
    property = ko.observable('');
    description = ko.observable('');
    quantity = ko.observable(1);
    hitBonusLabel = ko.observable();

    weaponProficiencyOptions = ko.observableArray(Fixtures.weapon.weaponProficiencyOptions);
    weaponHandednessOptions = ko.observableArray(Fixtures.weapon.weaponHandednessOptions);
    weaponTypeOptions = ko.observableArray(Fixtures.weapon.weaponTypeOptions);
    weaponPropertyOptions = ko.observableArray(Fixtures.weapon.weaponPropertyOptions);
    weaponDamageTypeOptions = ko.observableArray(Fixtures.weapon.weaponDamageTypeOptions);
    weaponCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;

    nameLabel = ko.pureComputed(() => {
        return this.name();
    });

    propertyLabel = ko.pureComputed(() => {
        return this.damage() ? this.damage() : '';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.shortDescription();
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    weaponRangeLabel = ko.pureComputed(() => {
        if (this.type().toLowerCase() === 'ranged') {
            if (this.range()) {
                return this.range() + ' ft.';
            } else {
                return '';
            }
        } else if (this.type().toLowerCase() === 'melee') {
            var weaponRange = parseInt(this.range());
            if (!weaponRange) {
                weaponRange = 5;
            }
            if (this.property()) {
                if (this.property().toLowerCase().indexOf('reach') !== -1) {
                    weaponRange += 5;
                }
            }
            return weaponRange + ' ft.';
        }
    });

    magicalModifierLabel = ko.pureComputed(() => {
        var magicalModifier = this.magicalModifier();
        if (magicalModifier) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    });

    weaponDescriptionHTML = ko.pureComputed(() => {
        if (this.description()) {
            return this.description();
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    weaponWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    clean = (keys, params) => {
        let treasure = pick(params, EncounterWeapon.mapping.include);
        treasure.value = pick(params, EncounterWeapon.weaponFields);
        return treasure;
    };

    buildModelFromValues = (values) => {
        let keys = Object.keys(values);
        keys.forEach((key) => {
            if (key === 'type') {
                this['weaponType'] = values[key];
            } else {
                this[key] = values[key];
            }
        });
    };

    getValues = () => {
        let values = {};
        EncounterWeapon.weaponFields.forEach((field) => {
            if (field === 'weaponType') {
                values['type'] = this[field];
            } else {
                values[field] = this[field];
            }
        });

        return values;
    };

    /**
      * Serialize the current item to a plain JSON format. We use these in-leiu of the normal
      * import/exportValues because those return a format unsuitable for re-importing
      * (since it caused data corruption).
     */
    toJSON = () => {
        let values = {};
        EncounterWeapon.allFields.forEach((field) => {
            values[field] = this[field]();
        });

        return values;
    };

    /**
      * De-serialize the current item into the current model. We use these in-leiu of the normal
      * import/exportValues because those return a format unsuitable for re-importing
      * (since it caused data corruption).
     */
    fromJSON = (values) => {
        EncounterWeapon.allFields.forEach((field) => {
            this[field](values[field]);
        });
    };
}
