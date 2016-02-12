"use strict";

var MockCharacterManager = {};


/**
 * Returns a player character with the key '1234'.
 */
MockCharacterManager.activeCharacter = function() {
    var c = new Character();
    c.key('1234');
    c.playerType(PlayerTypes.characterPlayerType);
    return c;
};
