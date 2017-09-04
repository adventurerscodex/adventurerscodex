import simple from 'simple-mock'

import { CharacterManager } from 'charactersheet/charactersheet/utilities'

import { MockCharacterManager } from './mocks/mock_character_manager.js'

beforeEach(function() {
    simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
});
