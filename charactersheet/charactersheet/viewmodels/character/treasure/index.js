'use strict';

import ko from 'knockout'

import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { Treasure } from 'charactersheet/common/models'

import template from './index.html'

export function TreasureViewModel() {
    var self = this;

    self.treasure = ko.observable(new Treasure());

    self.load = function() {
        Notifications.global.save.add(self.save);

        var t = PersistenceService.findBy(Treasure, 'characterId',
            CharacterManager.activeCharacter().key());

        if (t.length > 0) {
            self.treasure(t[0]);
        } else {
            self.treasure(new Treasure());
        }
        self.treasure().characterId(CharacterManager.activeCharacter().key());

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
})