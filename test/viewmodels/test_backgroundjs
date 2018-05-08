import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { Background } from 'charactersheet/models';
import { BackgroundViewModel } from 'charactersheet/viewmodels/character/background';
import { MockCharacterManager } from '../mocks';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import simple from 'simple-mock';

describe('BackgroundViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var feat = new Background();
            simple.mock(PersistenceService, 'findBy').returnWith([feat]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var featsVM = new BackgroundViewModel();
            feat.ideals('test');

            featsVM.load();
            featsVM.featTraits().ideals().should.equal('test');
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').returnWith([]);
            var featsVM = new BackgroundViewModel();

            featsVM.load();
            featsVM.featTraits().characterId().should.equal('12345');
        });
    });
});
