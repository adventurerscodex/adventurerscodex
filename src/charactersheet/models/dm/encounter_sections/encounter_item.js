import { Item } from 'charactersheet/models/common';
import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class EncounterItem extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();
    item = ko.observable(new Item());

    nameLabel = ko.pureComputed(() => {
        return this.item().name();
    });

    propertyLabel = ko.pureComputed(() => {
        return 'N/A';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.item().shortDescription();
    });
}