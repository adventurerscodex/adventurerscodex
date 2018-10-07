import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { Wealth } from 'charactersheet/models/common';
import cpCoins from 'images/cp-coin.svg';
import epCoins from 'images/ep-coin.svg';
import gpCoins from 'images/gp-coin.svg';
import ko from 'knockout';
import ppCoins from 'images/pp-coin.svg';
import spCoins from 'images/sp-coin.svg';
import template from './index.html';

export function WealthViewModel() {
    var self = this;

    self.ppCoins = ppCoins;
    self.gpCoins = gpCoins;
    self.epCoins = epCoins;
    self.spCoins = spCoins;
    self.cpCoins = cpCoins;

    self.wealth = ko.observable(new Wealth());

    self.validation = {
        // Deep copy of properties in object
        ...Wealth.validationConstraints
    };

    self.load = async () => {
        await self.reset();
    };

    self.reset = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Wealth.ps.read({uuid: key});
        self.wealth(response.object);
    };

    self.save = async() => {
        const response = await self.wealth().ps.save();
        self.wealth(response.object);
        Notifications.wealth.changed.dispatch();
    };
}

ko.components.register('wealth', {
    viewModel: WealthViewModel,
    template: template
});
