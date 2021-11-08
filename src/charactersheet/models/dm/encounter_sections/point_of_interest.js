import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';


export class PointOfInterest extends KOModel {
    static __skeys__ = ['core', 'encounters', 'pointsOfInterest'];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'name', 'sourceUrl', 'playerText', 'description', 'uuid']
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

    // Message Serialization Methods

    toHTML = function() {
        return 'New Point of Interest';
    };

    toJSON = function() {
        return {
            name: this.name(),
            url: this.sourceUrl(),
            description: this.playerText()
        };
    };
}

PointOfInterest.validationConstraints = {
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
