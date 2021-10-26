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
        include: ['coreUuid', 'quantity']
    }; // Not sure why quantity is required here, but without it
    // we cannot create a large 'quantity' of items
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

    calculatedCost = ko.pureComputed(() => {
        if (this.cost() &&
            this.cost() > 0 &&
            this.currencyDenomination() &&
            this.currencyDenomination() != '') {
            if (this.currencyDenomination().toLowerCase() === 'cp') {
                return parseInt(this.cost())/100;
            } else if (this.currencyDenomination().toLowerCase() === 'sp') {
                return parseInt(this.cost())/10;
            } else if (this.currencyDenomination().toLowerCase() === 'ep') {
                return parseInt(this.cost())/2;
            } else if (this.currencyDenomination().toLowerCase() === 'pp') {
                return parseInt(this.cost()) * 10;
            }
            return this.cost();
        }
        return 0;
    })

    totalCost = ko.pureComputed(() => {
        if (this.quantity() &&
            this.quantity() > 0 &&
            this.cost() &&
            this.cost() > 0) {
            return parseInt(this.quantity()) * parseInt(this.cost());
        }
        return 0;
    }, this);

    totalCalculatedCost = ko.pureComputed(() => {
        if (this.quantity() &&
            this.quantity() > 0 &&
            this.cost() &&
            this.cost() > 0 &&
            this.currencyDenomination() &&
            this.currencyDenomination() != '') {
            return parseInt(this.quantity()) * parseFloat(this.calculatedCost());
        }
        return 0;
    }, this);

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), Item.SHORT_DESCRIPTION_MAX_LENGTH);
    }, this);

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), Item.DESCRIPTION_MAX_LENGTH);
    }, this);

    itemDescriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }

        return this.description();
    }, this);

    weightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    }, this);

    totalWeightLabel = ko.pureComputed(() => {
        return  this.totalWeight() >= 0 ? this.totalWeight() + ' lbs.' : '0 lbs.';
    }, this);

    costLabel = ko.pureComputed(() => {
        return this.cost() !== '' ? this.cost() + ' ' + this.currencyDenomination() : '';
    }, this);

    totalCostLabel = ko.pureComputed(() => {
        return this.totalCost() !== '' ? this.totalCost() + ' ' + this.currencyDenomination() : '';
    }, this);

    totalCalculatedCostLabel = ko.pureComputed(() => {
        return this.totalCost() !== '' ? this.totalCalculatedCost() + ' GP': '';
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

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    async create () {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.item.added.dispatch(this);
    }

    async save () {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.item.changed.dispatch(this);
    }

    async delete () {
        await this.ps.delete();
        Notifications.item.deleted.dispatch(this);
    }

}

Item.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        quantity: {
            type:'number',
            pattern: '\\d*',
            min: 0,
            max: 1000000
        },
        weight: {
            // cannot have number filter, because it can be a decimal
            type:'number',
            step: '0.25',
            min: 0,
            max: 1000000
        },
        cost: {
            type:'number',
            pattern: '\\d*',
            min: 0,
            max: 100000000
        },
        currencyDenomination: {
            maxlength: 64
        }
    },
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
