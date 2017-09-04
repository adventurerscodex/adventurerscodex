import simple from 'simple-mock'

import { CharacterManager } from '../charactersheet/charactersheet/utilities'


beforeEach(function() {
    simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
});
