"use strict";

/**
 * A module that listens for changes in the Profile and Campaign models
 * and summarizes the data, then sends it over the wire.
 */
function PlayerSummaryViewModel() {
    var self = this;
    
    self.playerSummaries = ko.observableArray([]);
    
    self.init = function() {};

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        messenger.subscribe('data', self._getWhoisId(key), self.whoami);
        messenger.subscribe('data', 'iam', self.addPlayer);
    
        players.onPlayerEnters(self.whois);    
        players.onPlayerLeaves(self.removePlayer);
        
        ProfileSignaler.changed.add(self.whoami);   
        StatsSignaler.changed.add(self.whoami);   
    };
    
    self.unload = function() {
        
    };
    
    //Messages Methods
    
    /**
     * Once a player enters the room, we need to ask who they are.
     */
    self.whois = function(player) {
        var roomId = ConnectionManager.find().roomId();
        messenger.sendDataMsg(roomId, self._getWhoisId(player.id), {})
    };
    
    /**
     * When I receive a 'whois me' message, respond to it.
     */
    self.whoami = function() {
        var roomId = ConnectionManager.find().roomId();
        messenger.sendDataMsg(roomId, 'iam', self._getPlayerData())
    };
    
    /**
     * Add a player's info to the list.
     */
    self.addPlayer = function(player) {
        var res = self.playerSummaries().filter(function(e, i, _) {
            player.characterId === e.characterId;
        });
        
        if (res.length > 0) {
            //Replace the existing one.
            res = self.playerSummaries().forEach(function(e, i, players) {
                if (player.characterId === e.characterId) {
                    players[i] = player;
                }
            });
        } else {
            //Add a new one.
            self.playerSummaries.push(player);
        }
    };
    
    /** 
     * Remove the player from our watch list.
     */ 
    self.removePlayer = function(player) {
        self.playerSummaries.remove(player);
    };
    
    //Private Methods
    
    /**
     * Return the player's summary data.
     */
    self._getPlayerData = function() {        
        var key = CharacterManager.activeCharacter().key();
        var profile = Profile.findBy(key);
        if (profile.length > 0) {
            return PlayerSummary.fromProfile(profile[0]);
        }
    };
    
    /**
     * Returns a whois key for a given player id.
     */
    self._getWhoisId = function(key) {
        return 'whois+' + key;
        
    };
};
