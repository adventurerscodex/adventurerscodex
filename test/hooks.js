import * as Hypnos from 'hypnos';
// import { CharacterManager } from 'charactersheet/utilities';
import { MockCharacterManager } from './mocks';
import simple from 'simple-mock';

beforeEach(function() {
//     simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

    simple.mock(Hypnos, 'InstanceToken').returnWith({});
    simple.mock(Hypnos, 'ModelToken').resolveWith({});
});
