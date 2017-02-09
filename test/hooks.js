'use strict'

beforeEach(function() {
    simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
});