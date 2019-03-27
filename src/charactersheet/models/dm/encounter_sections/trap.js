import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';


export class Trap extends KOModel {
    static __skeys__ = ['core', 'encounters', 'traps'];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static mapping = {
        include: [
            'coreUuid',
            'encounterUuid',
            'uuid',
            'name',
            'threat',
            'trigger',
            'effect',
            'countermeasure',
            'description',
            'initiative',
            'activeElements',
            'dynamicElements',
            'constantElements',
            'isActive',
        ]
    };

    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    uuid = ko.observable();

    name = ko.observable();
    threat = ko.observable();
    trigger = ko.observable();
    effect = ko.observable();
    countermeasure = ko.observable();
    description = ko.observable();
    initiative = ko.observable();
    activeElements = ko.observable();
    dynamicElements = ko.observable();
    constantElements = ko.observable();
    isActive = ko.observable(true);

    /* UI Methods */

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.description(),
            this.LONG_DESCRIPTION_MAX_LENGTH
        );
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(
            this.description(),
            this.SHORT_DESCRIPTION_MAX_LENGTH
        );
    });
}

Trap.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        }
    }
};
