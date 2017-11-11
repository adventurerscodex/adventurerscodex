import simple from 'simple-mock';

import { CharacterManager } from 'charactersheet/utilities';

import { MockCharacterManager } from './mocks';

beforeEach(function() {
    simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
});
