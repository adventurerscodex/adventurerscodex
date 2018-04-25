import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
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

    self.load = async () => {
        var key = CoreManager.activeCore().uuid();
        const response = await Wealth.ps.read({uuid: key});
        self.wealth(response.object);

        //Notifications
        self.wealth().platinum.subscribe(self._dataHasChanged);
        self.wealth().gold.subscribe(self._dataHasChanged);
        self.wealth().electrum.subscribe(self._dataHasChanged);
        self.wealth().silver.subscribe(self._dataHasChanged);
        self.wealth().copper.subscribe(self._dataHasChanged);
    };

    self.save = function() {
        self.wealth().save();
    };

    self.clear = function() {
        self.wealth().clear();
    };

    /* Private Methods */

    self._dataHasChanged = function() {
        self.wealth().save();
        Notifications.wealth.changed.dispatch();
    };
}

ko.components.register('wealth', {
    viewModel: WealthViewModel,
    template: template
});