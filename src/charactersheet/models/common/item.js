import {
    Fixtures,
    Utility
} from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import ko from 'knockout';

/**
 * Models an item in the user's backpack or something they
 * have equipped.
 */
export class Item extends KOModel {
    static __skeys__ = ['core', 'items'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    description = ko.observable('');
    quantity = ko.observable(1);
    weight = ko.observable(0);
    cost = ko.observable(0);
    currencyDenomination = ko.observable('');

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    DESCRIPTION_MAX_LENGTH = 200;
    itemCurrencyDenominationOptions = Fixtures.general.currencyDenominationList;

    totalWeight = ko.pureComputed(() => {
        if (this.quantity() && this.weight()) {
            return parseInt(this.quantity()) * parseFloat(this.weight());
        }
        return 0;
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.DESCRIPTION_MAX_LENGTH);
    });

    itemDescriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }

        return this.description();
    });

    itemWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    costLabel = ko.pureComputed(() => {
        return this.cost() !== '' ? this.cost() + ' ' + this.currencyDenomination() : '';
    });

    toSchemaValues = (values) => {
        if (values.cost === '') {
            values.cost = 0;
        }

        if (values.quantity === '') {
            values.quantity = 0;
        }

        if (values.weight === '') {
            values.weight = 0;
        }

        return values;
    }
}

Item.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        quantity: {
            number: true,
            min: 0,
            max: 1000000
        },
        weight: {
            number: true,
            min: 0,
            max: 1000000
        },
        cost: {
            number: true,
            min: 0,
            max: 100000000
        },
        currencyDenomination: {
            maxlength: 64
        }
    }
};
