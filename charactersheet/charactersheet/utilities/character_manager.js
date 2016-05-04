'use strict';

var CharacterManager = {
    __activeCharacter__: null
};

CharacterManager.changeCharacter = function(characterId) {
    var newChar = Character.findBy(characterId);
    try {
        Notifications.characterManager.changing.dispatch(
            CharacterManager.activeCharacter(), newChar[0]);
        CharacterManager.__activeCharacter__ = newChar[0];
        Notifications.characterManager.changed.dispatch(
            CharacterManager.activeCharacter());
    } catch(err) { /*Ignore*/ }
};

CharacterManager.activeCharacter = function() {
    if (CharacterManager.__activeCharacter__) {
        return CharacterManager.__activeCharacter__;
    } else if (CharacterManager.defaultCharacter()) {
        return CharacterManager.defaultCharacter();
    } else {
        return null;
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
