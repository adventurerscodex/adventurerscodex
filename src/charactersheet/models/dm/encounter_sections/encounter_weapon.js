import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import { Weapon } from 'charactersheet/models/common';
import ko from 'knockout';


export class EncounterWeapon extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    SHORT_DESCRIPTION_MAX_LENGTH = 100;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();
    weapon = ko.observable(new Weapon());

    nameLabel = ko.pureComputed(() => {
        return this.weapon().name();
    });

    propertyLabel = ko.pureComputed(() => {
        return this.weapon().damage() ? this.weapon().damage() : '';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.shortDescription();
    });

    // UI Methods
    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.weapon().description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });
}