/*eslint no-console:0 */

import { Character } from 'charactersheet/models/common/character';
import { Notifications } from 'charactersheet/utilities/notifications';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';

export var CharacterManager = {
    __activeCharacter__: null
};

CharacterManager.changeCharacter = function(characterId) {
    var newChar = PersistenceService.findFirstBy(Character, 'key', characterId);
    try {
        Notifications.characterManager.changing
            .dispatch(CharacterManager.activeCharacter(), newChar);
        CharacterManager.__activeCharacter__ = newChar;
        Notifications.characterManager.changed
            .dispatch(CharacterManager.activeCharacter());
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
