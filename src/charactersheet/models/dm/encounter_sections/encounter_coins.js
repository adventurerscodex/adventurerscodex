import { KOModel } from 'hypnos/lib/models/ko';
import { Wealth } from 'charactersheet/models/common';
import ko from 'knockout';


export class EncounterCoins extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();
    coins = ko.observable(new Wealth());

    nameLabel = ko.pureComputed(() => {
        return 'Coins';
    });

    propertyLabel = ko.pureComputed(() => {
        return 'N/A';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.coins().worthInGold() ? this.coins().worthInGold() + '(gp)' : '';
    });
}