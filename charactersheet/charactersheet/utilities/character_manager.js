'use strict';
/*eslint no-console:0 */
export var CharacterManager = {
    __activeCharacter__: null
};

CharacterManager.changeCharacter = function(characterId) {
    var newChar = PersistenceService.findBy(Character, 'key', characterId);
    try {
        Notifications.characterManager.changing.dispatch(
            CharacterManager.activeCharacter(), newChar[0]);
        CharacterManager.__activeCharacter__ = newChar[0];
        Notifications.characterManager.changed.dispatch(
            CharacterManager.activeCharacter());
    } catch(err) {
        console.log(err);
    }
};

CharacterManager.activeCharacter = function() {
    if (CharacterManager.__activeCharacter__) {
        return CharacterManager.__activeCharacter__;
    } else {
        return null;
    }
};
