import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications, Utility } from 'charactersheet/utilities';
import ko from 'knockout';


export class NPC extends KOModel {
    static __skeys__ = ['core', 'encounters', 'npcs'];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static __dependents__ = [
        'Image',
        'Environment',
        'PlayerText',
        'PointOfInterest',
        'Monster',
        'EncounterImage',
    ];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'name', 'race', 'sourceUrl', 'playerText', 'description', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    uuid = ko.observable();
    name = ko.observable('');
    race = ko.observable('');
    sourceUrl = ko.observable();
    isExhibited = ko.observable(false);
    playerText = ko.observable();
    description = ko.observable('');

    // UI Methods

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.LONG_DESCRIPTION_MAX_LENGTH);
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    // Helpers

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.npc.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.npc.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.npc.deleted.dispatch(this);
    }
}

NPC.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        race: {
            maxlength: 64
        },
        sourceUrl: {
            url: true,
            maxlength: 1024
        }
    },
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        race: {
            maxlength: 64
        },
        sourceUrl: {
            url: true,
            maxlength: 1024
        }
    }
};
