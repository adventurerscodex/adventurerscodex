import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities';
import ko from 'knockout';


export class EncounterImage extends KOModel {
    static __skeys__ = ['core', 'encounters', 'images'];
    static __dependents__ = ['Environment', 'Image', 'Monster'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'name', 'sourceUrl', 'description', 'isExhibited', 'playerText']
    };

    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    name = ko.observable();
    playerText = ko.observable();
    description = ko.observable();
    sourceUrl = ko.observable();
    isExhibited = ko.observable(false);

    DESCRIPTION_MAX_LENGTH = 100;

    // Public Methods

    toJSON = function() {
        return {
            name: this.name(),
            url: this.sourceUrl(),
            description: this.playerText()
        };
    };

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.DESCRIPTION_MAX_LENGTH);
    });

    /* Message Methods */

    toHTML = function() {
        return 'New image in chat';
    };
}

EncounterImage.validationConstraints = {
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
