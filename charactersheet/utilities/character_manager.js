"use strict";

var CharacterManager = {};

CharacterManager.changeCharacter = function(characterId) {
	var newChar = Character.findBy(characterId);
    try {
	    Notifications.characterManager.changing.dispatch(
	        CharacterManager.activeCharacter(), newChar[0]);
		Character.findAll().forEach(function(e, i, _) {
			e.isActive(false);
			e.save();
		});
		newChar[0].isActive(true);
		newChar[0].save();
		Notifications.characterManager.changed.dispatch(
		    CharacterManager.activeCharacter());
	} catch(err) {};
};

CharacterManager.activeCharacter = function() {
    try {
        return Character.findAll().filter(function(e, i, _) {
            return e.isActive();
        })[0];
    } catch(err) {
        return CharacterManager.defaultCharacter();
    }
};

CharacterManager.defaultCharacter = function() {
    try {
        return Character.findAll().filter(function(e, i, _) {
            return e.isDefault();
        })[0];
    } catch(err) {
        return null; 
    }
};
