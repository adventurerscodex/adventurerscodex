import {
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { KOModel } from 'hypnos';
import ko from 'knockout';


export class MagicItem extends KOModel {
    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    DESCRIPTION_MAX_LENGTH = 145;

    static __skeys__ = ['core', 'magicItems'];

    static mapping = {
        include: ['coreUuid', 'maxCharges', 'usedCharges']
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    type = ko.observable('');
    rarity = ko.observable('');
    requiresAttunement = ko.observable(false);
    attuned = ko.observable(false);
    maxCharges = ko.observable(0);
    usedCharges = ko.observable(0);
    weight = ko.observable(0);
    description = ko.observable('');

    chargesDisplay = ko.pureComputed(() => {
        if (this.maxCharges() == 0) {
            return '-';
        } else {
            return this.usedCharges();
        }
    }, this);

    magicItemDescriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
        return this.description();
    }, this);

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    }, this);

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.DESCRIPTION_MAX_LENGTH);
    }, this);

    magicItemWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    }, this);

    cardBackground = ko.pureComputed(()=> {
        if (this.type()) {
            return this.type().split(' ')[0].toLowerCase() + '-magic-item-card';
        }
        return '';
    }, this);

    toSchemaValues = (values) => {
        if (values.maxCharges === '') {
            values.maxCharges = 0;
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

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.magicitem.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.magicitem.changed.dispatch(this);
        return response.object;
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.magicitem.deleted.dispatch(this);
    }

}

MagicItem.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            required: true,
            maxlength: 64
        },
        rarity: {
            required: true,
            maxlength: 64
        },
        maxCharges: {
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 10000
        },
        usedCharges: {
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 10000
        },
        weight: {
            type: 'number',
            step: '0.25',
            min: 0,
            max: 1000000
        }
    },
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        type: {
            required: true,
            maxlength: 64
        },
        rarity: {
            required: true,
            maxlength: 64
        },
        maxCharges: {
            number: true,
            min: 0,
            max: 10000
        },
        usedCharges: {
            number: true,
            min: 0,
            max: 10000
        },
        weight: {
            number: true,
            min: 0,
            max: 1000000
        }
    }
};
