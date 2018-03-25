import { CoreManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Treasure } from 'charactersheet/models/common';
import cpCoins from 'images/cp-coin.svg';
import epCoins from 'images/ep-coin.svg';
import gpCoins from 'images/gp-coin.svg';
import ko from 'knockout';
import ppCoins from 'images/pp-coin.svg';
import spCoins from 'images/sp-coin.svg';
import template from './index.html';

export function TreasureViewModel() {
    var self = this;

    self.ppCoins = ppCoins;
    self.gpCoins = gpCoins;
    self.epCoins = epCoins;
    self.spCoins = spCoins;
    self.cpCoins = cpCoins;

    self.treasure = ko.observable(new Treasure());

    self.load = function() {
        Notifications.global.save.add(self.save);

        var existingTreasure = PersistenceService.findFirstBy(Treasure, 'characterId',
            CoreManager.activeCore().uuid());

        if (existingTreasure) {
            self.treasure(existingTreasure);
        }
        self.treasure().characterId(CoreManager.activeCore().uuid());

        //Notifications
        self.treasure().platinum.subscribe(self._dataHasChanged);
        self.treasure().gold.subscribe(self._dataHasChanged);
        self.treasure().electrum.subscribe(self._dataHasChanged);
        self.treasure().silver.subscribe(self._dataHasChanged);
        self.treasure().copper.subscribe(self._dataHasChanged);
    };

    self.unload = function() {
        self.treasure().save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.treasure().save();
    };

    self.clear = function() {
        self.treasure().clear();
    };

    /* Private Methods */

    self._dataHasChanged = function() {
        self.treasure().save();
        Notifications.treasure.changed.dispatch();
    };
}

ko.components.register('treasure', {
    viewModel: TreasureViewModel,
    template: template
});