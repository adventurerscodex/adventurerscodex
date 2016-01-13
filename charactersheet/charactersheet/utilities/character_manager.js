"use strict";

var CharacterManagerSignaler = {
	changing: new signals.Signal(),
	changed: new signals.Signal() 
};

var CharacterManager = {};

CharacterManager.changeCharacter = function(characterId) {
	var newChar = Character.findBy(characterId);
	if (newChar.length > 0) {
	    CharacterManagerSignaler.changing.dispatch(
	        CharacterManager.activeCharacter(), newChar[0]);
		Character.findAll().forEach(function(e, i, _) {
			e.isActive(false);
			e.save();
		});
		newChar[0].isActive(true);
		newChar[0].save();
		CharacterManagerSignaler.changed.dispatch(
		    CharacterManager.activeCharacter());
	}
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
            console.log(e);
            return e.isDefault();
        })[0];
    } catch(err) {
        return null; 
    }
};
