'use strict';

/**
 * A model that keeps track of the active players in the room.
 * The model tracks players that come into the room, and considers
 * them gone when they haven't responded for some time.
 * 
 * @signals Notifications.connectedPlayers.playerEntered
 * @signals Notifications.connectedPlayers.playerLeft
 */
function PlayersService() {
    var self = this;
    
    self.SAY_HI_TIMER = 5000;
    self.PLAYER_EXPIRED_TIMEOUT = 22000;
    
    self.inRoom = [];
    
    self.init = function() {
        messenger.subscribe('data', 'hello?', self.handleHello);
        messenger.subscribe('data', 'goodbye!', self.handleGoodBye);
        messenger.subscribe('system', 'yay, welcome', function() {
            setInterval(self.sayHello, self.SAY_HI_TIMER);
            self.sayHello();
        });
        
        Notifications.global.unload.add(self.unload);
    };
    
    self.unload = function() {
        self.sayGoodBye();
    };
    
    //Public methods.
    
    /**
     * When the player first connects to the room, they should let 
     * everyone know they're there by saying 'hello'.
     */
    self.sayHello = function() {
        var player = new Player();
        var character = CharacterManager.activeCharacter();
        player.id = character.key();
        messenger.sendDataMsg(
            ConnectionManager.findBy(character.key())[0].roomId(),
            'hello?', player);
    };
    
    /**
     * When a player receives a hello message, add that player to the active list.
     * Also, check the list for any players that havent responded recently and 
     * remove them.
     */    
    self.handleHello = function(player) {
        player.lastPing = (new Date).getTime();
        var playerInRoom = self.inRoom.some(function(a) {
            return a.id === player.id;
        });
        //Add them if they don't exist.
        if (!playerInRoom) {
            self.inRoom.push(player);
            Notifications.connectedPlayers.playerEntered.dispatch(player);
        } 
        //Update the last ping time if they're already there.
        else {
            self.inRoom = self.inRoom.map(function(e, i, _) {
                if (e.id === player.id) {
                    e.lastPing = player.lastPing;
                }
                return e;
            });
        }
    };
    
    /**
     * When the player is going to leave the room, it's only 
     * polite to say goodbye first.
     */
    self.sayGoodBye = function() {
        var player = new Player();
        player.id = CharacterManager.activeCharacter().key();
        try {
            messenger.sendDataMsg(
                ConnectionManager.findBy(player.id)[0].roomId(), 'goodbye!', player);
        } catch(err) { /*Ignore*/ }
    };
    
    /**
     * When a goodbye is received, remove that player from the active list.
     */
    self.handleGoodBye = function(player) {
        self.inRoom = self.inRoom.filter(function(p, i, _) {
            return p.id !== player.id;
        });
        Notifications.connectedPlayers.playerLeft.dispatch(player);
    };
};


function Player() {
    var self = this;
    self.id = '';    
    self.lastPing = 0;
};

