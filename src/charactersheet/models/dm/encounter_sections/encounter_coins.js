import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class EncounterCoins extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    static wealthFields = ['platinum', 'gold', 'electrum', 'silver', 'copper'];

    static allFields = ['coreUuid', 'encounterUuid', 'type', 'uuid', 'platinum', 'gold', 'electrum', 'silver', 'copper'];

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();

    // Wealth
    platinum = ko.observable(0);
    gold = ko.observable(0);
    electrum = ko.observable(0);
    silver = ko.observable(0);
    copper = ko.observable(0);

    nameLabel = ko.pureComputed(() => {
        return 'Coins';
    });

    propertyLabel = ko.pureComputed(() => {
        return 'N/A';
    });

    descriptionLabel = ko.pureComputed(() => {
        return this.worthInGold() ? this.worthInGold() + '(gp)' : '';
    });

    worthInGold = ko.computed(() => {
        const parsedPlatinum = parseInt(this.platinum()) || 0;
        const parsedGold = parseInt(this.gold()) || 0;
        const parsedElectrum = parseInt(this.electrum()) || 0;
        const parsedSilver = parseInt(this.silver()) || 0;
        const parsedCopper = parseInt(this.copper()) || 0;

        const copperToSilver = Math.floor(parsedCopper / 10);
        const adjSilver = parsedSilver + copperToSilver;

        const silverToElectrum = Math.floor(adjSilver / 5);
        const adjElectrum = parsedElectrum + silverToElectrum;

        const electrumToGold = Math.floor(adjElectrum / 2);
        const adjGold = parsedGold + electrumToGold;

        const platinumToGold = parsedPlatinum * 10;

        const total = platinumToGold + adjGold;

        return total;
    });

    totalWeight = ko.pureComputed(() => {
        var weight = 0;

        weight += this.platinum() ? parseInt(this.platinum()) : 0;
        weight += this.gold() ? parseInt(this.gold()) : 0;
        weight += this.electrum() ? parseInt(this.electrum()) : 0;
        weight += this.silver() ? parseInt(this.silver()) : 0;
        weight += this.copper() ? parseInt(this.copper()) : 0;

        weight = Math.floor(weight / 50);

        return weight;
    });

    totalWeightLabel = ko.pureComputed(() => {
        return this.totalWeight() + ' (lbs)';
    });

    clean = (keys, params) => {
        let treasure = pick(params, EncounterCoins.mapping.include);
        treasure.value = pick(params, EncounterCoins.wealthFields);
        return treasure;
    };

    buildModelFromValues = (values) => {
        let keys = Object.keys(values);
        keys.forEach((key) => {
            this[key] = values[key];
        });
    };

    getValues = () => {
        let values = {};
        EncounterCoins.wealthFields.forEach((field) => {
            values[field] = this[field];
        });

        return values;
    };

    customExportValues = () => {
        let values = {};
        EncounterCoins.allFields.forEach((field) => {
            values[field] = this[field]();
        });

        return values;
    };

    customImportValues = (values) => {
        EncounterCoins.allFields.forEach((field) => {
            this[field](values[field]);
        });
    }
}