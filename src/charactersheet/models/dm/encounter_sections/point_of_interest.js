import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications, Utility } from 'charactersheet/utilities';
import ko from 'knockout';


export class PointOfInterest extends KOModel {

    static __skeys__ = ['core', 'encounters', 'pointsOfInterest'];

    static __dependents__ = [
        'Image',
        'Environment',
        'NPC',
        'PlayerText',
        'Monster',
        'EncounterImage',
    ];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static mapping = {
        include: [
            'coreUuid',
            'encounterUuid',
            'name',
            'sourceUrl',
            'playerText',
            'description',
            'uuid',
        ]
    };

    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    uuid = ko.observable();
    name = ko.observable('');
    playerText = ko.observable();
    sourceUrl = ko.observable();
    isExhibited = ko.observable(false);
    difficultyCheckValue = ko.observable();
    difficultyCheckSkill = ko.observable();
    description = ko.observable('');

    // UI Methods

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.LONG_DESCRIPTION_MAX_LENGTH);
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    convertedDisplayUrl = ko.pureComputed(() => (
        Utility.string.createDirectDropboxLink(this.sourceUrl())
    ));

    // Helpers

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.pointofinterest.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.pointofinterest.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.pointofinterest.deleted.dispatch(this);
    }
}

PointOfInterest.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        sourceUrl: {
            url: true,
            requred: false,
            maxlength: 1024
        }
    },
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        sourceUrl: {
            url: true,
            maxlength: 1024
        }
    }
};
