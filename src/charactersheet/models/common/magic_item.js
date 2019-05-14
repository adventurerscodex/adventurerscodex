import {
    Fixtures,
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

    magicItemTypeOptions = ko.observableArray(Fixtures.magicItem.magicItemTypeOptions);
    magicItemRarityOptions = ko.observableArray(Fixtures.magicItem.magicItemRarityOptions);

    chargesDisplay = ko.pureComputed(() => {
        if (this.maxCharges() == 0) {
            return 'N/A';
        } else {
            return this.usedCharges();
        }
    });

    magicItemDescriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }

        return this.description();
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.DESCRIPTION_MAX_LENGTH);
    });

    magicItemNameLabel = ko.pureComputed(() => {
        if (this.attuned() === true) {
            return (this.name() + ' (Attuned)' );
        } else {
            return this.name();
        }
    });

    magicItemWeightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    toSchemaValues = (values) => {
        if (values.maxCharges === '') {
            values.maxCharges = 0;
        }

        if (values.weight === '') {
            values.weight = 0;
        }

        return values;
    }
}

MagicItem.validationConstraints = {
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
