import { Armor } from 'charactersheet/models/common';
import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';
import { pick } from 'lodash';

export class EncounterArmor extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    SHORT_DESCRIPTION_MAX_LENGTH = 100;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();
    armor = ko.observable(new Armor());

    nameLabel = ko.pureComputed(() => {
        return this.armor().name();
    });

    propertyLabel = ko.pureComputed(() => {
        return this.armor().armorClass() ? this.armor().acLabel() : '';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.shortDescription();
    });

    // UI Methods
    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.armor().description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    clean = (keys, params) => {
        let treasure = pick(params, EncounterArmor.mapping.include);
        treasure.value = params.armor;
        return treasure;
    };
}