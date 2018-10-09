import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';
import { pick } from 'lodash';

export class EncounterArmor extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    SHORT_DESCRIPTION_MAX_LENGTH = 100;

    static mapping = {
        include: ['uuid', 'coreUuid', 'encounterUuid', 'type']
    };

    static armorFields = ['name', 'armorType', 'description', 'magicalModifier', 'weight', 'price', 'currencyDenomination', 'armorClass', 'stealth', 'equipped'];

    static allFields = ['name', 'armorType', 'description', 'magicalModifier', 'weight', 'price', 'currencyDenomination', 'armorClass', 'stealth', 'equipped', 'uuid', 'coreUuid', 'encounterUuid', 'type'];

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();

    // Armor fields
    name = ko.observable('');
    armorType = ko.observable('');
    price = ko.observable('');
    magicalModifier = ko.observable(0);
    currencyDenomination = ko.observable('');
    weight = ko.observable('');
    armorClass = ko.observable('');
    stealth = ko.observable('');
    description = ko.observable('');
    equipped = ko.observable(false);

    armorTypeOptions = ko.observableArray(Fixtures.armor.armorTypeOptions);
    armorStealthOptions = ko.observableArray(Fixtures.armor.armorStealthOptions);
    armorCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;

    acLabel = ko.pureComputed(() => {
        if (this.armorClass()) {
            return 'AC ' + this.armorClass();
        }
        else {
            return '';
        }
    });

    armorDescriptionHTML = ko.pureComputed(() => {
        if (this.description()){
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    armorSummaryLabel = ko.pureComputed(() => {
        if (this.magicalModifier() != 0) {
            if (this.acLabel()) {
                return this.magicalModifierLabel() + ', ' + this.acLabel();
            } else {
                return this.magicalModifierLabel();
            }
        } else {
            return this.acLabel();
        }
    });

    magicalModifierLabel = ko.pureComputed(() => {
        var magicalModifier = this.magicalModifier();
        if (magicalModifier != 0) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    });

    armorWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    nameLabel = ko.pureComputed(() => {
        return this.name();
    });

    propertyLabel = ko.pureComputed(() => {
        return this.armorClass() ? this.acLabel() : '';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.shortDescription();
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    clean = (keys, params) => {
        let treasure = pick(params, EncounterArmor.mapping.include);
        treasure.value = pick(params, EncounterArmor.armorFields);
        return treasure;
    };

    buildModelFromValues = (values) => {
        let keys = Object.keys(values);
        keys.forEach((key) => {
            if (key === 'type') {
                this['armorType'] = values[key];
            } else {
                this[key] = values[key];
            }
        });
    };

    getValues = () => {
        let values = {};
        EncounterArmor.armorFields.forEach((field) => {
            if (field === 'armorType') {
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
        EncounterArmor.allFields.forEach((field) => {
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
        EncounterArmor.allFields.forEach((field) => {
            this[field](values[field]);
        });
    };
}