'use strict';

function PlayerInfoViewModel() {
    var self = this;

    self.playerInfo = ko.observable(new PlayerInfo());

    self.init = function() {
        Notifications.global.save.add(function() {
            self.playerInfo().save();
        });
    };

    self.load = function() {
        var info = PlayerInfo.findBy(CharacterManager.activeCharacter().key());
        if (info.length > 0) {
            self.playerInfo(info[0]);
        } else {
            self.playerInfo(new PlayerInfo());
        }
        self.playerInfo().characterId(CharacterManager.activeCharacter().key());
        //Subscriptions
        self.playerInfo().email.subscribe(self.dataHasChanged);
    };

    self.unload = function() {
        self.playerInfo().save();
    };

    self.dataHasChanged = function() {
        self.playerInfo().save();
        Notifications.playerInfo.changed.dispatch();
    };

    //Public Methods

    self.clear = function() {
        self.playerInfo().clear();
    };

}
