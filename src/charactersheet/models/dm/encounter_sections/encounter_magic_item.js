import { Fixtures } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';


export class EncounterMagicItem extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    static magicItemFields = ['name', 'magicItemType', 'rarity', 'requiresAttunement', 'attuned', 'maxCharges', 'usedCharges', 'weight', 'description'];

    static allFields = ['name', 'magicItemType', 'rarity', 'requiresAttunement', 'attuned', 'maxCharges', 'usedCharges', 'weight', 'description', 'uuid', 'coreUuid', 'encounterUuid', 'type'];

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

    magicItemTypeOptions = ko.observableArray(Fixtures.magicItem.magicItemTypeOptions);
    magicItemRarityOptions = ko.observableArray(Fixtures.magicItem.magicItemRarityOptions);

    nameLabel = ko.pureComputed(() => {
        return this.name();
    });

    propertyLabel = ko.pureComputed(() => {
        return this.magicItemType() ? this.magicItemType() : '';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.shortDescription();
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

    clean = (keys, params) => {
        let treasure = pick(params, EncounterMagicItem.mapping.include);
        treasure.value = pick(params, EncounterMagicItem.magicItemFields);
        return treasure;
    };

    buildModelFromValues = (values) => {
        let keys = Object.keys(values);
        keys.forEach((key) => {
            if (key === 'type') {
                this['magicItemType'] = values[key];
            } else {
                this[key] = values[key];
            }
        });
    };

    getValues = () => {
        let values = {};
        EncounterMagicItem.magicItemFields.forEach((field) => {
            if (field === 'magicItemType') {
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
        EncounterMagicItem.allFields.forEach((field) => {
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
        EncounterMagicItem.allFields.forEach((field) => {
            this[field](values[field]);
        });
    };
}
