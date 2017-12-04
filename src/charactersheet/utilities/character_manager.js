/*eslint no-console:0 */

import { Character } from 'charactersheet/models/common/character';
import { Notifications } from 'charactersheet/utilities/notifications';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import URI from 'urijs';


export var CharacterManager = {
    __activeCharacter__: null,
    CHARACTER_ID_FRAGMENT_KEY: 'c',


    init: function() {
        var fragments = (new URI()).fragment(true);
        var key = fragments[CharacterManager.CHARACTER_ID_FRAGMENT_KEY];
        if (key) {
            var character = PersistenceService.findFirstBy(Character, 'key', key);
            if (character) {
                CharacterManager._setActiveCharacter(character);
            }
        }
    },


    changeCharacter: function(characterId) {
        var newCharacter = PersistenceService.findFirstBy(Character, 'key', characterId);
        try {
            Notifications.characterManager.changing.dispatch(
                CharacterManager.activeCharacter(),
                newCharacter
            );
            CharacterManager._setActiveCharacter(newCharacter);

            Notifications.characterManager.changed.dispatch(
                CharacterManager.activeCharacter()
            );
        } catch(err) {
            console.log(err);
        }
    },


    activeCharacter: function() {
        if (CharacterManager.__activeCharacter__) {
            return CharacterManager.__activeCharacter__;
        } else {
            return null;
        }
    },


    _setActiveCharacter: function(character) {
        var uri = new URI();
        uri.removeFragment(CharacterManager.CHARACTER_ID_FRAGMENT_KEY);
        uri.addFragment(
            CharacterManager.CHARACTER_ID_FRAGMENT_KEY,
            character.key()
        );
        window.location = uri.toString();

        CharacterManager.__activeCharacter__ = character;
    }
};
