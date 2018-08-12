import {
    Fixtures,
    Utility
} from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class EncounterItem extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    static itemFields = ['name', 'description', 'quantity', 'weight', 'cost', 'currencyDenomination'];

    static allFields = ['name', 'description', 'quantity', 'weight', 'cost', 'currencyDenomination', 'uuid', 'coreUuid', 'encounterUuid', 'type'];

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();

    // Item Fields
    name = ko.observable('');
    description = ko.observable('');
    quantity = ko.observable(1);
    weight = ko.observable(0);
    cost = ko.observable(0);
    currencyDenomination = ko.observable('');

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    DESCRIPTION_MAX_LENGTH = 200;
    itemCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;

    nameLabel = ko.pureComputed(() => {
        return this.name();
    });

    propertyLabel = ko.pureComputed(() => {
        return 'N/A';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.shortDescription();
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    itemDescriptionHTML = ko.pureComputed(() => {
        if (this.description()) {
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    itemWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    clean = (keys, params) => {
        let treasure = pick(params, EncounterItem.mapping.include);
        treasure.value = pick(params, EncounterItem.itemFields);
        return treasure;
    };

    buildModelFromValues = (values) => {
        let keys = Object.keys(values);
        keys.forEach((key) => {
            this[key] = values[key];
        });
    };

    getValues = () => {
        let values = {};
        EncounterItem.itemFields.forEach((field) => {
            values[field] = this[field];
        });

        return values;
    };

    customExportValues = () => {
        let values = {};
        EncounterItem.allFields.forEach((field) => {
            values[field] = this[field]();
        });

        return values;
    };

    customImportValues = (values) => {
        EncounterItem.allFields.forEach((field) => {
            this[field](values[field]);
        });
    };
}