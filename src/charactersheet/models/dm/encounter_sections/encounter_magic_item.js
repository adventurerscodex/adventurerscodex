import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';


export class EncounterMagicItem extends KOModel {

    static __skeys__ = ['core', 'encounters', 'treasures'];

    static mapping = {
        include: [
            'coreUuid',
            'encounterUuid',
            'type',
            'uuid',
            'name',
            'magicItemType',
            'rarity',
            'requiresAttunement',
            'attuned',
            'maxCharges',
            'usedCharges',
            'weight',
            'description'
        ]
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();

    // Magic Item Fields

    name = ko.observable('');
    magicItemType = ko.observable('');
    rarity = ko.observable('');
    requiresAttunement = ko.observable(false);
    attuned = ko.observable(false);
    maxCharges = ko.observable(0);
    usedCharges = ko.observable(0);
    weight = ko.observable(0);
    description = ko.observable('');
    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    DESCRIPTION_MAX_LENGTH = 200;

    propertyLabel = ko.pureComputed(() => {
        return this.magicItemType() ? this.magicItemType() : '';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.shortDescription();
    });

    descriptionHTML = ko.pureComputed(() => {
        if (!this.description()) {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }

        return this.description();
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    weightLabel = ko.pureComputed(() => {
        return this.weight() !== '' && this.weight() >= 0 ? this.weight() + ' lbs.' : '0 lbs.';
    });

    clean = (keys, params) => {
        let treasure = pick(params, EncounterMagicItem.mapping.include);
        treasure.value = pick(params, EncounterMagicItem.magicItemFields);
        return treasure;
    };
}


EncounterMagicItem.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256,
        },
        type: {
            required: true,
            maxlength: 256,
        },
        rarity: {
            required: true,
            maxlength: 256,
        },
        maxCharges: {
            required: true,
            type: 'number',
            max: 10000,
            min: -10000,
            step: 1,
        },
        usedCharges: {
            required: true,
            type: 'number',
            max: 10000,
            min: -10000,
            step: 1,
        },
        weight: {
            required: true,
            type: 'number',
            max: 10000,
            min: -10000,
            step: 1,
        },
        description: {
            required: false,
            type: 'text',
        },
    },
};
