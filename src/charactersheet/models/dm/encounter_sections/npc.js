import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';


export class NPC extends KOModel {
    static __skeys__ = ['core', 'encounters', 'npcs'];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'name', 'race', 'description', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    uuid = ko.observable();
    name = ko.observable('');
    race = ko.observable('');
    description = ko.observable('');

    // UI Methods

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.LONG_DESCRIPTION_MAX_LENGTH);
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });
}

NPC.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 128
        },
        race: {
            maxlength: 64
        }
    }
};
