/*eslint no-console:0 */

import { Character } from 'charactersheet/models/common/character';
import { Notifications } from 'charactersheet/utilities/notifications';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import URI from 'urijs';

/**
 * The Character Manager is responsible for determining and alerting others of
 * changes regarding the current active character that the user wishes to interact
 * with. It is also responsible for setting the current character ID to the URL fragment
 * and parsing the URL fragments at launch.
 */
export var CharacterManager = {
    __activeCharacter__: null,
    CHARACTER_ID_FRAGMENT_KEY: 'c',

    /**
     * Do Initial Character Manager Setup.
     *
     * Note: The Character Manager init must be called for the character manager
     * to detect any character IDs in the URL.
     */
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

    /**
     * Change the active character to the character with the given ID.
     *
     * Note: This method will dispatch notifications to the rest of the app
     * to notify others of this change.
     */
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

    /**
     * Fetch the current Active Character if there is one.
     */
    activeCharacter: function() {
        if (CharacterManager.__activeCharacter__) {
            return CharacterManager.__activeCharacter__;
        } else {
            return null;
        }
    },

    /**
     * Sets the character id fragment in the URL and the full
     * character to internal storage.
     */
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
