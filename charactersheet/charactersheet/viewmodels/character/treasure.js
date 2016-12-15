'use strict';

function TreasureViewModel() {
    var self = this;

    self.treasure = ko.observable(new Treasure());

    self.init = function() {
        Notifications.global.save.add(function() {
            self.treasure().save();
        });
    };

    self.load = function() {
        var t = Treasure.findBy(CharacterManager.activeCharacter().key());
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
