import {
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import autoBind from 'auto-bind';
import ko from 'knockout';

/**
 * Models an item in the user's backpack or something they
 * have equipped.
 */
export class Item extends KOModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }
    static __skeys__ = ['core', 'items'];

    static mapping = {
        include: ['coreUuid']
    };
    static SHORT_DESCRIPTION_MAX_LENGTH = 100;
    static DESCRIPTION_MAX_LENGTH = 200;

    coreUuid = ko.observable(null);
    name = ko.observable('');
    description = ko.observable('');
    quantity = ko.observable(1);
    weight = ko.observable(0);
    cost = ko.observable(0);
    currencyDenomination = ko.observable('');

    totalWeight = ko.pureComputed(() => {
        if (this.quantity() && this.weight()) {
            return parseInt(this.quantity()) * parseFloat(this.weight());
        }
        return 0;
    }, this);

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), Item.SHORT_DESCRIPTION_MAX_LENGTH);
    }, this);

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), Item.DESCRIPTION_MAX_LENGTH);
    }, this);

    descriptionHTML = ko.pureComputed(() => {
        if (this.description()) {
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    }, this);

    weightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    }, this);

    costLabel = ko.pureComputed(() => {
        return this.cost() !== '' ? this.cost() + ' ' + this.currencyDenomination() : '';
    }, this);

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

    notify () {
        Notifications.item.changed.dispatch(this.uuid());
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
