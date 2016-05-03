'use strict';

/**
 * A service that listens for new players from the PlayerService
 * and updates their stats.
 * 
 * @sends Notifications.playerSummaries.changed
 */
function PlayerSummaryService() {
    var self = this;
    
    self.playerSummaries = [];
    self.checkInterval = null;
    self.REFRESH_TIMER = 10000;

    self.init = function() {
        Notifications.connectedPlayers.playerEntered.add(self.whois);    
        Notifications.connectedPlayers.playerLeft.add(self.removePlayer);
        Notifications.profile.changed.add(self.whoami);   
        Notifications.stats.changed.add(self.whoami);       
        Notifications.playerImage.changed.add(self.whoami);       

        var character = CharacterManager.activeCharacter();
        messenger.subscribe('data', self._getWhoisId(character.key()), self.whoami);
        messenger.subscribe('data', 'iam', self.addPlayer);
        
        //Refresh the data every few seconds.
        self.checkInterval = setInterval(function() {
            players.inRoom.forEach(function(e, i, _) {
                self.whois(e);
            });
        }, self.REFRESH_TIMER);
    };
        
    //Messages Methods
    
    /**
     * Once a player enters the room, we need to ask who they are.
     */
    self.whois = function(player) {
        var key = CharacterManager.activeCharacter().key();
        var roomId = ConnectionManager.findBy(key)[0].roomId();
        messenger.sendDataMsg(roomId, self._getWhoisId(player.id), {});
    };
    
    /**
     * When I receive a 'whois me' message, respond to it.
     */
    self.whoami = function() {
        try {
            var key = CharacterManager.activeCharacter().key();
            var roomId = ConnectionManager.findBy(key)[0].roomId();
        
            //Only respond if you're a player.
            var type = CharacterManager.activeCharacter().playerType().key;
            if (type === PlayerTypes.characterPlayerType.key) {
                messenger.sendDataMsg(roomId, 'iam', self._getPlayerData());
            }
        } catch(err) { /*Ignore*/ }
    };
    
    /**
     * Add a player's info to the list.
     */
    self.addPlayer = function(data) {
        var player = new PlayerSummary();
        player.importValues(data);
    
        var found = self.playerSummaries.some(function(e, i, _) {
            return player.id() === e.id();
        });
        
        if (found) {
            //Replace the existing one.
            for(var i=0; i<self.playerSummaries.length;i++) {
                if (player.id() === self.playerSummaries[i].id()) {
                    self.playerSummaries[i] = player;
                }            
            }
        } else {
            //Add a new one.
            self.playerSummaries.push(player);
        }
        Notifications.playerSummary.changed.dispatch();
    };
    
    /** 
     * Remove the player from our watch list.
     */ 
    self.removePlayer = function(player) {
        self.playerSummaries = self.playerSummaries.filter(function(e, i, _) {
            return e.id() !== player.id;
        });
        Notifications.playerSummary.changed.dispatch();
    };
    
    //Private Methods
    
    /**
     * Return the player's summary data.
     */
    self._getPlayerData = function() {        
        var key = CharacterManager.activeCharacter().key();
        return PlayerSummary.findBy(key).exportValues();
    };
    
    /**
     * Returns a whois key for a given player id.
     */
    self._getWhoisId = function(key) {
        return 'whois+' + key;
    };

}
