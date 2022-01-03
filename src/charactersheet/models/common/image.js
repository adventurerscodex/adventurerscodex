import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications, Utility } from 'charactersheet/utilities';
import ko from 'knockout';


export class EncounterImage extends KOModel {
    static __skeys__ = ['core', 'encounters', 'images'];
    static __dependents__ = ['Environment', 'Image', 'Monster'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'name', 'sourceUrl', 'description', 'isExhibited', 'playerText']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    name = ko.observable();
    playerText = ko.observable();
    description = ko.observable();
    sourceUrl = ko.observable();
    isExhibited = ko.observable(false);

    DESCRIPTION_MAX_LENGTH = 100;

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.DESCRIPTION_MAX_LENGTH);
    });

    convertedDisplayUrl = ko.pureComputed(() => (
        this.sourceUrl()
            ? Utility.string.createDirectDropboxLink(this.sourceUrl())
            : null
    ));

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.encounterimage.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.encounterimage.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.encounterimage.deleted.dispatch(this);
    }
}


EncounterImage.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        sourceUrl: {
            required: true,
            url: true,
            maxlength: 1024
        }
    },
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        sourceUrl: {
            required: true,
            url: true,
            maxlength: 1024
        }
    }
};
