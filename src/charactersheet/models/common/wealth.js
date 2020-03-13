import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';

export class Wealth extends KOModel {
    static __skeys__ = ['core', 'characters', 'wealth'];

    static mapping = {
        include: ['coreUuid'],
        ignore: ['worthInGold']
    };

    coreUuid = ko.observable(null);
    platinum = ko.observable(0);
    gold = ko.observable(0);
    electrum = ko.observable(0);
    silver = ko.observable(0);
    copper = ko.observable(0);

    worthInGold = () => {
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
    };

    worthInGoldLabel = ko.pureComputed(() => {
        return this.worthInGold() + ' (gp)';
    }, this);

    totalWeight = ko.pureComputed(() => {
        let weight = 0;

        weight += this.platinum() ? parseInt(this.platinum()) : 0;
        weight += this.gold() ? parseInt(this.gold()) : 0;
        weight += this.electrum() ? parseInt(this.electrum()) : 0;
        weight += this.silver() ? parseInt(this.silver()) : 0;
        weight += this.copper() ? parseInt(this.copper()) : 0;

        weight = Math.floor(weight / 50);

        return weight;
    }, this);

    totalWeightLabel = ko.pureComputed(() => {
        return this.totalWeight() + ' (lbs)';
    }, this);

    toSchemaValues = (values) => {
        if (values.platinum === '') {
            values.platinum = 0;
        }
        if (values.gold === '') {
            values.gold = 0;
        }
        if (values.electrum === '') {
            values.electrum = 0;
        }
        if (values.silver === '') {
            values.silver = 0;
        }
        if (values.copper === '') {
            values.copper = 0;
        }

        return values;
    }

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
        return response.object;
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.wealth.changed.dispatch(this);
    }
}

Wealth.validationConstraints = {
    fieldParams: {
        platinum: {
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 100000000,
            required: true
        },
        gold: {
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 100000000,
            required: true
        },
        silver: {
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 100000000,
            required: true
        },
        copper: {
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 100000000,
            required: true
        },
        electrum: {
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 100000000,
            required: true
        }
    },
    rules: {
        platinum: {
            number: true,
            min: 0,
            max: 100000000,
            required: true
        },
        gold: {
            number: true,
            min: 0,
            max: 100000000,
            required: true
        },
        silver: {
            number: true,
            min: 0,
            max: 100000000,
            required: true
        },
        copper: {
            number: true,
            min: 0,
            max: 100000000,
            required: true
        },
        electrum: {
            number: true,
            min: 0,
            max: 100000000,
            required: true
        }
    }
};
