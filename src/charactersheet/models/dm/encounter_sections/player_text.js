import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications, Utility } from 'charactersheet/utilities';
import ko from 'knockout';
import marked from 'bin/textarea-markdown-editor/marked.min';


export class PlayerText extends KOModel {

    static __skeys__ = ['core', 'encounters', 'readAloudText'];

    static __dependents__ = [
        'Image',
        'Environment',
        'NPC',
        'PointOfInterest',
        'Monster',
        'EncounterImage',
    ];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'name', 'description', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    isExhibited = ko.observable(false);
    name = ko.observable('');
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
        Notifications.playertext.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.playertext.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.playertext.deleted.dispatch(this);
    }
}

PlayerText.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        }
    },
    rules: {
        name: {
            required: true,
            maxlength: 256
        }
    }
};
