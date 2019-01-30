import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';

import ko from 'knockout';


export class Armor extends KOModel {
    static __skeys__ = ['core', 'armors'];

    static mapping = {
        include: ['coreUuid', 'equipped', 'magicalModifier']
    };

    _dummy = ko.observable(null);
    coreUuid = ko.observable(null);
    name = ko.observable('');
    type = ko.observable('');
    price = ko.observable('');
    magicalModifier = ko.observable(0);
    currencyDenomination = ko.observable('');
    weight = ko.observable('');
    armorClass = ko.observable('');
    stealth = ko.observable('Normal');
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
        if (this.description()) {
            return this.description().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    magicalModifierLabel = ko.pureComputed(() => {
        this._dummy();

        var magicalModifier = this.magicalModifier();
        if (magicalModifier != 0) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
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

    applyMagicalModifierLabel = ko.pureComputed(() => {
        if (this.magicalModifierLabel() !== '' ) {
            return true;
        } else {
            return false;
        }
    });

    armorWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    updateValues = () => {
        this._dummy.notifySubscribers();
    };

    toSchemaValues = (values) => {
        if (values.price === '') {
            values.price = 0;
        }

        if (values.weight === '') {
            values.weight = 0;
        }

        return values;
    }
}

Armor.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            required: true,
            maxlength: 64
        },
        price: {
            min: 0,
            max: 10000000
        },
        magicalModifier: {
            min: -10000,
            max: 10000
        },
        currencyDenomination: {
            maxlength: 64
        },
        armorClass: {
            required: true,
            min: 0,
            max: 1000000
        },
        stealth: {
            maxlength: 64,
            required: true
        }
    }
};
