import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications, Utility } from 'charactersheet/utilities';
import ko from 'knockout';


export class Image extends KOModel {

    static __skeys__ = ['core', 'images'];

    static __dependents__ = [
        'Image',
        'NPC',
        'PlayerText',
        'PointOfInterest',
        'Monster',
        'EncounterImage',
        'Environment',
    ];

    static mapping = {
        include: [
            'coreUuid',
            'description',
            'name',
            'sourceUrl',
            'isExhibited',
            'playerText',
        ]
    };

    coreUuid = ko.observable(null);
    name = ko.observable();
    description = ko.observable();
    sourceUrl = ko.observable();
    playerText = ko.observable();
    isExhibited = ko.observable();

    shortDescription = ko.pureComputed(() => {
        try {
            return Utility.string.truncateStringAtLength(this.description(), 100);
        } catch(e) {
            // Ignore
        }
    });

    // Helpers

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.image.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.image.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.image.deleted.dispatch(this);
    }
}

Image.validationConstraints = {
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
