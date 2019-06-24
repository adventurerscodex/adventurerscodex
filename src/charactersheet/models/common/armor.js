import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';


export class Armor extends KOModel {
    static __skeys__ = ['core', 'armors'];

    static mapping = {
        include: ['coreUuid', 'equipped', 'magicalModifier']
    };

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

    isShield = ko.pureComputed(() => {
        return this.type() && this.type().toLowerCase().includes('shield');
    }, this);

    acCalculatedLabel = ko.pureComputed(() => {
        if (this.armorClass()) {
            if (this.magicalModifier()) {
                return this.armorClass() + this.magicalModifier();
            }
            return  this.armorClass();
        }
        return '';
    })
    acLabel = ko.pureComputed(() => {
        if (this.armorClass()) {
            return 'AC ' + this.armorClass();
        }
        else {
            return '';
        }
    }, this);

    armorDescriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
        return this.description();
    }, this);

    magicalModifierLabel = ko.pureComputed(() => {
        const magicalModifier = this.magicalModifier();
        if (magicalModifier != 0) {
            return magicalModifier >= 0 ? ('+ ' + magicalModifier) : '- ' +
            Math.abs(magicalModifier);
        } else {
            return '';
        }
    }, this);

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
    }, this);

    applyMagicalModifierLabel = ko.pureComputed(() => {
        if (this.magicalModifierLabel() !== '' ) {
            return true;
        } else {
            return false;
        }
    }, this);

    armorWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    }, this);

    toSchemaValues = (values) => {
        if (values.price === '') {
            values.price = 0;
        }

        if (values.weight === '') {
            values.weight = 0;
        }

        if (values.magicalModifier === '') {
            values.magicalModifier = 0;
        }

        return values;
    }

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.armor.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.armor.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.armor.deleted.dispatch(this);
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
        weight: {
            type: 'number',
            step: '0.25',
            min: 0,
            max: 10000000
        },
        price: {
            type: 'number',
            min: 0,
            max: 10000000
        },
        magicalModifier: {
            type: 'number',
            min: -10000,
            max: 10000
        },
        currencyDenomination: {
            maxlength: 64
        },
        armorClass: {
            type: 'number',
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
