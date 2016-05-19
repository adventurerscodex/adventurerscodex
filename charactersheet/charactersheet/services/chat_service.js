'use strict';

/**
 * This service handles the communication between characters in the chat.
 * To send messages, clients must choose s room from `ChatService.rooms`.
 *
 * @see ChatRoom
 */
function ChatService() {
    var self = this;

    self.REFRESH_TIMER = 5000;
    self.rooms = [];

    /**
     * Before any function of the chat service can be used, the service
     * must be initialized.
     * @see `ChatService.load`
     */
    self.init = function() {
        Notifications.connectedPlayers.playerEntered.add(self.whatRooms);
        Notifications.connectedPlayers.playerLeft.add(self.whatRooms);
    };

    /**
     * Sets up subscriptions to a user's notifications.
     */
    self.load = function() {
        messenger.subscribe('data', self._getWhatRoomsId(), self.theseRooms);
        messenger.subscribe('data', 'theserooms', self.handleTheseRooms);

        //Refresh the data every few seconds.
        self.checkInterval = setInterval(function() {
            players.inRoom.forEach(function(e, i, _) {
                self.whois(e);
            });
        }, self.REFRESH_TIMER);
    };

    /**
     * Tears down a user's connection to the room.
     */
    self.unload = function() {


        clearInterval(self.checkInterval);
    };

    /**
     * Given a room key, return the given chat room.
     * @param key {string} a key for a given room.
     */
    self.roomForKey = function(key) {
        return self.rooms.filter(function(e, i, _) {
            return e.key = key;
        })[0];
    };

    /**
     * Creates a new chat room.
     * @param roomOptions {object} a config object for the room.
     * @returns roomKey {string} a key for the given room.
     * @see ChatRoom
     */
    self.addRoom = function(roomOptions) {
        var room = new ChatRoom(roomOptions);
        self.rooms.push(room);
        return room.key;
    };

    /**
     * Asks the server which rooms are available for this user.
     */
    self.whatRooms = function() {

    };

    /**
     * Answers requests with a list of available rooms.
     */
    self.theseRooms = function() {

    };

    /**
     * Given an response from the peers in the party, handle adding new rooms.
     */
    self.handleTheseRooms = function() {

    };

    /**
     * Given a characterkey, return the message id to address this user.
     */
    self._getWhatRoomsId = function() {
        var key = CharacterManager.activeCharacter().key();
        return 'whatrooms+' + key;
    };
}
