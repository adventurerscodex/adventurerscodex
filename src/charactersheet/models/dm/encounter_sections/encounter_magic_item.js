import { KOModel } from 'hypnos/lib/models/ko';
import { MagicItem } from 'charactersheet/models/common/magic_item';
import ko from 'knockout';


export class EncounterMagicItem extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();
    magicItem = ko.observable(new MagicItem());

    nameLabel = ko.pureComputed(() => {
        return this.magicItem().name();
    });

    propertyLabel = ko.pureComputed(() => {
        return this.magicItem().type() ? this.magicItem().type() : '';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.magicItem().shortDescription();
    });
}