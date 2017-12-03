import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { FeaturesTraits } from 'charactersheet/models';
import { FeaturesTraitsViewModel } from 'charactersheet/viewmodels/character/feat_traits';
import { MockCharacterManager } from '../mocks';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import simple from 'simple-mock';

describe('FeaturesTraitsViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load values from db', function() {
            var feat = new FeaturesTraits();
            simple.mock(PersistenceService, 'findBy').returnWith([feat]);
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var featsVM = new FeaturesTraitsViewModel();
            feat.ideals('test');

            featsVM.load();
            featsVM.featTraits().ideals().should.equal('test');
        });

        it('should not load values from database.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').returnWith([]);
            var featsVM = new FeaturesTraitsViewModel();

            featsVM.load();
            featsVM.featTraits().characterId().should.equal('12345');
        });
    });
});
