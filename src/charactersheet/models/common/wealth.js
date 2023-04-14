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

    // The amount of copper each coin is worth.
    EXCHANGE_RATES = {
        copper: 1,
        silver: 10,
        electrum: 50,
        gold: 100,
        platinum: 1000,
    };

    worthInGold = () => ((this.worthInCopper() / this.EXCHANGE_RATES.gold) | 0);

    worthInCopper = () => {
        return Object.keys(this.EXCHANGE_RATES).map(denomination => (
            this[denomination]() * this.EXCHANGE_RATES[denomination]
        )).reduce((a, b) => a+b, 0);
    };

    // This came from here. I can't take credit for it.
    // https://stackoverflow.com/questions/53695215/coin-change-algorithm-js
    getChange(credit) {
        const denominations = ['copper', 'silver', 'electrum', 'gold', 'platinum'].map(
            k => ({ denomination: k, value: this.EXCHANGE_RATES[k] })
        );
        let result = [];
        while (credit > 0) {
            const coin = denominations.pop(); // Get next greatest coin
            const count = Math.floor(credit / coin.value); // See how many times I need that coin
            credit -= count * coin.value; // Reduce the amount with that number of coins
            if (count) {
                result.push([coin.denomination, count]); // Store count & coin
            }
        }
        return result;
    }

    subtract = (amount, denomination) => {
        // If we can just take from the correct category, then just do that...
        if (amount <= this[denomination]()) {
            this[denomination](
                this[denomination]() - amount
            );
        } else {
            const coins = ['platinum', 'gold', 'electrum', 'silver', 'copper'];
            let debt = this.EXCHANGE_RATES[denomination] * amount;

            // Then we need to convert down to the money we need...

            for (let i = 0; i < coins.length; i++) {
                const coin = coins[i];
                const coinValue = (this[coin]() * this.EXCHANGE_RATES[coin]) | 0;

                if (debt > 0 && coinValue > 0) {
                    debt -= coinValue;
                    this[coin](0);
                }
            }

            if (debt < 0) {
                const credit = -debt;

                // Now make change for the amount we over-spent
                const change = this.getChange(credit);

                change.forEach(([coin, count]) => {
                    this[coin](this[coin]() + count);
                });
            }
        }
    };

    add = (amount, denomination) => {
        // If we can just take from the correct category, then just do that...        
        this[denomination](this[denomination]() + amount);
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
