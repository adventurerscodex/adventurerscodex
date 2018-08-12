import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';

export class Treasure extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    SHORT_DESCRIPTION_MAX_LENGTH = 100;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();
    value = {};
}