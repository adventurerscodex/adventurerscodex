'use strict';

function ConnectionManagerViewModel() {
    var self = this;

    self.connectionManager = ko.observable(new ConnectionManager());

    self.init = function() {
    };

    self.load = function() {
        var cm = ConnectionManager.findBy(
            CharacterManager.activeCharacter().key());
        cm.forEach(function(e,i,_) { e.delete(); });
        self.connectionManager().characterId(
            CharacterManager.activeCharacter().key());
    };

    self.unload = function() {
         self.connectionManager().connected(false);
         self.connectionManager().save();
    };

    self.leaveRoomButton = function() {
        if (connectionManager().connected) {
            connectionManager().leaveRoom();
        }
    };

};
